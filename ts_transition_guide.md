# Python → TypeScript Transition Guide
### For QA Automation Engineers (Playwright focus)

---

## 1. IDE Setup

**Recommended: Visual Studio Code**
- Free, lightweight, and the de facto standard for TypeScript development
- Install these extensions:
  - `ESLint` — catches code errors and style issues (equivalent to flake8/pylint)
  - `Prettier` — auto-formats your code on save (equivalent to black)
  - `Playwright Test for VSCode` — run/debug individual tests from the editor, same as PyCharm's pytest integration
  - `TypeScript Nightly` — better IntelliSense for TypeScript

**Alternative: WebStorm (JetBrains)**
- If you prefer PyCharm's feel, WebStorm is the same IDE family for JS/TS
- Paid, but has a free 30-day trial and is free for students

---

## 2. The JavaScript Ecosystem — What Replaces What

| Python world         | TypeScript/JS world          | Notes                                              |
|----------------------|------------------------------|----------------------------------------------------|
| `pip`                | `npm` or `yarn`              | Package manager                                    |
| `requirements.txt`   | `package.json`               | Lists project dependencies                         |
| `venv`               | `node_modules/`              | Local dependency folder (auto-created, don't touch)|
| `pytest`             | `@playwright/test`           | Test runner (built into Playwright for TS)         |
| `pytest.ini`         | `playwright.config.ts`       | Central config file                                |
| `conftest.py`        | fixtures in `*.spec.ts`      | Shared setup/teardown                              |
| `pip install x`      | `npm install x`              | Install a package                                  |
| `pip install -r ...` | `npm install`                | Install all deps from package.json                 |

### Starting a new project
```bash
npm init playwright@latest
```
This scaffolds everything: `package.json`, `playwright.config.ts`, example tests, and installs browsers automatically.

---

## 3. TypeScript vs Python — Key Concept Differences

### Static Typing
TypeScript is statically typed like C++, unlike Python's duck typing. You declare types explicitly (though TS can infer them).

```typescript
// TypeScript — types are declared
const name: string = "John"
const count: number = 5
const isLoggedIn: boolean = true

// TS can infer the type — this is fine too
const name = "John"  // inferred as string
```

This is closer to C++ than Python. If you pass the wrong type, the editor flags it before you even run the code.

### Interfaces — No Python Equivalent
Interfaces define the shape of an object. Think of them like C++ structs but for type-checking only (they don't exist at runtime).

```typescript
interface User {
  username: string
  email: string
  password: string
}

function login(user: User) {
  // TS now knows user.username, user.email etc. exist
}
```

In Python you'd use a dict or dataclass. In TS, interfaces are the standard for test data objects.

### `null` and `undefined`
JavaScript has **two** empty values: `null` (explicitly empty) and `undefined` (never assigned). This trips up Python developers.

```typescript
let x: string | null = null       // explicitly empty
let y: string | undefined         // declared but not assigned

// Optional chaining — safe access (no equivalent in Python 3.8-)
const title = page?.locator(".title")?.textContent()
```

### Semicolons
Optional in modern TypeScript. Most style guides omit them. Don't worry about it — Prettier will enforce whatever style you choose automatically.

---

## 4. Async/Await — The Big One

This is the most important conceptual shift. Playwright's TypeScript API is **fully async** — almost every Playwright action returns a `Promise` that you must `await`.

In Python Playwright, calls are synchronous (blocking). In TypeScript, they are async by default.

```typescript
// WRONG — this does nothing, you forgot await
page.click("#button")

// CORRECT
await page.click("#button")
```

Every test function and every method that calls Playwright must be declared `async`:

```typescript
test("user can login", async ({ page }) => {
  await page.goto("https://example.com")
  await page.fill("#email", "test@test.com")
  await page.click("#submit")
})
```

Think of `async/await` like C++'s future/promise model, but much cleaner syntax. The rule of thumb: **if it touches the browser, it needs `await`.**

---

## 5. Modules and Imports

TypeScript uses ES module syntax. No `__init__.py` files needed.

```typescript
// Exporting
export class LoginPage { ... }
export default class HomePage { ... }  // one default export per file

// Importing
import { LoginPage } from "./LoginPage"
import HomePage from "./HomePage"
import { expect, test } from "@playwright/test"
```

In Python you'd do `from Pages.LoginPage import LoginPage`. In TS the path is relative and has no file extension.

---

## 6. Page Object Model in TypeScript

```typescript
import { Page, Locator } from "@playwright/test"

export class LoginPage {
  readonly page: Page
  readonly emailField: Locator
  readonly passwordField: Locator
  readonly submitButton: Locator

  constructor(page: Page) {
    this.page = page
    this.emailField = page.locator("#email")
    this.passwordField = page.locator("#password")
    this.submitButton = page.locator("#submit")
  }

  async navigate() {
    await this.page.goto("/login")
  }

  async login(email: string, password: string) {
    await this.emailField.fill(email)
    await this.passwordField.fill(password)
    await this.submitButton.click()
  }
}
```

The structure is identical to your Python POM — constructor sets up locators, methods perform actions. The differences are:
- `readonly` instead of just assigning in `__init__`
- `async/await` on every method
- Type annotations on parameters

---

## 7. Fixtures in Playwright TS

Playwright TS has its own fixture system that replaces `conftest.py`. You extend the base `test` object.

```typescript
// fixtures.ts
import { test as base } from "@playwright/test"
import { LoginPage } from "./pages/LoginPage"
import { HomePage } from "./pages/HomePage"

type MyFixtures = {
  loginPage: LoginPage
  homePage: HomePage
}

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    await loginPage.navigate()
    await use(loginPage)         // equivalent to pytest's yield
  },
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page)
    await homePage.navigate()
    await use(homePage)
  },
})

export { expect } from "@playwright/test"
```

Then in your test file:
```typescript
import { test, expect } from "../fixtures"

test("user can login", async ({ loginPage }) => {
  await loginPage.login("test@test.com", "password")
})
```

---

## 8. `storageState` — Auth Reuse (Not in your Python project)

This is one of the most valuable Playwright TS patterns. Instead of logging in before every test, you log in once, save the browser state, and reuse it.

```typescript
// global-setup.ts — runs once before all tests
import { chromium } from "@playwright/test"

async function globalSetup() {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  await page.goto("https://example.com/login")
  await page.fill("#email", "test@test.com")
  await page.fill("#password", "password")
  await page.click("#submit")

  // Save auth state to a file
  await page.context().storageState({ path: "auth.json" })
  await browser.close()
}

export default globalSetup
```

```typescript
// playwright.config.ts — apply saved state to all tests
export default {
  globalSetup: "./global-setup.ts",
  use: {
    storageState: "auth.json"   // every test starts already logged in
  }
}
```

This dramatically speeds up test suites and is a real-world pattern you'll see in professional projects.

---

## 9. `playwright.config.ts` — Central Configuration

This replaces `pytest.ini` + `conftest.py` browser setup combined.

```typescript
import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  retries: 2,
  reporter: [["html"], ["allure-playwright"]],

  use: {
    baseURL: "https://example.com",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox",  use: { ...devices["Desktop Firefox"] } },
    { name: "webkit",   use: { ...devices["Desktop Safari"] } },
  ],
})
```

Notice cross-browser is configured here, not via CLI flags — cleaner than your current `--browser` approach.

---

## 10. Common Gotchas Coming from Python

| Gotcha | Python behavior | TypeScript behavior |
|--------|----------------|---------------------|
| Forgot `await` | N/A (sync) | Test passes silently, action never ran |
| Array indexing | `list[0]` | `array[0]` — same |
| String formatting | `f"Hello {name}"` | `` `Hello ${name}` `` (backticks) |
| Dictionary | `{"key": "value"}` | `{ key: "value" }` — same structure |
| `None` | `None` | `null` or `undefined` |
| `len(list)` | `len(x)` | `x.length` |
| `isinstance` | `isinstance(x, str)` | `typeof x === "string"` |
| `for item in list` | same | `for (const item of array)` |
| List comprehension | `[x for x in list]` | `array.map(x => x)` |

---

## 11. Installing Packages and Project Setup Cheatsheet

```bash
# Create new Playwright TS project
npm init playwright@latest

# Install a package
npm install package-name

# Install as dev dependency (test tools, linters)
npm install --save-dev package-name

# Install Allure reporter
npm install --save-dev allure-playwright

# Run tests
npx playwright test

# Run specific file
npx playwright test tests/login.spec.ts

# Run with headed browser (visible)
npx playwright test --headed

# Show HTML report
npx playwright show-report
```
