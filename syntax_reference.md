# Python vs TypeScript — Side-by-Side Syntax Reference
### Playwright Automation Focus

---

## Variables & Types

| Concept | Python | TypeScript |
|---------|--------|------------|
| String | `name = "John"` | `const name: string = "John"` |
| Number | `count = 5` | `const count: number = 5` |
| Boolean | `is_valid = True` | `const isValid: boolean = true` |
| Inferred type | `name = "John"` | `const name = "John"` |
| Constant | `NAME = "John"` | `const NAME = "John"` |
| Reassignable | `name = "John"` | `let name = "John"` |
| None/null | `value = None` | `const value = null` |
| Optional type | `value: str \| None` | `value: string \| null` |

---

## Strings

| Concept | Python | TypeScript |
|---------|--------|------------|
| Interpolation | `f"Hello {name}"` | `` `Hello ${name}` `` |
| Concatenation | `"Hello " + name` | `"Hello " + name` |
| Multiline | `"""line1\nline2"""` | `` `line1\nline2` `` |
| Length | `len(text)` | `text.length` |
| Contains | `"abc" in text` | `text.includes("abc")` |
| Starts with | `text.startswith("abc")` | `text.startsWith("abc")` |
| Split | `text.split(",")` | `text.split(",")` |
| Strip | `text.strip()` | `text.trim()` |

---

## Collections

| Concept | Python | TypeScript |
|---------|--------|------------|
| List/Array | `items = [1, 2, 3]` | `const items: number[] = [1, 2, 3]` |
| Dict/Object | `{"key": "val"}` | `{ key: "val" }` |
| Dict type hint | `dict[str, str]` | `Record<string, string>` |
| Length | `len(items)` | `items.length` |
| Append | `items.append(4)` | `items.push(4)` |
| Access | `items[0]` | `items[0]` |
| Slice | `items[1:3]` | `items.slice(1, 3)` |
| List comprehension | `[x * 2 for x in items]` | `items.map(x => x * 2)` |
| Filter | `[x for x in items if x > 2]` | `items.filter(x => x > 2)` |
| Any match | `any(x > 2 for x in items)` | `items.some(x => x > 2)` |
| All match | `all(x > 0 for x in items)` | `items.every(x => x > 0)` |
| Random item | `random.choice(items)` | `items[Math.floor(Math.random() * items.length)]` |

---

## Functions

| Concept | Python | TypeScript |
|---------|--------|------------|
| Basic function | `def greet(name: str) -> str:` | `function greet(name: string): string {` |
| Arrow function | N/A | `const greet = (name: string): string => {` |
| Inline arrow | N/A | `const greet = (name: string) => name` |
| Default param | `def fn(x: int = 5):` | `function fn(x: number = 5) {` |
| Optional param | `def fn(x: str \| None = None):` | `function fn(x?: string) {` |
| Return nothing | `-> None` | `: void` |
| Async function | `async def fn():` | `async function fn(): Promise<void> {` |
| Await | `await fn()` | `await fn()` |
| Lambda | `lambda x: x * 2` | `x => x * 2` |

---

## Classes

| Concept | Python | TypeScript |
|---------|--------|------------|
| Class definition | `class LoginPage:` | `class LoginPage {` |
| Constructor | `def __init__(self, page):` | `constructor(page: Page) {` |
| Instance variable | `self.email = page.locator(...)` | `this.email = page.locator(...)` |
| Typed property | `self.email: Locator` | `readonly email: Locator` |
| Method | `def login(self, email: str):` | `async login(email: string): Promise<void> {` |
| Inheritance | `class CartPage(BasePage):` | `class CartPage extends BasePage {` |
| Call parent init | `super().__init__(page)` | `super(page)` |
| Call parent method | `super().navigate(path)` | `await super.navigate(path)` |

---

## Control Flow

| Concept | Python | TypeScript |
|---------|--------|------------|
| If/else | `if x > 5:` / `else:` | `if (x > 5) {` / `} else {` |
| Ternary | `"yes" if x else "no"` | `x ? "yes" : "no"` |
| For loop | `for item in items:` | `for (const item of items) {` |
| For range | `for i in range(5):` | `for (let i = 0; i < 5; i++) {` |
| While | `while condition:` | `while (condition) {` |
| Try/except | `try:` / `except Exception as e:` | `try {` / `} catch (e) {` |
| Raise | `raise Exception("msg")` | `throw new Error("msg")` |

---

## Imports & Exports

| Concept | Python | TypeScript |
|---------|--------|------------|
| Import class | `from Pages.LoginPage import LoginPage` | `import { LoginPage } from "./pages/LoginPage"` |
| Import module | `import random` | `import * as random from "..."` |
| Import Playwright | `from playwright.sync_api import Page, expect` | `import { Page, expect } from "@playwright/test"` |
| Export class | *(implicit)* | `export class LoginPage {` |
| Export default | *(implicit)* | `export default class LoginPage {` |

---

## Playwright — Locators

| Concept | Python | TypeScript |
|---------|--------|------------|
| By CSS | `page.locator(".class")` | `page.locator(".class")` |
| By role | `page.get_by_role("button", name="Submit")` | `page.getByRole("button", { name: "Submit" })` |
| By text | `page.get_by_text("Login")` | `page.getByText("Login")` |
| By placeholder | `page.get_by_placeholder("Email")` | `page.getByPlaceholder("Email")` |
| By label | `page.get_by_label("Username")` | `page.getByLabel("Username")` |
| By test id | `page.get_by_test_id("submit")` | `page.getByTestId("submit")` |
| Nth element | `locator.nth(2)` | `locator.nth(2)` |
| First | `locator.first` | `locator.first()` |
| Child locator | `locator.locator("p")` | `locator.locator("p")` |
| Count | `locator.count()` | `await locator.count()` |

---

## Playwright — Actions

| Concept | Python | TypeScript |
|---------|--------|------------|
| Navigate | `page.goto("/login")` | `await page.goto("/login")` |
| Click | `locator.click()` | `await locator.click()` |
| Fill input | `locator.fill("text")` | `await locator.fill("text")` |
| Hover | `locator.hover()` | `await locator.hover()` |
| Scroll into view | `locator.scroll_into_view_if_needed()` | `await locator.scrollIntoViewIfNeeded()` |
| Wait for visible | `locator.wait_for(state="visible")` | `await locator.waitFor({ state: "visible" })` |
| Wait for URL | `page.wait_for_url("**/login")` | `await page.waitForURL("**/login")` |
| Get text | `locator.text_content()` | `await locator.textContent()` |
| Get attribute | `locator.get_attribute("href")` | `await locator.getAttribute("href")` |
| Screenshot | `page.screenshot()` | `await page.screenshot()` |
| Evaluate JS | `page.evaluate("window.location.href")` | `await page.evaluate("window.location.href")` |
| Intercept route | `page.route("**/ads**", lambda r: r.abort())` | `await page.route("**/ads**", r => r.abort())` |
| Expect download | `with page.expect_download() as d:` | `const [download] = await Promise.all([page.waitForEvent("download"), locator.click()])` |

---

## Playwright — Assertions

| Concept | Python | TypeScript |
|---------|--------|------------|
| URL equals | `expect(page).to_have_url("...")` | `await expect(page).toHaveURL("...")` |
| URL matches regex | `expect(page).to_have_url(re.compile(r"..."))` | `await expect(page).toHaveURL(/regex/)` |
| Visible | `expect(locator).to_be_visible()` | `await expect(locator).toBeVisible()` |
| Hidden | `expect(locator).to_be_hidden()` | `await expect(locator).toBeHidden()` |
| Has text | `expect(locator).to_have_text("...")` | `await expect(locator).toHaveText("...")` |
| Contains text | `expect(locator).to_contain_text("...")` | `await expect(locator).toContainText("...")` |
| Has value | `expect(locator).to_have_value("...")` | `await expect(locator).toHaveValue("...")` |
| Has count | `expect(locator).to_have_count(5)` | `await expect(locator).toHaveCount(5)` |
| Is enabled | `expect(locator).to_be_enabled()` | `await expect(locator).toBeEnabled()` |
| Is checked | `expect(locator).to_be_checked()` | `await expect(locator).toBeChecked()` |
| Custom assertion | `assert x == 5` | `expect(x).toBe(5)` |

---

## Playwright — Test Structure

| Concept | Python | TypeScript |
|---------|--------|------------|
| Test function | `def test_login():` | `test("user can login", async ({ page }) => {` |
| Fixture param | `def test_login(login_page):` | `test("...", async ({ loginPage }) => {` |
| Skip test | `pytest.skip("reason")` | `test.skip("reason")` |
| Skip conditionally | `pytest.skip("reason") if condition` | `test.skip(condition, "reason")` |
| Mark as only | `pytest.mark.only` | `test.only("...", async () => {` |
| Parametrize | `@pytest.mark.parametrize("x", [1,2])` | `for (const x of [1, 2]) { test(...) }` |
| Before each | `@pytest.fixture` (autouse) | `test.beforeEach(async ({ page }) => {` |
| After each | teardown after `yield` in fixture | `test.afterEach(async () => {` |
| Before all | `scope="session"` fixture | `test.beforeAll(async () => {` |
| Group tests | *(file-based)* | `test.describe("Login", () => {` |

---

## Naming Conventions

| Concept | Python | TypeScript |
|---------|--------|------------|
| Variables | `snake_case` | `camelCase` |
| Functions/Methods | `snake_case` | `camelCase` |
| Classes | `PascalCase` | `PascalCase` |
| Constants | `UPPER_SNAKE_CASE` | `UPPER_SNAKE_CASE` or `camelCase` |
| Files | `snake_case.py` | `camelCase.ts` or `PascalCase.ts` |
| Test files | `test_login.py` | `login.spec.ts` |
| Interfaces | N/A | `PascalCase` (e.g. `UserData`) |
