# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test_signuppage.spec.ts >> sign up blocked with invalid email
- Location: tests\test_signuppage.spec.ts:33:5

# Error details

```
Error: expect(locator).toBeDisabled() failed

Locator:  getByRole('button', { name: 'Sign up' })
Expected: disabled
Received: enabled
Timeout:  5000ms

Call log:
  - Expect "toBeDisabled" with timeout 5000ms
  - waiting for getByRole('button', { name: 'Sign up' })
    7 × locator resolved to <button type="submit" class="btn btn-lg btn-primary pull-xs-right"> Sign up </button>
      - unexpected value "enabled"

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - navigation [ref=e4]:
    - generic [ref=e5]:
      - link "Conduit" [ref=e6] [cursor=pointer]:
        - /url: /
        - img "Conduit" [ref=e7]
      - list [ref=e8]:
        - listitem [ref=e9]:
          - link "Home" [ref=e10] [cursor=pointer]:
            - /url: /
        - listitem [ref=e11]:
          - link "Sign in" [ref=e12] [cursor=pointer]:
            - /url: /login
        - listitem [ref=e13]:
          - link "Sign up" [ref=e14] [cursor=pointer]:
            - /url: /register
  - generic [ref=e19]:
    - heading "Sign up" [level=1] [ref=e20]
    - paragraph [ref=e21]:
      - link "Have an account?" [ref=e22] [cursor=pointer]:
        - /url: /login
    - generic:
      - list
    - group [ref=e24]:
      - group [ref=e25]:
        - textbox "Username" [ref=e26]: test_user
      - group [ref=e27]:
        - textbox "Email" [ref=e28]: test.com
      - group [ref=e29]:
        - textbox "Password" [active] [ref=e30]: test123
      - button "Sign up" [ref=e31] [cursor=pointer]
  - contentinfo [ref=e33]:
    - generic [ref=e34]:
      - link "Conduit" [ref=e35] [cursor=pointer]:
        - /url: /
        - img "Conduit" [ref=e36]
      - generic [ref=e37]:
        - text: © 2026. An interactive learning project from
        - link "RealWorld OSS Project" [ref=e38] [cursor=pointer]:
          - /url: https://github.com/gothinkster/realworld
        - text: . Code licensed under MIT.
```

# Test source

```ts
  1  | import { test, expect } from './fixtures';
  2  | 
  3  | // Note: demo.realworld.show does not support user deletion (the RealWorld spec
  4  | // intentionally excludes it), so registered users cannot be torn down after tests.
  5  | 
  6  | test('sign up page loads correctly', async({signUpPage}) => {
  7  | 
  8  |     await expect(signUpPage.page).toHaveURL('https://demo.realworld.show/register');
  9  |     await expect(signUpPage.usernameField).toBeVisible()
  10 |     await expect(signUpPage.emailFeid).toBeVisible()
  11 |     await expect(signUpPage.passwordFeid).toBeVisible()
  12 |     await expect(signUpPage.signUpButton).toBeVisible()
  13 |     await expect(signUpPage.pageTitle).toBeVisible()
  14 |     await expect(signUpPage.haveAnAccount).toBeVisible()
  15 | })
  16 | 
  17 | test('successful sign up', async({signUpPage, randomUser}) => {
  18 | 
  19 |     await signUpPage.signup(randomUser.username, randomUser.email, randomUser.password)
  20 | 
  21 |     await expect(signUpPage.page).toHaveURL('https://demo.realworld.show');
  22 |     expect((await signUpPage.homePageUsername.innerText()).trim()).toBe(randomUser.username);
  23 | })
  24 | 
  25 | const invalidCredentials = [
  26 |     { username: '', email: 'test_user_0@test.com',  password: 'test123', description: 'empty username' },
  27 |     { username: 'test_user', email: '',  password: 'test123', description: 'empty email' },
  28 |     { username: 'test_user', email: 'test_user_0@test.com',  password: '', description: 'empty password' },
  29 |     { username: 'test_user', email: 'test.com',  password: 'test123', description: 'invalid email' },
  30 | ];
  31 | 
  32 | for (const { username, email, password, description } of invalidCredentials) {
  33 |     test(`sign up blocked with ${description}`, async ({ signUpPage }) => {
  34 | 
  35 |         //invalid email test is expected to fail due to email validation not being implemented
  36 |         test.fail(description === 'invalid email', 'email validation not implemented');
  37 |         await signUpPage.usernameField.fill(username)
  38 |         await signUpPage.emailFeid.fill(email);
  39 |         await signUpPage.passwordFeid.fill(password);
> 40 |         await expect(signUpPage.signUpButton).toBeDisabled();
     |                                               ^ Error: expect(locator).toBeDisabled() failed
  41 |     });
  42 | }
  43 | 
  44 | test('have an account navigation', async({signUpPage}) => {
  45 | 
  46 |     await signUpPage.haveAnAccount.click()
  47 |     await expect(signUpPage.page).toHaveURL('https://demo.realworld.show/login');
  48 | })
  49 | 
  50 | test('home button navigation', async({signUpPage}) => {
  51 | 
  52 |     await signUpPage.homePageButton.click()
  53 |     await expect(signUpPage.page).toHaveURL('https://demo.realworld.show');
  54 | })
  55 | 
  56 | 
```