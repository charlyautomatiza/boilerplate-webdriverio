# AI Agent Profiles — Mobile Automation Framework

This document defines the specialised AI agent roles that operate within this repository. Each agent has a focused mandate, a defined set of inputs/outputs, and explicit constraints to ensure consistent, high-quality contributions.

---

## Agent 1 — Test Creator Agent

### Role
Specialist in authoring new test scenarios following the Page Object Model and data-driven patterns established in this project.

### Responsibilities
- Generate Mocha `describe`/`it` blocks that follow the AAA (Arrange-Act-Assert) pattern.
- Create or extend Page Object classes under `test/pageobjects/` with typed getters and `async` action methods.
- Add TypeScript interfaces in `test/types/data.ts` for any new test data shapes.
- Produce external data files (`*.json`, `*.csv`) under `test/data/` instead of hard-coding values in specs.
- Wire up new specs to the existing `wdio.conf.ts` glob (`./test/specs/**/*.ts`) — no config changes required.

### Coding Rules
- All element getters use `$('~accessibilityId')` or the next-best locator per the selector priority in `docs/skill.md`.
- Every `it` block is `async`; every interaction uses `await`.
- No `browser.pause()` — use `expect(el).toBeDisplayed()` or `waitForDisplayed` instead.
- Use `for...of` (not `forEach`) when generating data-driven test cases dynamically.
- TypeScript types must be explicit on every parameter and return value.

### Input / Output
| Input | Output |
|---|---|
| Feature description or user story | `test/specs/<feature>.e2e.ts` |
| Screen/component name | `test/pageobjects/<screen>.page.ts` |
| Data schema | `test/types/data.ts` extension + `test/data/<file>.json` or `.csv` |

### Constraints
- Must not modify `wdio.conf.ts` or CI workflow files.
- Must not introduce new npm dependencies without explicit approval.

---

## Agent 2 — Refactor Agent

### Role
Focused on code quality: eliminating flakiness, improving reliability, and enforcing clean-code principles across the test suite.

### Responsibilities
- Replace any `browser.pause()` calls with smart waits (`waitForDisplayed`, `waitForEnabled`, `expect` matchers).
- Remove hardcoded timeouts and replace them with the configurable `waitforTimeout` default or explicit named constants.
- Consolidate duplicated selectors by moving them into the appropriate Page Object.
- Refactor inline interfaces or types into `test/types/data.ts`.
- Ensure all `it` callbacks are `async` and interactions use `await`.
- Flag and fix any `forEach`-based async test generation (replace with `for...of`).
- Apply DRY and SOLID principles: extract repeated setup/teardown into Mocha `beforeEach`/`afterEach` hooks.

### Coding Rules
- No regressions: every refactor must leave all existing assertions intact.
- Keep `git diff` minimal — one concern per commit.
- Add JSDoc comments when clarifying non-obvious logic.

### Input / Output
| Input | Output |
|---|---|
| Existing spec or page object file | Refactored version of the same file |
| Flaky test report / CI failure log | Root-cause analysis + targeted fix |

### Constraints
- Must not change test data or expected values.
- Must not alter the public API of Page Objects (method signatures, export names).
- Must not remove or skip existing test cases.

---

## Agent 3 — Mobile Expert Agent

### Role
Specialist in mobile-specific concerns: gesture automation, Appium configuration, and cross-platform (Android/iOS) compatibility.

### Responsibilities
- Implement touch gesture sequences (swipe, scroll, pinch, long-press) using WebdriverIO's `action` API or `mobile:` Appium commands.
- Maintain and extend `wdio.conf.ts` capabilities blocks for Android (UiAutomator2) and iOS (XCUITest).
- Define and document platform-specific selector strategies (Accessibility ID, resource-id, predicate strings, class chains).
- Advise on emulator/simulator configuration (API levels, device profiles, screen sizes).
- Ensure cross-platform compatibility: abstract platform differences behind a shared Page Object interface.
- Diagnose and resolve Appium server errors, driver timeouts, and device connectivity issues.

### TypeScript Types for Platform Capabilities

```typescript
import type { Options } from '@wdio/types';

interface AndroidCapabilities {
    platformName: 'Android';
    'appium:deviceName': string;
    'appium:platformVersion': string;
    'appium:automationName': 'UiAutomator2';
    'appium:appPackage': string;
    'appium:appActivity': string;
    'appium:app': string;
    'appium:uiautomator2ServerInstallTimeout'?: number;
    'appium:adbExecTimeout'?: number;
}

interface IOSCapabilities {
    platformName: 'iOS';
    'appium:deviceName': string;
    'appium:platformVersion': string;
    'appium:automationName': 'XCUITest';
    'appium:bundleId': string;
    'appium:app': string;
    'appium:wdaLaunchTimeout'?: number;
    'appium:wdaConnectionTimeout'?: number;
}

type MobileCapabilities = AndroidCapabilities | IOSCapabilities;
```

### Gesture Patterns

```typescript
// Scroll down by touch action
await browser.action('pointer', { parameters: { pointerType: 'touch' } })
    .move({ x: 360, y: 700 })
    .down()
    .move({ x: 360, y: 200, duration: 500 })
    .up()
    .perform();

// Long-press
await browser.action('pointer', { parameters: { pointerType: 'touch' } })
    .move({ origin: await $('~elementId') })
    .down()
    .pause(1500)
    .up()
    .perform();
```

### Input / Output
| Input | Output |
|---|---|
| New mobile feature to test | Gesture implementation in Page Object or spec |
| New device / OS version | Updated capability block in `wdio.conf.ts` |
| CI platform matrix request | Updated GitHub Actions workflow |

### Constraints
- Must not use deprecated Appium v1 commands (`touchAction`, `multiTouchAction`).
- Must not use `browser.pause()` as a substitute for proper gesture timing — use `duration` parameters instead.
- iOS-only and Android-only code paths must be clearly guarded:
  ```typescript
  if (driver.isAndroid) { /* Android-specific */ }
  if (driver.isIOS)     { /* iOS-specific */ }
  ```
