import { test, expect } from "@playwright/test";
import { BASE_URL, registerViaApi } from "../helpers";

test.describe('GET /profiles/:username - get profile', () => {

    let username: string;
    let token: string;

    test.beforeEach(async () => {
        const id = Math.random().toString(36).slice(2, 8);
        const user = { username: `user_${id}`, email: `user_${id}@test.com`, password: 'Test1234!' };
        token = await registerViaApi(user);
        username = user.username;
    });

    test('/GET profile returns 200 with profile object', async ({ request }) => {
        test.fail(true, 'API does not reliably serve profiles by username after registration on this demo instance')
        const response = await request.get(`${BASE_URL}/profiles/${username}`);

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.profile.username).toBe(username);
        expect(body.profile.following).toBeDefined();
    });

    test('/GET nonexistent profile returns 404', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/profiles/this-user-does-not-exist-xyz`);

        expect(response.status()).toBe(404);
    });
});

test.describe('POST/DELETE /profiles/:username/follow - follow user', () => {

    let followerToken: string;
    let targetUsername: string;

    test.beforeEach(async () => {
        const id = Math.random().toString(36).slice(2, 8);

        const follower = { username: `follower_${id}`, email: `follower_${id}@test.com`, password: 'Test1234!' };
        followerToken = await registerViaApi(follower);

        const target = { username: `target_${id}`, email: `target_${id}@test.com`, password: 'Test1234!' };
        await registerViaApi(target);
        targetUsername = target.username;
    });

    test('/POST follow user returns 200 with following true', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/profiles/${targetUsername}/follow`, {
            headers: { Authorization: `Token ${followerToken}` }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.profile.username).toBe(targetUsername);
        expect(body.profile.following).toBe(true);
    });

    test('/POST follow user without token returns 401', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/profiles/${targetUsername}/follow`);

        expect(response.status()).toBe(401);
    });

    test('/POST follow nonexistent user returns 404', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/profiles/this-user-does-not-exist-xyz/follow`, {
            headers: { Authorization: `Token ${followerToken}` }
        });

        expect(response.status()).toBe(404);
    });

    test('/DELETE unfollow user returns 200 with following false', async ({ request }) => {
        await request.post(`${BASE_URL}/profiles/${targetUsername}/follow`, {
            headers: { Authorization: `Token ${followerToken}` }
        });

        const response = await request.delete(`${BASE_URL}/profiles/${targetUsername}/follow`, {
            headers: { Authorization: `Token ${followerToken}` }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.profile.username).toBe(targetUsername);
        expect(body.profile.following).toBe(false);
    });

    test('/DELETE unfollow user without token returns 401', async ({ request }) => {
        const response = await request.delete(`${BASE_URL}/profiles/${targetUsername}/follow`);

        expect(response.status()).toBe(401);
    });
});

test.describe('GET /tags - get tags', () => {

    test('/GET tags returns 200 with tags array', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/tags`);

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(Array.isArray(body.tags)).toBeTruthy();
    });
});
