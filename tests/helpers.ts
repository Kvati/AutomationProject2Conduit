import { request } from '@playwright/test';

export const BASE_URL = 'https://api.realworld.show/api';

type User = {
    username: string;
    email: string;
    password: string;
};

// Registers a user via the API and returns their JWT token.
// Used by fixtures to set up authenticated state without driving the browser
// through the registration form.
export async function registerViaApi(user: User): Promise<string> {
    const apiContext = await request.newContext();
    const response = await apiContext.post(`${BASE_URL}/users`, {
        data: { user: { username: user.username, email: user.email, password: user.password } }
    });
    const body = await response.json();
    await apiContext.dispose();
    return body.user.token;
}


type Article = {
    title: string;
    description: string;
    body: string;
    tagList: string[];
};

export async function createArticleViaApi(article: Article, token: string): Promise<string> {
    const apiContext = await request.newContext();
    const response = await apiContext.post(`${BASE_URL}/articles`, {
        headers: { Authorization: `Token ${token}` },
        data: { article }
    });
    const body = await response.json();
    await apiContext.dispose();
    return body.article.slug;
}

export async function createCommentViaApi(slug: string, commentBody: string, token: string): Promise<number> {
    const apiContext = await request.newContext();
    const response = await apiContext.post(`${BASE_URL}/articles/${slug}/comments`, {
        headers: { Authorization: `Token ${token}` },
        data: { comment: { body: commentBody } }
    });
    const body = await response.json();
    await apiContext.dispose();
    return body.comment.id;
}