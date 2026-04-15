import {test as base, Page} from '@playwright/test';
import {HomePage} from '../Pages/HomePage';
import {SignInPage} from "../Pages/SignInPage";
import {SignUpPage} from "../Pages/SignUpPage";
import {ProfilePage} from "../Pages/ProfilePage";
import {SettingsPage} from "../Pages/SettingsPage";
import {NewArticlePage} from "../Pages/NewArticlePage";

type User = {
    username: string,
    email: string;
    password: string;
};

type Pages = {
    homePage: HomePage;
    signInPage: SignInPage;
    signUpPage: SignUpPage;
    existingUser: User;
    randomUser: User;
    loggedInPage: Page;
    loggedInHomePage: HomePage;
    registeredUser: User;
    profilePage: { page: ProfilePage; user: User };
    loggedInProfilePage: { page: ProfilePage; user: User };
    loggedInSettingsPage: { page: SettingsPage; user: User };
    loggedInNewArticlePage: { page: NewArticlePage; user: User };
};

export const test = base.extend<Pages>({
    homePage: async ({page}, use) => {
        const homePage = new HomePage(page);
        await homePage.navigateviaurl('https://demo.realworld.show');
        await use(homePage);
    },

    signInPage: async ({page}, use) => {
        const signInPage = new SignInPage(page);
        await signInPage.page.goto('https://demo.realworld.show/login');
        await use(signInPage);
    },

    signUpPage: async ({page}, use) => {
        const signUpPage = new SignUpPage(page);
        await signUpPage.page.goto('https://demo.realworld.show/register');
        await use(signUpPage);
    },

    loggedInPage: async ({browser, randomUser}, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto('https://demo.realworld.show/register');
        await page.getByPlaceholder('Username').fill(randomUser.username);
        await page.getByPlaceholder('Email').fill(randomUser.email);
        await page.getByPlaceholder('Password').fill(randomUser.password);
        await page.getByRole('button', {name: 'Sign up'}).click();
        await page.waitForURL('https://demo.realworld.show/');
        await use(page);
        await context.close();
    },

    loggedInHomePage: async ({loggedInPage}, use) => {
        const homePage = new HomePage(loggedInPage);
        await homePage.globalFeed.click();
        await use(homePage);
    },

    loggedInProfilePage: async ({loggedInPage, randomUser}, use) => {
        const homePage = new HomePage(loggedInPage);
        await homePage.globalFeed.click();
        await homePage.favouriteitem();

        const profilePage = new ProfilePage(loggedInPage);
        await loggedInPage.goto(`https://demo.realworld.show/profile/${randomUser.username}`, {waitUntil: 'domcontentloaded'});
        await profilePage.profileName.waitFor({state: 'visible'});

        await use({page: profilePage, user: randomUser});
    },

    profilePage: async ({loggedInPage, randomUser}, use) => {
        const profilePage = new ProfilePage(loggedInPage);
        await profilePage.page.goto(`https://demo.realworld.show/profile/${randomUser.username}`, {waitUntil: 'domcontentloaded'});
        await profilePage.profileName.waitFor({state: 'visible'});
        await use({page: profilePage, user: randomUser});
    },

    loggedInSettingsPage: async ({loggedInPage, randomUser}, use) => {

        const settingsPage = new SettingsPage(loggedInPage)
        await settingsPage.page.goto('https://demo.realworld.show/settings')
        await use({page: settingsPage, user: randomUser});
    },

    loggedInNewArticlePage: async ({loggedInPage, randomUser}, use) => {

        const newArticlePage = new NewArticlePage(loggedInPage)
        await newArticlePage.page.goto('https://demo.realworld.show/editor')
        await use({page: newArticlePage, user: randomUser});
    },

    randomUser: async ({}, use) => {
        const id = Math.random().toString(36).slice(2, 8);
        await use({
            username: `user_${id}`,
            email: `user_${id}@test.com`,
            password: 'Test1234!',
        });
    },


    registeredUser: async ({browser, randomUser}, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto('https://demo.realworld.show/register');
        await page.getByPlaceholder('Username').fill(randomUser.username);
        await page.getByPlaceholder('Email').fill(randomUser.email);
        await page.getByPlaceholder('Password').fill(randomUser.password);
        await page.getByRole('button', {name: 'Sign up'}).click();
        await page.waitForURL('https://demo.realworld.show/');
        await context.close();
        await use(randomUser);
    },

});

export {expect} from '@playwright/test';