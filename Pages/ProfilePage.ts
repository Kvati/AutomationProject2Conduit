import {Page, Locator} from '@playwright/test';

export class ProfilePage {
    readonly page: Page;
    readonly profileName: Locator;
    readonly editProfileSettings: Locator;
    readonly myPosts: Locator;
    readonly favoritedPosts: Locator;
    readonly profilePicture: Locator;
    readonly favoritedArticle: Locator;


    constructor(page: Page) {
        this.page = page;
        this.profileName = page.locator(".user-info h4")
        this.editProfileSettings = page.getByRole("link", { name: "Edit Profile Settings" });
        this.myPosts = page.getByRole("link", { name: "My Posts" });
        this.favoritedPosts = page.getByRole("link", { name: "Favorited Posts" });
        this.profilePicture = page.locator(".user-img")
        this.favoritedArticle = page.locator('.article-preview')
    }

    async openMyPosts(): Promise<void> {
        await this.myPosts.click();
    }

    async openFavoritePosts(): Promise<void> {
        await this.favoritedPosts.click();
    }

    async openSettings(): Promise<void> {
        await this.editProfileSettings.click();
    }

}