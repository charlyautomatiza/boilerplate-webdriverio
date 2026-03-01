# Skill Profile — Mobile Automation Framework

## Core Technologies

| Technology | Version / Details |
|---|---|
| **Node.js** | ≥ 20 LTS |
| **TypeScript** | Strict mode; all elements and functions must be typed |
| **WebdriverIO** | v9 — primary test runner and browser/device API |
| **Appium** | v3 — mobile automation server |
| **appium-uiautomator2-driver** | v6 — Android UiAutomator2 backend |
| **Mocha** | BDD test framework (`describe` / `it`) |
| **Allure Reporter** | Rich HTML test reports |
| **JUnit Reporter** | CI-compatible XML output |

## Selector Strategy for Mobile

### Priority Order

1. **Accessibility ID** (`~accessibilityId`) — fastest, most stable; use whenever the app exposes `content-desc` (Android) or `accessibilityIdentifier` (iOS).
   ```typescript
   $('~Login')            // Android content-desc / iOS accessibilityIdentifier
   $('~input-email')
   $('~button-LOGIN')
   ```

2. **Resource ID** (Android only) — reliable when accessibility labels are absent.
   ```typescript
   $('//*[@resource-id="com.wdiodemoapp:id/loginButton"]')
   ```

3. **Predicate String / Class Chain** (iOS only) — preferred over XPath on iOS.
   ```typescript
   $('-ios predicate string:type == "XCUIElementTypeButton" AND name == "Login"')
   $('-ios class chain:**/XCUIElementTypeButton[`name == "Login"`]')
   ```

4. **Optimised XPath** — last resort; use only when no better locator exists. Keep predicates specific to avoid full-tree traversal.
   ```typescript
   // ✅ Specific — anchors on resource-id
   $('//*[@resource-id="android:id/message"]')

   // ❌ Avoid — full-tree generic traversal
   $('//android.widget.TextView')
   ```

### Rules

- Never hard-code index-based XPaths (e.g. `(//android.widget.TextView)[3]`).
- Abstract platform-specific selectors inside Page Object getters; do not scatter them in spec files.
- Document the locator strategy in JSDoc on each getter.

## Page Object Model (POM) Conventions

```
test/
├── pageobjects/        # One file per screen/component
│   ├── login.page.ts
│   └── alert.page.ts
├── specs/              # One spec file per feature area
│   └── test.e2e.ts
├── types/              # Shared TypeScript interfaces
│   └── data.ts
└── data/               # External test data
    ├── loginData.json
    └── buttonsData.csv
```

- Every Page Object is a singleton exported as `export default new PageClass()`.
- Selectors are `public get` properties returning `$('...')` — never stored as class fields.
- Reusable action sequences (e.g. `login(user, pass)`) live as `async` methods on the Page Object.

## Waiting Strategy

| Technique | When to Use |
|---|---|
| `expect(el).toBeDisplayed()` | Wait for an element to appear before interacting |
| `expect(el).toHaveText(...)` | Wait for dynamic text to stabilise |
| `el.waitForDisplayed({ timeout: 15000 })` | Explicit wait when `expect` matcher is insufficient |
| `browser.waitUntil(...)` with compound conditions | Complex cross-element or cross-state waits |
| **`browser.pause()` — PROHIBITED** | Never; replace with one of the above |

Default `waitforTimeout` is **10 000 ms** (configured in `wdio.conf.ts`).

## TypeScript Rules

- `strict: true` in `tsconfig.json`.
- Every function parameter and return type must be annotated.
- Prefer `interface` over `type` for data shapes; keep them in `test/types/`.
- No `any` — use precise types or generics.

## CI/CD Integration

### GitHub Actions (`android-emulator.yml`)

| Step | Description |
|---|---|
| Checkout | `actions/checkout@v4` |
| Node.js setup | `actions/setup-node@v4` (Node 20) |
| Install deps | `npm ci` |
| Download APK | `curl` from GitHub Releases into `app/` |
| KVM permissions | Grants kernel-level emulator access |
| Emulator boot & test | `reactivecircus/android-emulator-runner@v2` (API 34 / x86_64) |
| Allure artifact | `actions/upload-artifact@v4` |
| JUnit artifact | `actions/upload-artifact@v4` |

Triggers: every push or pull request to `main`.

### Local Test Execution

```bash
# Run full E2E suite
npm run wdio

# Generate and open Allure report
npm run open-report

# Clean previous results
npm run clean
```

## Anti-Patterns to Avoid

| Anti-Pattern | Preferred Alternative |
|---|---|
| `browser.pause(n)` | `expect(el).toBeDisplayed()` / `waitForDisplayed` |
| `forEach` for async test generation | `for...of` loop |
| Inline selectors in spec files | Page Object getters |
| Index-based XPath | Accessibility ID or resource-id |
| `any` in TypeScript | Precise types / interfaces |
| Hard-coded credentials in specs | External JSON/CSV data files |
