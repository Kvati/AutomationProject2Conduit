import {Page, Locator} from '@playwright/test';

export class SettingsPage {
    readonly page: Page;
    readonly pictureUrlField: Locator;
    readonly usernameField: Locator;
    readonly shortBioField: Locator;
    readonly emailField: Locator;
    readonly newPasswordField: Locator;
    readonly updateSettingsButton: Locator;
    readonly logOutButton: Locator;
    readonly errorMessage: Locator;
    readonly imageUrl: string

    constructor(page: Page) {
        this.page = page;
        this.pictureUrlField = page.getByPlaceholder('URL of profile picture');
        this.usernameField = page.getByPlaceholder('Username');
        this.shortBioField = page.getByPlaceholder('Short bio about you');
        this.emailField = page.getByPlaceholder('Email');
        this.newPasswordField = page.getByPlaceholder('New Password');
        this.updateSettingsButton = page.getByRole('button', { name: 'Update Settings' });
        this.logOutButton = page.getByRole('button', { name: 'Or click here to logout.' });
        this.errorMessage = page.locator('ul.error-messages li');
        this.imageUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    }

    async updateSettings(username: string, shortBio: string, email: string, newPassword: string): Promise<void> {

        await this.pictureUrlField.fill(this.imageUrl);
        await this.usernameField.fill(username);
        await this.shortBioField.fill(shortBio);
        await this.emailField.fill(email);
        await this.newPasswordField.fill(email);
        await this.updateSettingsButton.click();
    }

    async logout(): Promise<void> {

        await this.logOutButton.click();
    }
}