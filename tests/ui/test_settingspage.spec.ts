import { test, expect } from '../fixtures';

test('logout', async ({loggedInSettingsPage}) => {

    const {page} = loggedInSettingsPage
    await page.logout()
    await expect(page.page).toHaveURL('https://demo.realworld.show')
    await expect(page.page.getByRole('link', { name: 'Sign in' })).toBeVisible()
})

test('settings page loads successfully', async ({loggedInSettingsPage}) => {

    const {page, user} = loggedInSettingsPage
    await expect(page.page).toHaveURL('https://demo.realworld.show/settings')
    await expect(page.pictureUrlField).toBeVisible()
    await expect(page.usernameField).toBeVisible()
    await expect(page.shortBioField).toBeVisible()
    await expect(page.emailField).toBeVisible()
    await expect(page.newPasswordField).toBeVisible()
    await expect(page.updateSettingsButton).toBeVisible()
    await expect(page.logOutButton).toBeVisible()
    await expect(page.usernameField).toHaveValue(user.username)
    await expect(page.emailField).toHaveValue(user.email)

})

test("update settings page successfully", async ({loggedInSettingsPage}) => {

    const{page, user} = loggedInSettingsPage
    const updatedUsername = user.username + '!'
    await page.updateSettings(updatedUsername, 'someShortBio', 'someEmail', 'somePassword')
    await expect(page.page).toHaveURL(`https://demo.realworld.show/profile/${updatedUsername}`)
})

const inputs = [
    { username: '', shortBio: 'somebio', email: 'some@emailtest.com',  newPassword: 'test123', description: 'empty username', expectedError: 'body username is a string of less than 60 chars', expectFail: false },
    { username: 'someUsername', shortBio: 'somebio', email: '',  newPassword: 'test123', description: 'empty email', expectedError: 'body email is a string of less than 100 chars', expectFail: false },
    { username: 'someUsername', shortBio: '', email: 'some@emailtest.com',  newPassword: 'test123', description: 'empty bio', expectedError: null, expectFail: false  },
    { username: 'someUsername', shortBio: 'somebio', email: 'some@emailtest.com',  newPassword: '', description: 'empty newPassword', expectedError: null, expectFail: false   },
    { username: 'someUsername', shortBio: 'somebio', email: 'someemailtest.com',  newPassword: 'test123', description: 'invalid email', expectedError: 'invalid email format', expectFail: true },
];

for (const {username, shortBio, email, newPassword, description, expectedError, expectFail} of inputs) {
    test(`settings update performed with ${description}`, async ({ loggedInSettingsPage }) => {

        const { page } = loggedInSettingsPage;

        test.fail(expectFail, 'email validation not implemented');
        await page.updateSettings(username, shortBio, email, newPassword);

        if (expectedError) {
            await expect(page.errorMessage).toContainText(expectedError);
        } else {
            await expect(page.page).toHaveURL(`https://demo.realworld.show/profile/${username}`);
        }
    });
}