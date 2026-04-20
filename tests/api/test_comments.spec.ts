import { test, expect } from "@playwright/test";
import { BASE_URL, registerViaApi, createArticleViaApi, createCommentViaApi } from "../helpers";

// All comment endpoints operate on /articles/:slug/comments.
// Because this demo API does not reliably serve articles by slug after creation,
// any test that POSTs or DELETEs a comment is marked test.fail for the same reason
// GET /articles/:slug is broken. GET comments on a known-bad slug is similarly affected.

test.describe('POST /articles/:slug/comments - add comment', () => {

    let token: string;
    let slug: string;

    test.beforeEach(async () => {
        const id = Math.random().toString(36).slice(2, 8);
        const user = { username: `user_${id}`, email: `user_${id}@test.com`, password: 'Test1234!' };
        token = await registerViaApi(user);
        slug = await createArticleViaApi(
            { title: `Article ${id}`, description: 'desc', body: 'body', tagList: [] },
            token
        );
    });

    test('/POST valid comment returns 200 with comment object', async ({ request }) => {
        test.fail(true, 'API does not reliably serve articles by slug on this demo instance')
        const response = await request.post(`${BASE_URL}/articles/${slug}/comments`, {
            headers: { Authorization: `Token ${token}` },
            data: { comment: { body: 'Great article!' } }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.comment.body).toBe('Great article!');
        expect(body.comment.id).toBeDefined();
        expect(body.comment.author).toBeDefined();
    });

    test('/POST comment without token returns 401', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/articles/${slug}/comments`, {
            data: { comment: { body: 'Great article!' } }
        });

        expect(response.status()).toBe(401);
    });

    test('/POST comment with empty body returns 422 with error', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/articles/${slug}/comments`, {
            headers: { Authorization: `Token ${token}` },
            data: { comment: { body: '' } }
        });

        expect(response.status()).toBe(422);
        const body = await response.json();
        expect(body.errors.body[0]).toBe("can't be blank");
    });
});

test.describe('GET /articles/:slug/comments - get comments', () => {

    let token: string;
    let slug: string;

    test.beforeEach(async () => {
        const id = Math.random().toString(36).slice(2, 8);
        const user = { username: `user_${id}`, email: `user_${id}@test.com`, password: 'Test1234!' };
        token = await registerViaApi(user);
        slug = await createArticleViaApi(
            { title: `Article ${id}`, description: 'desc', body: 'body', tagList: [] },
            token
        );
    });

    test('/GET comments returns 200 with comments array', async ({ request }) => {
        test.fail(true, 'API does not reliably serve articles by slug on this demo instance')
        const response = await request.get(`${BASE_URL}/articles/${slug}/comments`);

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(Array.isArray(body.comments)).toBeTruthy();
    });

    test('/GET comments on nonexistent slug returns 404', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/articles/this-slug-does-not-exist-xyz/comments`);

        expect(response.status()).toBe(404);
    });
});

test.describe('DELETE /articles/:slug/comments/:id - delete comment', () => {

    let token: string;
    let slug: string;
    let commentId: number;

    test.beforeEach(async () => {
        const id = Math.random().toString(36).slice(2, 8);
        const user = { username: `user_${id}`, email: `user_${id}@test.com`, password: 'Test1234!' };
        token = await registerViaApi(user);
        slug = await createArticleViaApi(
            { title: `Article ${id}`, description: 'desc', body: 'body', tagList: [] },
            token
        );
        commentId = await createCommentViaApi(slug, 'A comment', token);
    });

    test('/DELETE comment returns 200', async ({ request }) => {
        test.fail(true, 'API does not reliably serve articles by slug on this demo instance')
        const response = await request.delete(`${BASE_URL}/articles/${slug}/comments/${commentId}`, {
            headers: { Authorization: `Token ${token}` }
        });

        expect(response.status()).toBe(200);
    });

    test('/DELETE comment without token returns 401', async ({ request }) => {
        const response = await request.delete(`${BASE_URL}/articles/${slug}/comments/${commentId}`);

        expect(response.status()).toBe(401);
    });

    test('/DELETE comment by non-author returns 403', async ({ request }) => {
        test.fail(true, 'API does not reliably serve articles by slug on this demo instance')
        const id = Math.random().toString(36).slice(2, 8);
        const otherUser = { username: `user_${id}`, email: `user_${id}@test.com`, password: 'Test1234!' };
        const otherToken = await registerViaApi(otherUser);

        const response = await request.delete(`${BASE_URL}/articles/${slug}/comments/${commentId}`, {
            headers: { Authorization: `Token ${otherToken}` }
        });

        expect(response.status()).toBe(403);
    });
});
