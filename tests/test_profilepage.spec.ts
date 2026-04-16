import { test, expect } from './fixtures';
import {defaultArticle} from "./testData";


test.describe.configure({ mode: 'serial' });

test('profile page loads sucessfully', async ({profilePage}) => {

    const {page, user} = profilePage;
    await expect(page.page).toHaveURL(`https://demo.realworld.show/profile/${user.username}`);
    await expect(page.profilePicture).toBeVisible()
    await expect(page.editProfileSettings).toBeVisible()
    await expect(page.profileName).toBeVisible()
    expect(await page.profileName.textContent()).toEqual(user.username);
    await expect(page.myPosts).toBeVisible()
    await expect(page.favoritedPosts).toBeVisible()
})

test('open profile settings', async ({profilePage}) => {

    await profilePage.page.openSettings()
    await expect(profilePage.page.page).toHaveURL("https://demo.realworld.show/settings")
})

test('load favorited posts', async ({loggedInProfilePage}) => {

    const {page, user} = loggedInProfilePage;

    await loggedInProfilePage.page.openFavoritePosts()
    await expect(page.page).toHaveURL(`https://demo.realworld.show/profile/${user.username}/favorites`)

    await page.favoritedArticle.waitFor({ state: 'visible' });
    expect(await page.favoritedArticle.count()).toBeGreaterThan(0)
})

test('my posts navigation', async ({profilePage}) => {

    const {page, user} = profilePage;
    await page.openFavoritePosts()
    await page.openMyPosts()
    await expect(page.page).toHaveURL(`https://demo.realworld.show/profile/${user.username}`)
})

test('deleted article removed from profile', async ({loggedInNewArticlePage}) => {

    const {page, user} = loggedInNewArticlePage
    await page.fillArticle(defaultArticle)
    await expect(page.page).toHaveURL('https://demo.realworld.show/article/articletitle')

    await page.deleteArticle()

    await page.page.goto(`https://demo.realworld.show/profile/${user.username}`)
    await expect(page.myWrittenArticle).not.toBeVisible()
})

test('new article in my posts', async ({loggedInNewArticlePage}) => {

    const {page, user} = loggedInNewArticlePage;
    await page.fillArticle(defaultArticle)
    await expect(page.page).toHaveURL('https://demo.realworld.show/article/articletitle')

    await page.page.goto(`https://demo.realworld.show/profile/${user.username}`)
    await expect(page.page).toHaveURL(`https://demo.realworld.show/profile/${user.username}`)

    await expect(page.myWrittenArticle).toBeVisible()
    await expect(page.page.locator('.preview-link h1')).toHaveText(defaultArticle.articleTitle)
})