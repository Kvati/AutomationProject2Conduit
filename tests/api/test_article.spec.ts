import { test, expect } from "@playwright/test";
import { BASE_URL, registerViaApi, createArticleViaApi } from "../helpers";

test.describe('POST /articles - create article', () => {

    let token: string;

    test.beforeEach(async () => {
        const id = Math.random().toString(36).slice(2, 8);
        const user = { username: `user_${id}`, email: `user_${id}@test.com`, password: 'Test1234!' };
        token = await registerViaApi(user);
    });

    test('/POST valid article creation returns 201 with article object', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/articles`, {
            headers: { Authorization: `Token ${token}` },
            data: {
                article: {
                    title: 'Test Article',
                    description: 'Test description',
                    body: 'Test body',
                    tagList: ['playwright', 'testing']
                }
            }
        });

        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(body.article.title).toBe('Test Article');
        expect(body.article.description).toBe('Test description');
        expect(body.article.body).toBe('Test body');
        expect(body.article.slug).toBeDefined();
        expect(body.article.author).toBeDefined();
    });

    test('/POST article creation without token returns 401', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/articles`, {
            data: {
                article: {
                    title: 'Test Article',
                    description: 'Test description',
                    body: 'Test body',
                    tagList: []
                }
            }
        });

        expect(response.status()).toBe(401);
    });

    test('/POST article creation with empty title returns 422 with error', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/articles`, {
            headers: { Authorization: `Token ${token}` },
            data: {
                article: {
                    title: '',
                    description: 'Test description',
                    body: 'Test body',
                    tagList: []
                }
            }
        });

        expect(response.status()).toBe(422);
        const body = await response.json();
        expect(body.errors.title[0]).toBe("can't be blank");
    });

    test('/POST article creation with empty description returns 422 with error', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/articles`, {
            headers: { Authorization: `Token ${token}` },
            data: {
                article: {
                    title: 'Test title',
                    description: '',
                    body: 'Test body',
                    tagList: []
                }
            }
        });

        expect(response.status()).toBe(422);
        const body = await response.json();
        expect(body.errors.description[0]).toBe("can't be blank");
    });

    test('/POST article creation with empty body returns 422 with error', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/articles`, {
            headers: { Authorization: `Token ${token}` },
            data: {
                article: {
                    title: 'Test title',
                    description: 'Test descirption',
                    body: '',
                    tagList: []
                }
            }
        });

        expect(response.status()).toBe(422);
        const body = await response.json();
        expect(body.errors.body[0]).toBe("can't be blank");
    });

    test('/POST valid article creation with duplicate tag returns 201 with 1 tag in tagList', async ({ request }) => {
        test.fail(true, 'API has no validation for duplicate tag')
        const response = await request.post(`${BASE_URL}/articles`, {
            headers: { Authorization: `Token ${token}` },
            data: {
                article: {
                    title: 'Test Article',
                    description: 'Test description',
                    body: 'Test body',
                    tagList: ['playwright', 'playwright']
                }
            }
        });

        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(body.article.tagList.length).toBe(1);
    });

    test('/POST valid article creation with fully empty body returns 201 with errors', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/articles`, {
            headers: { Authorization: `Token ${token}` },
            data: {}
        });

        expect(response.status()).toBe(422);
        const body = await response.json();
        expect(body.errors.title[0]).toBe("can't be blank");
        expect(body.errors.description[0]).toBe("can't be blank");
        expect(body.errors.body[0]).toBe("can't be blank");
    });

    test('/POST duplicate title 201 with article object', async ({ request }) => {
        test.fail(true, 'API has no validation for duplicate title')
        const response1 = await request.post(`${BASE_URL}/articles`, {
            headers: { Authorization: `Token ${token}` },
            data: {
                article: {
                    title: 'Test Article',
                    description: 'Test description',
                    body: 'Test body',
                    tagList: ['playwright', 'testing']
                }
            }
        });

        const response2 = await request.post(`${BASE_URL}/articles`, {
            headers: { Authorization: `Token ${token}` },
            data: {
                article: {
                    title: 'Test Article',
                    description: 'New Description',
                    body: 'New Body',
                    tagList: ['playwright', 'testing']
                }
            }
        });

       expect(response1.status()).toBe(201);
       expect(response2.status()).toBe(422);

    });
});

test.describe('GET /articles - list articles', () => {

    let token: string;

    test.beforeEach(async () => {
        const id = Math.random().toString(36).slice(2, 8);
        const user = { username: `user_${id}`, email: `user_${id}@test.com`, password: 'Test1234!' };
        token = await registerViaApi(user);
    });

    test('/GET articles returns 200 with articles array', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/articles`);

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(Array.isArray(body.articles)).toBeTruthy();
        expect(body.articlesCount).toBeDefined();
    });

    test('/GET articles filtered by tag returns only matching articles', async ({ request }) => {
        test.fail(true, 'API filtering by tag is not functional on this demo instance')
        const uniqueTag = Math.random().toString(36).slice(2, 8);
        await createArticleViaApi(
            { title: 'Tagged Article', description: 'desc', body: 'body', tagList: [uniqueTag] },
            token
        );

        const response = await request.get(`${BASE_URL}/articles?tag=${uniqueTag}`);

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.articles.length).toBeGreaterThan(0);
        body.articles.forEach((article: any) => {
            expect(article.tagList).toContain(uniqueTag);
        });
    });

    test('/GET articles filtered by author returns only that authors articles', async ({ request }) => {
        test.fail(true, 'API filtering by author is not functional on this demo instance')
        const id = Math.random().toString(36).slice(2, 8);
        const author = { username: `author_${id}`, email: `author_${id}@test.com`, password: 'Test1234!' };
        const authorToken = await registerViaApi(author);
        await createArticleViaApi(
            { title: `Article by ${author.username}`, description: 'desc', body: 'body', tagList: [] },
            authorToken
        );

        const response = await request.get(`${BASE_URL}/articles?author=${author.username}`);

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.articles.length).toBeGreaterThan(0);
        body.articles.forEach((article: any) => {
            expect(article.author.username).toBe(author.username);
        });
    });
});

test.describe('GET /articles/:slug - get single article', () => {

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

    test('/GET article by slug returns 200 with article object', async ({ request }) => {
        test.fail(true, 'API does not reliably return articles by slug after creation on this demo instance')
        const response = await request.get(`${BASE_URL}/articles/${slug}`);

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.article.slug).toBe(slug);
        expect(body.article.title).toBeDefined();
        expect(body.article.author).toBeDefined();
    });

    test('/GET article with nonexistent slug returns 404', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/articles/this-slug-does-not-exist-xyz`);

        expect(response.status()).toBe(404);
    });
});

test.describe('PUT /articles/:slug - update article', () => {

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

    test('/PUT valid article update returns 200 with updated article', async ({ request }) => {
        const response = await request.put(`${BASE_URL}/articles/${slug}`, {
            headers: { Authorization: `Token ${token}` },
            data: { article: { title: 'Updated Title', description: 'Updated desc', body: 'Updated body' } }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.article.title).toBe('Updated Title');
        expect(body.article.description).toBe('Updated desc');
        expect(body.article.body).toBe('Updated body');
    });

    test('/PUT article update without token returns 401', async ({ request }) => {
        const response = await request.put(`${BASE_URL}/articles/${slug}`, {
            data: { article: { title: 'Updated Title' } }
        });

        expect(response.status()).toBe(401);
    });

    test('/PUT article update by non-author returns 403', async ({ request }) => {
        test.fail(true, 'API returns 404 instead of 403 for unauthorized article update on this demo instance')
        const id = Math.random().toString(36).slice(2, 8);
        const otherUser = { username: `user_${id}`, email: `user_${id}@test.com`, password: 'Test1234!' };
        const otherToken = await registerViaApi(otherUser);

        const response = await request.put(`${BASE_URL}/articles/${slug}`, {
            headers: { Authorization: `Token ${otherToken}` },
            data: { article: { title: 'Hijacked Title' } }
        });

        expect(response.status()).toBe(403);
    });
});

test.describe('DELETE /articles/:slug - delete article', () => {

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

    test('/DELETE article returns 200 and article no longer exists', async ({ request }) => {
        const deleteResponse = await request.delete(`${BASE_URL}/articles/${slug}`, {
            headers: { Authorization: `Token ${token}` }
        });

        expect(deleteResponse.status()).toBe(204);

        const getResponse = await request.get(`${BASE_URL}/articles/${slug}`);
        expect(getResponse.status()).toBe(404);
    });

    test('/DELETE article without token returns 401', async ({ request }) => {
        const response = await request.delete(`${BASE_URL}/articles/${slug}`);

        expect(response.status()).toBe(401);
    });

    test('/DELETE article by non-author returns 403', async ({ request }) => {
        test.fail(true, 'API returns 404 instead of 403 for unauthorized article deletion on this demo instance')
        const id = Math.random().toString(36).slice(2, 8);
        const otherUser = { username: `user_${id}`, email: `user_${id}@test.com`, password: 'Test1234!' };
        const otherToken = await registerViaApi(otherUser);

        const response = await request.delete(`${BASE_URL}/articles/${slug}`, {
            headers: { Authorization: `Token ${otherToken}` }
        });

        expect(response.status()).toBe(403);
    });
});

test.describe('POST/DELETE /articles/:slug/favorite - favorite article', () => {

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

    test('/POST favorite article returns 200 with favorited true', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/articles/${slug}/favorite`, {
            headers: { Authorization: `Token ${token}` }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.article.favorited).toBe(true);
        expect(body.article.favoritesCount).toBe(1);
    });

    test('/POST favorite article without token returns 401', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/articles/${slug}/favorite`);

        expect(response.status()).toBe(401);
    });

    test('/DELETE unfavorite article returns 200 with favorited false', async ({ request }) => {
        await request.post(`${BASE_URL}/articles/${slug}/favorite`, {
            headers: { Authorization: `Token ${token}` }
        });

        const response = await request.delete(`${BASE_URL}/articles/${slug}/favorite`, {
            headers: { Authorization: `Token ${token}` }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.article.favorited).toBe(false);
        expect(body.article.favoritesCount).toBe(0);
    });

    test('/DELETE unfavorite article without token returns 401', async ({ request }) => {
        const response = await request.delete(`${BASE_URL}/articles/${slug}/favorite`);

        expect(response.status()).toBe(401);
    });
});

test.describe('GET /articles/feed - article feed', () => {

    let token: string;

    test.beforeEach(async () => {
        const id = Math.random().toString(36).slice(2, 8);
        const user = { username: `user_${id}`, email: `user_${id}@test.com`, password: 'Test1234!' };
        token = await registerViaApi(user);
    });

    test('/GET feed returns 200 with articles array', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/articles/feed`, {
            headers: { Authorization: `Token ${token}` }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(Array.isArray(body.articles)).toBeTruthy();
        expect(body.articlesCount).toBeDefined();
    });

    test('/GET feed without token returns 401', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/articles/feed`);

        expect(response.status()).toBe(401);
    });
});
