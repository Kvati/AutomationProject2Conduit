import { test, expect } from './fixtures';


test('sign in page loads correctly', async({signInPage}) => {

    await expect(signInPage.page).toHaveURL('https://demo.realworld.show/login');
    await expect(signInPage.emailField).toBeVisible()
    await expect(signInPage.passwordField).toBeVisible()
    await expect(signInPage.signInButton).toBeVisible()
    await expect(signInPage.pageTitle).toBeVisible()
    await expect(signInPage.needAccount).toBeVisible()
})

test('successful sign in', async({signInPage, registeredUser}) => {

    await signInPage.login(registeredUser.email, registeredUser.password)

    await expect(signInPage.page).toHaveURL('https://demo.realworld.show')
    expect((await signInPage.homePageUsername.innerText()).trim()).toBe(registeredUser.username);
})

const blockedByForm = [
    { email: '',               password: 'test123', description: 'empty email' },
    { email: 'kvati@test.com', password: '',        description: 'empty password' },
];

const invalidCredentials = [
    { email: 'wrong@test.com',  password: 'test123', description: 'wrong email' },
    { email: 'kvati@test.com',  password: 'wrong',   description: 'wrong password' },
];

for (const { email, password, description } of blockedByForm) {
    test(`sign in blocked with ${description}`, async ({ signInPage }) => {

        await signInPage.emailField.fill(email);
        await signInPage.passwordField.fill(password);
        await expect(signInPage.signInButton).toBeDisabled();
    });
}

for (const { email, password, description } of invalidCredentials) {
    test(`sign in fails with ${description}`, async ({ signInPage }) => {

        await signInPage.login(email, password);
        await expect(signInPage.invalidCredentials).toBeVisible();
    });
}

test('need account button' , async({signInPage}) => {

    await signInPage.needAccount.click();
    await expect(signInPage.page).toHaveURL('https://demo.realworld.show/register');
})

test('navigate home', async({signInPage}) => {

    await signInPage.homePageButton.click();
    await expect(signInPage.page).toHaveURL('https://demo.realworld.show');
})

