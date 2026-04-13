import { test, expect } from './fixtures';

// Note: demo.realworld.show does not support user deletion (the RealWorld spec
// intentionally excludes it), so registered users cannot be torn down after tests.

test('sign up page loads correctly', async({signUpPage}) => {

    await expect(signUpPage.page).toHaveURL('https://demo.realworld.show/register');
    await expect(signUpPage.usernameField).toBeVisible()
    await expect(signUpPage.emailField).toBeVisible()
    await expect(signUpPage.passwordField).toBeVisible()
    await expect(signUpPage.signUpButton).toBeVisible()
    await expect(signUpPage.pageTitle).toBeVisible()
    await expect(signUpPage.haveAnAccount).toBeVisible()
})

test('successful sign up', async({signUpPage, randomUser}) => {

    await signUpPage.signup(randomUser.username, randomUser.email, randomUser.password)

    await expect(signUpPage.page).toHaveURL('https://demo.realworld.show');
    expect((await signUpPage.homePageUsername.innerText()).trim()).toBe(randomUser.username);
})

const invalidCredentials = [
    { username: '', email: 'test_user_0@test.com',  password: 'test123', description: 'empty username' },
    { username: 'test_user', email: '',  password: 'test123', description: 'empty email' },
    { username: 'test_user', email: 'test_user_0@test.com',  password: '', description: 'empty password' },
    { username: 'test_user', email: 'test.com',  password: 'test123', description: 'invalid email' },
];

for (const { username, email, password, description } of invalidCredentials) {
    test(`sign up blocked with ${description}`, async ({ signUpPage }) => {

        //invalid email test is expected to fail due to email validation not being implemented
        test.fail(description === 'invalid email', 'email validation not implemented');
        await signUpPage.usernameField.fill(username)
        await signUpPage.emailField.fill(email);
        await signUpPage.passwordField.fill(password);
        await expect(signUpPage.signUpButton).toBeDisabled();
    });
}

test('have an account navigation', async({signUpPage}) => {

    await signUpPage.haveAnAccount.click()
    await expect(signUpPage.page).toHaveURL('https://demo.realworld.show/login');
})

test('home button navigation', async({signUpPage}) => {

    await signUpPage.homePageButton.click()
    await expect(signUpPage.page).toHaveURL('https://demo.realworld.show');
})

