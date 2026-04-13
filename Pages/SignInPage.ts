import {Page, Locator} from '@playwright/test';

export class SignInPage{
    readonly page: Page;
    readonly pageTitle: Locator;
    readonly needAccount: Locator;
    readonly emailField: Locator;
    readonly passwordField: Locator;
    readonly signInButton: Locator;
    readonly invalidCredentials: Locator;
    readonly homePageButton: Locator;
    readonly homePageUsername: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pageTitle = page.getByRole('heading', { name: 'Sign in', exact: true });
        this.needAccount = page.getByRole('link', { name: 'Need an account?' });
        this.emailField = page.getByPlaceholder('Email');
        this.passwordField = page.getByPlaceholder('Password');
        this.signInButton = page.getByRole('button', { name: 'Sign in' });
        this.invalidCredentials = page.locator('.error-messages')
        this.homePageButton = page.locator('.navbar-brand')
        this.homePageUsername = page.locator('a.nav-link:has(img.user-pic)')
    }

    async login(email: string, password: string): Promise<void> {
        await this.emailField.fill(email);
        await this.passwordField.fill(password);
        await this.signInButton.click();
    }

}