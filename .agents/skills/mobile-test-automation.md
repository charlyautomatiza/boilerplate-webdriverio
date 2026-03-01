---
name: mobile-test-automation
description: |
  Generalist skill for designing, implementing, and maintaining mobile application
  test automation across iOS and Android platforms. Applies to any automation
  framework (Appium, XCUITest, Espresso, Detox, WebdriverIO, etc.) and any
  test runner (Mocha, Jest, Jasmine, JUnit, XCTest, etc.).
version: "1.0.0"
tags:
  - mobile
  - testing
  - automation
  - ios
  - android
  - quality-assurance
---

# Skill: Mobile Test Automation

## Overview

This skill covers the full spectrum of mobile end-to-end and component test
automation for native, hybrid, and web-based mobile applications on iOS and
Android. It is intentionally framework-agnostic so it can be applied to any
toolchain, language, or CI/CD environment.

---

## Core Competencies

### 1. Test Architecture & Design Patterns

- **Page Object Model (POM)** — Encapsulate each screen's selectors and
  interactions in a dedicated class. Specs interact only with Page Objects,
  never with raw selectors directly.
- **Screenplay Pattern** — Model actors, tasks, and questions when a richer
  abstraction layer is needed over POM.
- **Data-Driven Testing (DDT)** — Externalise test inputs to data files
  (JSON, CSV, YAML) and iterate with `for…of`; avoid duplicating test logic.
- **AAA (Arrange / Act / Assert)** — Structure every test case with clear,
  commented phases for readability and triage.
- **DRY / SOLID** — Extract shared setup/teardown into `beforeEach`/`afterEach`
  hooks; depend on abstractions, not concrete implementations.

### 2. Element Localisation Strategy

Prefer locators in this priority order (highest stability to lowest):

| Priority | Strategy | When to Use |
|---|---|---|
| 1 | **Accessibility ID** | When the app exposes `content-desc` (Android) or `accessibilityIdentifier` (iOS) |
| 2 | **Resource ID** (Android) | When accessibility labels are absent on Android |
| 3 | **Predicate String / Class Chain** (iOS) | Preferred over XPath on iOS |
| 4 | **Optimised XPath** | Last resort — keep predicates specific; never use index-based paths |

Rules:
- Never select elements by index (e.g. `(//android.widget.TextView)[3]`).
- Selectors belong exclusively in Page Object getters — not in spec files.
- Document the chosen locator strategy in a comment on each getter.

### 3. Waiting Strategy

Hard-coded sleeps (`sleep`, `pause`, `Thread.sleep`) are **strictly prohibited**.
Use smart, condition-based waits instead:

| Goal | Approach |
|---|---|
| Wait for element to appear | Assertion-based wait (`expect(el).toBeVisible()`) |
| Wait for element text | Text matcher with built-in retry |
| Explicit element wait | Framework wait API (`waitForDisplayed`, `waitForEnabled`, etc.) |
| Complex compound condition | `waitUntil(condition, { timeout, interval })` |
| Network / animation idle | Framework idle hooks or polling with timeout |

Default wait timeout should be configurable (recommended: **10 000 ms**); only
override when a longer wait is genuinely justified.

### 4. Typing & Code Quality

- All function parameters and return types must be explicitly annotated — no
  implicit `any` / untyped variables.
- Use language-native strict checking (`strict: true` in TypeScript,
  `@NonNull` in Kotlin/Java, etc.).
- Prefer interfaces/protocols over concrete types for data shapes.
- Async interactions must use `async/await` (or equivalent); avoid raw
  promise chains in test code.

### 5. Platform Considerations

#### Android
- Use `UiAutomator2` (or equivalent native driver) for best stability.
- Guard Android-only code with platform checks (e.g. `driver.isAndroid`).
- Capabilities to define: `platformName`, `deviceName`, `platformVersion`,
  `automationName`, `appPackage`, `appActivity`, `app`.

#### iOS
- Use `XCUITest` (or equivalent native driver) for best stability.
- Guard iOS-only code with platform checks (e.g. `driver.isIOS`).
- Capabilities to define: `platformName`, `deviceName`, `platformVersion`,
  `automationName`, `bundleId`, `app`.

#### Cross-platform
- Abstract platform differences behind a shared Page Object interface.
- Use Accessibility IDs wherever possible — they work on both platforms.

### 6. Gesture Automation

Use the framework's native action/gesture API — not deprecated legacy APIs:

- **Scroll / Swipe** — pointer/touch action sequences with `move → down → move → up`.
- **Long-press** — pointer down with a hold `pause`, then up.
- **Pinch / Zoom** — multi-pointer sequences.
- **Drag & Drop** — combined pointer move sequences.

Use `duration` parameters inside gesture sequences for timing; never insert
`sleep` calls between gesture steps.

### 7. Test Data Management

- Store test data in external files (`*.json`, `*.csv`, `*.yaml`).
- Load data at `describe`-scope (before test generation); validate the array
  is non-empty before generating cases.
- Never hard-code credentials, user IDs, or environment-specific values in
  spec files.

### 8. Reporting

- Attach screenshots and video on test failure automatically.
- Use structured reporters (Allure, JUnit XML, etc.) compatible with your CI
  system for trend analysis.
- Provide descriptive assertion failure messages to speed up triage.

---

## CI/CD Integration Principles

| Concern | Guideline |
|---|---|
| Emulator/Simulator boot | Pre-warm devices before running tests; use CI-native actions where available |
| Parallelism | Run Android and iOS suites in separate jobs; use a device matrix for multi-version coverage |
| Artifact retention | Upload test reports and failure screenshots as CI artifacts |
| Dependency caching | Cache package manager directories to reduce install time |
| Environment secrets | Store credentials in CI secrets, never in source code |
| Triggers | Run full suite on PRs targeting the main branch; run smoke suite on every push |

---

## Anti-Patterns to Avoid

| Anti-Pattern | Preferred Alternative |
|---|---|
| Hard-coded sleep / pause | Condition-based smart wait |
| Inline selectors in spec files | Page Object getters |
| Index-based XPath | Accessibility ID or resource-id selector |
| `any` / untyped variables | Precise types or interfaces |
| Hard-coded credentials | External data files + CI secrets |
| `forEach` for async test generation | `for…of` loop |
| Deprecated gesture APIs | Framework's current pointer/action API |
| Single monolithic spec file | One spec file per feature area |

---

## Examples

### Page Object (framework-agnostic pseudocode)

```typescript
class LoginPage {
    // Selector in Page Object getter — never in spec
    get usernameField() { return $('~input-username'); }
    get passwordField() { return $('~input-password'); }
    get submitButton()  { return $('~button-login'); }

    async login(username: string, password: string): Promise<void> {
        await this.usernameField.setValue(username);
        await this.passwordField.setValue(password);
        await this.submitButton.click();
    }
}
export default new LoginPage();
```

### Data-Driven Test (framework-agnostic pseudocode)

```typescript
const data = loadExternalData('loginData.json');
if (!data.length) throw new Error('Data file is empty');

describe('Login', () => {
    for (const row of data) {
        it(`should handle: ${row.scenario}`, async () => {
            // Arrange
            await LoginPage.open();
            // Act
            await LoginPage.login(row.username, row.password);
            // Assert
            await expect(ResultPage.message).toHaveText(row.expected, {
                message: `Unexpected result for scenario: ${row.scenario}`,
            });
        });
    }
});
```

### Platform Capability Types (TypeScript)

```typescript
interface AndroidCapabilities {
    platformName: 'Android';
    'appium:deviceName': string;
    'appium:platformVersion': string;
    'appium:automationName': 'UiAutomator2';
    'appium:appPackage': string;
    'appium:appActivity': string;
    'appium:app': string;
}

interface IOSCapabilities {
    platformName: 'iOS';
    'appium:deviceName': string;
    'appium:platformVersion': string;
    'appium:automationName': 'XCUITest';
    'appium:bundleId': string;
    'appium:app': string;
}

type MobileCapabilities = AndroidCapabilities | IOSCapabilities;
```
