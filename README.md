<p align="center">
  <a href="https://www.youtube.com/c/CharlyAutomatiza?sub_confirmation=1"><img src="https://img.shields.io/badge/CharlyAutomatiza-Youtube-FF0000.svg" style="max-height: 300px;"></a>
  <a href="https://discord.gg/wwM9GwxmRZ"><img src="https://img.shields.io/badge/CharlyAutomatiza-Discord-5865F2.svg?style=flat" style="max-height: 300px;"></a>
  <a href="http://x.com/char_automatiza"><img src="https://img.shields.io/badge/@char__automatiza-X-000000.svg?style=flat" style="max-height: 300px;"></a>
  <a href="https://www.linkedin.com/in/gautocarlos/"><img src="https://img.shields.io/badge/Carlos%20 Gauto-LinkedIn-0077B5.svg" style="max-height: 300px;"></a>
  <a href="https://charlyautomatiza.tech"><img src="https://img.shields.io/badge/Website-charlyautomatiza.tech-4285F4.svg?style=flat" style="max-height: 300px;"></a>
  <a href="https://dev.to/charlyautomatiza"><img src="https://img.shields.io/badge/CharlyAutomatiza-DEV.to-0A0A0A.svg?style=flat" style="max-height: 300px;"></a>
  <a href="https://www.instagram.com/charlyautomatiza/"><img alt="Instagram" src="https://img.shields.io/badge/CharlyAutomatiza-Instagram-E4405F.svg?style=flat" style="max-height: 300px;"></a>
  <a href="https://www.twitch.tv/charlyautomatiza"><img alt="Twitch" src="https://img.shields.io/badge/CharlyAutomatiza-Twitch-9146FF.svg" style="max-height: 300px;"></a>
</p>

<p align="center">
    <a href="https://webdriver.io/">
        <img alt="WebdriverIO" src="https://webdriver.io/assets/images/robot-3677788dd63849c56aa5cb3f332b12d5.svg" width="146">
    </a>
</p>

# WebdriverIO Boilerplate

This repository contains a starter boilerplate for working with [WebdriverIO](https://webdriver.io/), a test automation framework for web browsers and mobile applications.

## Prerequisites

Make sure you have Node.js installed. Download it from [nodejs.org](https://nodejs.org/).

Recommended setup resources:

* Blog guide: [Appium v2 Android Setup Guide](https://bit.ly/appium-v2-android-setup)
* YouTube video: [Appium v2 - WebdriverIO](https://bit.ly/3UEQbHt) (some CLI options may have changed since recording)

## Installation

1. Clone this repository:

```bash
git clone https://github.com/charlyautomatiza/boilerplate-webdriverio.git
```

2. Change into the project directory:

```bash
cd boilerplate-webdriverio
```

3. Install dependencies:

```bash
npm install
```

## Running Tests

Download the latest release of the [WebdriverIO Native Demo (Guinea Pig) App](https://github.com/webdriverio/native-demo-app/releases) for Android (and iOS if needed).

Create a folder named `app` at the project root and place the APK there to avoid path issues.

After configuring your environment variables (ANDROID_HOME / Java etc.), run the tests:

```bash
npm run wdio
```

This command runs the E2E tests and produces Allure + JUnit reports.

## Open the Combined Allure Report

```bash
npm run open-report
```

## Continuous Integration: Android Emulator (GitHub Actions)

The included GitHub Actions workflow automatically runs the E2E tests on an Android emulator. It:

- Downloads the demo APK into `app/`
- Grants required emulator permissions
- Boots an Android emulator (API 34 / Android 14) via `reactivecircus/android-emulator-runner`
- Installs dependencies (Node.js, Appium, WebdriverIO, etc.)
- Executes the E2E tests
- Publishes Allure and JUnit results as artifacts

Triggers: on every push or pull request to `main`.

See `.github/workflows/android-emulator.yml` for full details.

## Advanced Examples in `test.e2e.ts`

This project showcases advanced testing patterns (order reflects appearance in the spec file):

### 1. Basic Login Test
Validates the core happy path (sanity check for environment, selectors, and app readiness).

```typescript
it('should login with valid credentials', async () => {
    await LoginPage.loginBtn.click();
    await LoginPage.login('tomsmith@mail.com', 'SuperSecretPassword!');
    await expect(AlertPage.messageAlert).toHaveText(expect.stringContaining('You are logged in!'));
});
```

### 2. AAA Pattern (Arrange-Act-Assert)
Clarifies test intent by separating setup, action, and verification.

```typescript
it('should login successfully following the AAA pattern', async () => {
    // Arrange
    await LoginPage.loginBtn.click();
    await expect(LoginPage.inputUsername).toBeDisplayed();
    await expect(LoginPage.inputPassword).toBeDisplayed();
    await expect(LoginPage.btnSubmit).toBeDisplayed();
    // Act
    await LoginPage.login('tomsmith@mail.com', 'SuperSecretPassword!');
    // Assert
    await expect(AlertPage.messageAlert).toHaveText(
        expect.stringContaining('You are logged in!'),
        { message: 'Confirmation message is not the expected one' }
    );
});
```

### 3. Data-Driven Testing (DDT) with JSON
Each JSON row generates its own test case using a `for...of` loop for granular reporting.

```typescript
// Load JSON data once
const jsonData: LoginData[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

for (const row of jsonData) {
    it(`DDT JSON - User: "${row.username}" → message: "${row.expectedMessage}"`, async () => {
        // Arrange
        await LoginPage.loginBtn.click();
        // Act
        await LoginPage.login(row.username, row.password);
        // Assert (implicit wait via expect)
        await expect(AlertPage.messageAlert).toHaveText(
            expect.stringContaining(row.expectedMessage),
            { message: `Expected message: "${row.expectedMessage}" for user: ${row.username}` }
        );
    });
}
```

**Data file:** `test/data/loginData.json`
```json
[
  { "username": "tomsmith@mail.com", "password": "SuperSecretPassword!", "expectedMessage": "You are logged in!" },
  { "username": "user@test.com", "password": "TestPass123!", "expectedMessage": "You are logged in!" },
  { "username": "admin@example.com", "password": "Admin2024!", "expectedMessage": "You are logged in!" }
]
```

### 4. Data-Driven Testing (DDT) with CSV
CSV parsing transforms raw text into structured objects. Each row becomes an independent test for clearer failure isolation.

```typescript
// Load and parse CSV at runtime
const csvContent = fs.readFileSync(filePath, 'utf-8');
const lines = csvContent.trim().split('\n');

const userData: UserData[] = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.replace(/"/g, '').trim());
    return {
        username: values[0],
        password: values[1],
        expectedAction: values[2]
    };
});

for (const row of userData) {
    it(`DDT CSV - User: "${row.username}" → expected action: ${row.expectedAction}` , async () => {
        // Arrange
        await LoginPage.loginBtn.click();
        // Act
        await LoginPage.login(row.username, row.password);
        // Assert
        await expect(AlertPage.messageAlert).toHaveText(
            expect.stringContaining(row.expectedAction)
        );
    });
}
```

**Data file:** `test/data/buttonsData.csv`
```csv
username,password,expectedAction
user1@test.com,Pass123!,login_success
user2@test.com,Pass456!,login_success
```

### (Moved Above) AAA Pattern (Arrange-Act-Assert)
Already documented as example 2 to reflect execution order.

```typescript
it('should login successfully following the AAA pattern', async () => {
    // Arrange
    await LoginPage.loginBtn.click();
    await expect(LoginPage.inputUsername).toBeDisplayed();
    await expect(LoginPage.inputPassword).toBeDisplayed();
    await expect(LoginPage.btnSubmit).toBeDisplayed();
    // Act
    await LoginPage.login('tomsmith@mail.com', 'SuperSecretPassword!');
    // Assert
    await expect(AlertPage.messageAlert).toHaveText(
        expect.stringContaining('You are logged in!'),
        { message: 'Confirmation message is not the expected one' }
    );
});
```

### 4. Good Practices Implemented

#### a. Granular DDT via `for...of`
Avoid `forEach` for async tests—`for...of` preserves proper async flow and allows dynamic test titles.

#### b. Implicit waits through `expect`
`expect(...).toHaveText()` inherently waits for the condition, reducing flakiness versus fixed sleeps.

#### c. Clear assertion messages
Custom messages help pinpoint data row failures quickly.

#### d. Page Object Model (POM)
All app interactions go through `LoginPage` and `AlertPage`, centralizing selectors and actions.

```typescript
// test/pageobjects/login.page.ts
class LoginPage {
    public get loginBtn () {
        return $('~Login');
    }

    public get inputUsername () {
        return $('~input-email');
    }

    public get inputPassword () {
        return $('~input-password');
    }

    public async login (username: string, password: string) {
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await this.btnSubmit.click();
    }
}
```

### File Structure

```
test/
├── data/
│   ├── loginData.json       # Data file for JSON-driven tests
│   └── buttonsData.csv      # Data file for CSV-driven tests
├── pageobjects/
│   ├── login.page.ts        # Login Page Object
│   └── alert.page.ts        # Alert Page Object
├── types/
│   └── data.ts              # Shared TypeScript interfaces (LoginData, UserData)
└── specs/
    └── test.e2e.ts          # E2E tests (basic, AAA, JSON DDT, CSV DDT)
```

### Execution & Reporting Summary

Current suite produces (in execution order):
1. 1 basic login test
2. 1 AAA pattern test
3. 3 JSON DDT test cases
4. 2 CSV DDT test cases

Allure & JUnit reports show distinct titles per dataset row for clarity.

### Rationale per Example

1. Basic Login: Verifies essential flow and environment stability before deeper scenarios.
2. AAA Pattern: Reinforces explicit structure for clarity and future maintenance.
3. JSON DDT: Scales rapidly—add rows to expand coverage without modifying test logic.
4. CSV DDT: Demonstrates ingestion of spreadsheet-style data for flexible scenario expansion.

### Recommended Improvements (Next Steps)
1. Extract interfaces (`LoginData`, `UserData`) outside the `describe` for reuse.
2. Add negative login scenarios (invalid password / empty fields) to demonstrate error handling.
3. Add screenshot / log attachment steps on failure integrated into Allure.
4. Parameterize device capabilities for multi-platform matrix (Android/iOS).
5. Introduce test tagging to selectively run subsets (e.g., smoke vs regression).

### Mobile Test Automation Anti-Patterns to Avoid

| Anti-Pattern | Why It Hurts | Better Approach |
|--------------|-------------|-----------------|
| Hard-coded sleeps (e.g. `browser.pause(3000)`) | Brittle & slow; ignores real UI readiness | Implicit waits via WebdriverIO expectations (`toBeDisplayed`, `toHaveText`) |
| Using `forEach` for async test generation | Does not await properly; can create false positives | Use `for...of` to generate discrete `it` blocks |
| Mixing test logic & selectors inline | Duplicates selectors; hard to refactor | Page Object Model centralizes selectors/actions |
| Long monolithic test cases | Hard to debug; single failure hides others | Split by scenario/data; keep tests focused |
| Global mutable state between tests | Causes leakage & flaky order-dependent results | Reset app/session in hooks (`afterTest`) |
| Overuse of generic XPath selectors | Fragile when UI shifts; performance overhead | Prefer accessibility IDs / resource IDs |
| Ignoring platform differences | Unexpected failures on iOS vs Android | Abstract platform-specific selectors/methods |
| Silent assertions (no message) | Harder triage in large suites | Provide assertion messages with contextual data |
| No reporting attachments | Limited diagnostics for CI failures | Capture screenshots/logcat on failure |
| Testing multiple flows in one test | One failure invalidates many checks | Keep single, clear purpose per test |

### Rationale for Restart Strategy
Ensuring a clean app state after each test prevents leakage (e.g., leftover logged-in session) that can hide defects. The current `afterTest` hook invokes `browser.relaunchActiveApp()`, offering a lightweight refresh versus a full session recreation, reducing execution time while still clearing in-app UI state.

### Design Principles Emphasized
- Deterministic tests (no arbitrary waits)
- Readable structure (AAA, clear titles)
- Data externalization for scalability
- Fast failure diagnosis (granular test cases + messages)
- Maintainability (POM encapsulation)

### Why Shared Types Matter
Using centralized TypeScript interfaces (`LoginData`, `UserData` in `test/types/data.ts`) provides several concrete benefits:
1. Single Source of Truth: Changing a field (e.g. renaming `expectedMessage`) updates all specs and utilities at compile time—no silent drift.
2. Early Feedback: Type errors surface during development instead of causing runtime `undefined` or assertion mismatches in CI.
3. Safer Refactors: IDE auto-complete and rename tools work reliably across the suite, reducing regressions in large data-driven expansions.
4. Data Contract Clarity: New contributors immediately see required fields and their intent, lowering onboarding friction.
5. Prevents “Magic” Fields: Explicit interfaces discourage ad‑hoc additions to JSON/CSV that tests forget to assert.
6. Enables Reuse: Utilities (parsers, generators, factories) can accept typed objects, improving composability and test scaffolding.
7. Facilitates Lint & Static Analysis: Linters and quality tools (e.g. SonarQube) reason better about well-defined shapes versus dynamic objects.

Anti‑Pattern Avoided: Defining interfaces inline inside each `describe` causes duplication and accidental divergence; centralizing them avoids this drift.

## Contributing

Feel free to open issues or submit pull requests for enhancements and fixes.

## Support

Need help? Open an issue. More info: [WebdriverIO Docs](https://webdriver.io/docs/gettingstarted.html).

Additional content & updates: [Website](https://charlyautomatiza.tech) • Community Discord: [Join here](https://bit.ly/charlyAutomatiza-discord).
