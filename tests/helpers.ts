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
