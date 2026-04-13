import {Page, Locator} from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly mainPageTitle: Locator;
  readonly homeButton: Locator;
  readonly signInButton: Locator;
  readonly signUpButton: Locator;
  readonly popularTagAi: Locator;
  readonly popularTagsApi: Locator;
  readonly popularTagsArch: Locator;
  readonly firstArticle: Locator;
  readonly firstHeartButton: Locator;
  readonly globalFeed: Locator;
  readonly yourFeed: Locator;
  readonly firstTagList: Locator;
  readonly openedTagTab: Locator;
  readonly newArticle: Locator;
  readonly settingsButton: Locator;
  readonly userProfileButton: Locator;


  constructor(page: Page) {
    this.page = page;
    this.mainPageTitle = page.getByRole('heading', { name: 'Conduit' });
    this.homeButton = page.getByRole('link', { name: 'Home' });
    this.signInButton = page.getByRole('link', { name: 'Sign in' });
    this.signUpButton = page.getByRole('link', { name: 'Sign up' });
    this.popularTagAi = page.getByRole('link', { name: 'ai'});
    this.popularTagsApi = page.getByRole('link', { name: 'api', exact: true });
    this.popularTagsArch = page.getByRole('link', { name: 'architecture' });
    this.firstArticle = page.locator('.preview-link').nth(0);
    this.firstHeartButton = page.locator('.article-preview').first().locator('button.btn-sm');
    this.globalFeed = page.getByRole('link', { name: `Global Feed` });
    this.yourFeed = page.getByRole('link', { name: `Your Feed` });
    this.firstTagList = page.locator('.tag-list').nth(0);
    this.openedTagTab = page.locator('.nav-link.active').nth(0);
    this.newArticle = page.getByRole('link', { name: `New Article` });
    this.settingsButton = page.getByRole('button', { name: `Settings` });
    this.userProfileButton = page.locator('a.nav-link:has(img.user-pic)')
  }

  async navigateviaurl(url: string) {
    await this.page.goto(url);
  }

  async favouriteitem() {
    await this.firstHeartButton.click();
  }

  async globalfeedfilter() {
    await this.globalFeed.click();
  }
}