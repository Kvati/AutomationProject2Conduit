import { test, expect } from '../fixtures';

test.describe.configure({ mode: 'serial' });

test('Home page loads correctly', async({homePage}) => {

  await expect(homePage.page).toHaveURL('https://demo.realworld.show');
  await expect(homePage.mainPageTitle).toBeVisible()
  await expect(homePage.signInButton).toBeVisible()
  await expect(homePage.signUpButton).toBeVisible()
  await expect(homePage.firstArticle).toBeVisible()
})

test('Open Article', async ({ homePage }) => {

  const firstArticleTitle = await homePage.firstArticle.locator('h1').innerText();

  await expect(homePage.firstArticle).toBeVisible();

  await homePage.firstArticle.click();
  await expect(homePage.page).toHaveURL(/https?:\/\/[a-zA-Z0-9.-]+\/article\/[a-z0-9-]+/,);
  await expect(homePage.page.getByRole('heading', { name: firstArticleTitle }),).toBeVisible();
});

test('Filter via Tags', async ({ homePage }) => {

  await expect(homePage.popularTagsApi).toBeVisible();

  await homePage.popularTagsApi.click();
  await expect(homePage.firstTagList).toContainText('api');
  await expect(homePage.page).toHaveURL('https://demo.realworld.show/tag/api');
  await expect(homePage.openedTagTab).toBeVisible();

  await homePage.globalfeedfilter()
  await expect(homePage.page).toHaveURL('https://demo.realworld.show');
});

test('navigate to sing in page', async ({ homePage }) => {

  await expect(homePage.signInButton).toBeVisible();

  await homePage.signInButton.click();
  await expect(homePage.page).toHaveURL('https://demo.realworld.show/login');
})

test('navigate to sign up page', async ({ homePage }) => {

  await expect(homePage.signUpButton).toBeVisible();

  await homePage.signUpButton.click();
  await expect(homePage.page).toHaveURL('https://demo.realworld.show/register');
})

test('Add to favourites, without logged in', async ({ homePage }) => {

  await homePage.favouriteitem()
  await expect(homePage.page).toHaveURL('https://demo.realworld.show/register');
});

test('logged in home page loads correctly', async({loggedInHomePage}) => {

  await expect(loggedInHomePage.settingsButton).toBeVisible()
  await expect(loggedInHomePage.newArticle).toBeVisible()
})

test('Add to favourites', async({loggedInHomePage}) => {

  await loggedInHomePage.firstHeartButton.waitFor({ state: 'visible' });
  const favouritedNumber = parseInt(await loggedInHomePage.firstHeartButton.innerText(), 10);
  await loggedInHomePage.favouriteitem();
  await expect(loggedInHomePage.firstHeartButton).toHaveText(String(favouritedNumber + 1));
})

test('unfavourite article', async ({loggedInHomePage}) => {

  await loggedInHomePage.firstHeartButton.waitFor({ state: 'visible' })
  const initialCount = parseInt(await loggedInHomePage.firstHeartButton.innerText(), 10)
  await loggedInHomePage.favouriteitem()
  await loggedInHomePage.favouriteitem()
  await expect(loggedInHomePage.firstHeartButton).toHaveText(String(initialCount))
})