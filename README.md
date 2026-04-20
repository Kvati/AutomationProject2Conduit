# Conduit Test Suite

Automated UI and API tests for [demo.realworld.show](https://demo.realworld.show) built with Playwright and TypeScript.

## 🔧 Tech Stack
- TypeScript 5
- Playwright 1.59
- Node.js 20

## 📁 Project Structure
```
project/
├── Pages/                          # Page Object Models
│   ├── HomePage.ts                 # Home feed, tag filtering, favourites
│   ├── SignInPage.ts               # Login form
│   ├── SignUpPage.ts               # Registration form
│   ├── SettingsPage.ts             # User settings and logout
│   ├── NewArticlePage.ts           # Article editor, comments
│   └── ProfilePage.ts              # User profile, my posts, favourites
├── tests/
│   ├── ui/                         # Browser-driven UI tests
│   │   ├── test_homepage.spec.ts
│   │   ├── test_signinpage.spec.ts
│   │   ├── test_signuppage.spec.ts
│   │   ├── test_settingspage.spec.ts
│   │   ├── test_newarticlepage.spec.ts
│   │   └── test_profilepage.spec.ts
│   ├── api/                        # Browserless API tests
│   │   ├── test_auth.spec.ts
│   │   ├── test_article.spec.ts
│   │   ├── test_comments.spec.ts
│   │   └── test_profile&tags.spec.ts
│   ├── E2E/                        # Cross-layer tests combining API setup with browser actions
│   │   └── test_e2e.spec.ts
│   ├── fixtures.ts                 # Custom test fixtures and shared setup
│   ├── helpers.ts                  # API helper functions (registerViaApi, createArticleViaApi, etc.)
│   └── testData.ts                 # Shared test data constants
└── playwright.config.ts
```

## ⚙️ Setup

1. Clone the repository
   ```
   git clone https://github.com/Kvati/AutomationProject2Conduit.git
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Install browsers
   ```
   npx playwright install
   ```

## ▶️ Running Tests

Run all tests:
```
npx playwright test
```

Run only UI tests:
```
npx playwright test tests/ui
```

Run only API tests:
```
npx playwright test tests/api
```

Run only E2E tests:
```
npx playwright test tests/E2E
```

Run a specific test file:
```
npx playwright test tests/ui/test_homepage.spec.ts
```

Run against a specific browser:
```
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

Open the HTML report after a run:
```
npx playwright show-report
```

## 🏗️ Project Design

### Page Object Model
All UI interactions are encapsulated in Page classes under `Pages/`. Tests never interact with raw locators — they call methods on Page objects, keeping test logic clean and maintenance centralised.

### Custom Fixtures (`tests/fixtures.ts`)
Playwright's fixture system is used to provide fully set-up page objects to each test. Key fixtures:

| Fixture | What it provides |
| --- | --- |
| `homePage` | Navigates to the home page |
| `signInPage` | Navigates to the login page |
| `signUpPage` | Navigates to the registration page |
| `randomUser` | A unique `{ username, email, password }` object per test |
| `registeredUser` | A `randomUser` pre-registered via API — no browser needed |
| `loggedInPage` | An authenticated browser page, seeded via JWT in localStorage |
| `loggedInHomePage` | Authenticated home page with global feed loaded |
| `loggedInSettingsPage` | Authenticated settings page |
| `loggedInNewArticlePage` | Authenticated article editor page |
| `profilePage` | Profile page of the current random user |
| `loggedInProfilePage` | Profile page with a favourited article pre-set |

### API-Accelerated Setup
Rather than driving registration and login through the browser for every test, authenticated fixtures use `registerViaApi` to create a user and inject the JWT directly into `localStorage`. This eliminates flakiness from the demo server's slow registration form and cuts setup time significantly.

### API Helpers (`tests/helpers.ts`)
Reusable functions for setting up test state without a browser:

| Helper | Returns |
| --- | --- |
| `registerViaApi(user)` | JWT token string |
| `createArticleViaApi(article, token)` | Article slug string |
| `createCommentViaApi(slug, body, token)` | Comment ID number |

### Browser Projects (`playwright.config.ts`)
UI tests run across Chromium, Firefox, and WebKit to verify cross-browser consistency. API tests run once under a dedicated browserless `api` project — there is no browser engine involved in HTTP calls, so repeating them per browser would be redundant.

| Project | Runs |
| --- | --- |
| `chromium` | `tests/ui/**` |
| `firefox` | `tests/ui/**` |
| `webkit` | `tests/ui/**` |
| `api` | `tests/api/**` |
| `e2e` | `tests/E2E/**` |

## ✅ Test Coverage

### UI Tests

| Module | Test File | Scenarios |
| --- | --- | --- |
| Home Page | `test_homepage.spec.ts` | Page load, open article, tag filtering, navigate to sign in/sign up, favourite without login, logged-in page load, add/remove favourite |
| Sign In | `test_signinpage.spec.ts` | Page load, successful login, empty email/password (button disabled), wrong email/password (error shown), navigation to sign up and home |
| Sign Up | `test_signuppage.spec.ts` | Page load, successful registration, empty fields (button disabled), invalid email format (xfail — known bug), duplicate username/email (xfail — known bugs), navigation to sign in and home |
| Settings | `test_settingspage.spec.ts` | Page load with pre-filled user fields, successful update, logout, empty username/email (error), empty bio/password (accepted), invalid email format (xfail — known bug) |
| New Article | `test_newarticlepage.spec.ts` | Page load, valid creation, empty title/description/body (individual and combined), field length limits (title 100, description 300, body 10000, tag 19 chars), over-limit validation, tag count limit (10/11), duplicate tag deduplication, edit article, delete article, post/delete comment, empty comment, session timeout via route interception |
| Profile | `test_profilepage.spec.ts` | Page load, open settings, load favourited posts, my posts navigation, deleted article removed from profile, new article visible in my posts |

### API Tests

API tests use Playwright's `request` fixture — no browser is involved. They run once under the dedicated `api` project rather than being repeated across browser engines.

| Module | Test File | Scenarios |
| --- | --- | --- |
| Auth | `test_auth.spec.ts` | Registration: valid, duplicate email/username (xfail — known bugs), empty username/email/password. Login: valid, invalid credentials, empty email/password. Current user: GET with valid/invalid/missing token, PUT valid update, empty password update (xfail — known bug), empty email update |
| Articles | `test_article.spec.ts` | POST: valid creation, no token, empty title/description/body, fully empty body, duplicate tag (xfail), duplicate title (xfail). GET list: returns array, filter by tag (xfail — known bug), filter by author (xfail — known bug). GET by slug (xfail — known bug). PUT: valid update, no token, non-author (xfail — known bug). DELETE: valid delete confirmed by 404, no token, non-author (xfail — known bug). Favourite/unfavourite: valid, no token. Feed: authenticated and unauthenticated |
| Comments | `test_comments.spec.ts` | POST: valid comment (xfail — slug bug), no token, empty body. GET: returns array (xfail — slug bug), nonexistent slug. DELETE: valid (xfail — slug bug), no token, non-author (xfail — slug bug) |
| Profiles & Tags | `test_profile&tags.spec.ts` | GET profile: by username (xfail — known bug), nonexistent user. Follow: valid, no token, nonexistent user. Unfollow: valid, no token. GET tags: returns array |

### E2E Tests

E2E tests combine API calls and browser interactions within a single test to verify consistency between the two layers. They run once under the `e2e` project (Chromium).

| Test | Flow |
| --- | --- |
| Bio updated in browser is reflected in API response | Register via API → inject JWT → update bio in Settings page via browser → verify `GET /user` returns updated bio |
| Article favourited in browser is reflected in API response | Register via API → fetch article slug from `GET /articles` → favourite article in browser → verify `GET /articles/:slug` returns `favorited: true` |

## 🐛 Known API Limitations

Several tests are marked `test.fail` to document bugs in the demo server rather than hide them. These are treated as expected failures — if the API is ever fixed, those tests will automatically start passing.

| Bug | Affected tests |
| --- | --- |
| Articles and profiles not reliably retrievable by slug/username after creation | GET article by slug, GET profile, comment CRUD, author-based filtering |
| Filtering by tag or author returns empty results | GET /articles?tag=, GET /articles?author= |
| No duplicate username/email validation on registration | POST /users duplicate tests |
| No duplicate title validation on article creation | POST /articles duplicate title |
| No duplicate tag deduplication on article creation | POST /articles duplicate tag |
| Empty password accepted on user update | PUT /user empty password |
| API returns 404 instead of 403 for unauthorised article mutations | PUT/DELETE /articles/:slug by non-author |
| No email format validation on sign up or settings update | UI sign up / settings invalid email tests |

## 🔄 Real Environment Considerations

This project runs against a shared public demo site, which imposes constraints that would be handled differently in a production project:

**No test isolation**
Because multiple test runs share the same live server, created users and articles persist indefinitely. In a real environment each test would create and tear down its own data, either via API calls in fixtures or against a database that resets between runs, making the suite fully self-contained.

**Worker parallelism limited to 1**
The demo server is unreliable under concurrent load, so `workers` is set to `1`. In a real environment with a dedicated test instance, workers would be increased to run tests in parallel and reduce total run time.

**Hardcoded base URLs**
The site URL (`https://demo.realworld.show`) and API URL (`https://api.realworld.show/api`) are defined directly in `fixtures.ts` and `helpers.ts`. In a real environment these would be environment variables loaded from a `.env` file or CI secrets, allowing the same suite to run against staging, UAT, and production without code changes.
