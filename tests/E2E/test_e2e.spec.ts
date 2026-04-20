import { test, expect } from '@playwright/test';
import { BASE_URL, registerViaApi } from '../helpers';
import { SettingsPage } from '../../Pages/SettingsPage';

// E2E tests chain API setup with browser actions and API verification in a single flow.
// They demonstrate that the UI and API layers are consistent with each other —
// a change made in one layer is reflected in the other.

const SITE_URL = 'https://demo.realworld.show';

function authenticatedContext(browser: any, token: string) {
    return browser.newContext({
        storageState: {
            cookies: [],
            origins: [{
                origin: SITE_URL,
                localStorage: [{ name: 'jwtToken', value: token }]
            }]
        }
    });
}

test('bio updated in browser is reflected in API response', async ({ browser, request }) => {
    // 1. Create a user entirely via API — no browser needed for setup
    const id = Math.random().toString(36).slice(2, 8);
    const user = { username: `user_${id}`, email: `user_${id}@test.com`, password: 'Test1234!' };
    const token = await registerViaApi(user);

    // 2. Open an authenticated browser session by injecting the JWT into localStorage
    const context = await authenticatedContext(browser, token);
    const page = await context.newPage();
    await page.goto(`${SITE_URL}/settings`, { waitUntil: 'domcontentloaded' });

    // 3. Update only the bio field and submit
    const newBio = `E2E bio ${id}`;
    const settingsPage = new SettingsPage(page);
    await settingsPage.shortBioField.fill(newBio);
    await settingsPage.updateSettingsButton.click();
    await page.waitForURL(/profile/);

    await context.close();

    // 4. Verify via API that the bio change was persisted
    const response = await request.get(`${BASE_URL}/user`, {
        headers: { Authorization: `Token ${token}` }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.user.bio).toBe(newBio);
});

test('article favourited in browser is reflected in API response', async ({ browser, request }) => {
    // 1. Register a fresh user via API
    const id = Math.random().toString(36).slice(2, 8);
    const user = { username: `user_${id}`, email: `user_${id}@test.com`, password: 'Test1234!' };
    const token = await registerViaApi(user);

    // 2. Fetch a known article slug from the public feed via API —
    //    avoids hardcoding a slug and ensures we pick a real, existing article
    const feedResponse = await request.get(`${BASE_URL}/articles`);
    expect(feedResponse.status()).toBe(200);
    const feedBody = await feedResponse.json();
    const targetSlug = feedBody.articles[0].slug;

    // 3. Open an authenticated browser session and navigate to that article
    const context = await authenticatedContext(browser, token);
    const page = await context.newPage();
    await page.goto(`${SITE_URL}/article/${targetSlug}`, { waitUntil: 'domcontentloaded' });

    // 4. Click the favourite button and wait for the API call to complete
    await Promise.all([
        page.waitForResponse((r: import('@playwright/test').Response) => r.url().includes(`/articles/${targetSlug}/favorite`) && r.status() === 200),
        page.locator('.btn-outline-primary').first().click()
    ]);

    await context.close();

    // 5. Verify via API that the article is now marked as favourited for this user
    const articleResponse = await request.get(`${BASE_URL}/articles/${targetSlug}`, {
        headers: { Authorization: `Token ${token}` }
    });
    expect(articleResponse.status()).toBe(200);
    const articleBody = await articleResponse.json();
    expect(articleBody.article.favorited).toBe(true);
    expect(articleBody.article.favoritesCount).toBeGreaterThan(0);
});
