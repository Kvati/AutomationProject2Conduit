import {Page, Locator} from '@playwright/test';

export class SignUpPage {
    readonly page: Page;
    readonly pageTitle: Locator;
    readonly haveAnAccount: Locator;
    readonly usernameField: Locator;
    readonly emailField: Locator;
    readonly passwordField: Locator;
    readonly signUpButton: Locator;
    readonly invalidCredentials: Locator;
    readonly homePageButton: Locator;
    readonly homePageUsername: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pageTitle = page.getByRole('heading', {name: 'Sign up', exact: true});
        this.haveAnAccount = page.getByRole('link', {name: 'Have an account?'});
        this.usernameField = page.getByPlaceholder('Username');
        this.emailField = page.getByPlaceholder('Email');
        this.passwordField = page.getByPlaceholder('Password');
        this.signUpButton = page.getByRole('button', {name: 'Sign up'});
        this.invalidCredentials = page.locator('.error-messages')
        this.homePageButton = page.locator('.navbar-brand')
        this.homePageUsername = page.locator('a.nav-link:has(img.user-pic)')
    }

    async signup(username: string, email: string, password: string): Promise<void> {
        await this.usernameField.fill(username);
        await this.emailField.fill(email);
        await this.passwordField.fill(password);
        await this.signUpButton.click();
    }

}