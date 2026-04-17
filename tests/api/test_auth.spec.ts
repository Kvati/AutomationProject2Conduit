import {test, expect} from "@playwright/test";
import {BASE_URL, registerViaApi} from "../helpers";

test.describe('POST /users - registration', () => {

    test('/POST valid registration returns 200 with user object', async ({ request }) => {
        const id = Math.random().toString(36).slice(2, 8);
        const response = await request.post(`${BASE_URL}/users`, {
            data: { user: { username: `user_${id}`, email: `user_${id}@test.com`, password: 'Test1234!' } }
        });

        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(body.user.username).toBe(`user_${id}`);
        expect(body.user.email).toBe(`user_${id}@test.com`);
        expect(body.user.token).toBeDefined();
    });

    test('/POST registration with duplicate email returns 422 with error', async ({ request }) => {
        test.fail(true, 'Website has no validation for duplicate email')
        const id = Math.random().toString(36).slice(2, 8);
        const user = { username: `user_${id}`, email: `user_${id}@test.com`, password: 'Test1234!' };
        await registerViaApi(user);

        const response = await request.post(`${BASE_URL}/users`, {
            data: { user: { username: `different_${id}`, email: user.email, password: 'Test1234!' } }
        });

        expect(response.status()).toBe(422);
        const body = await response.json();
        expect(body.errors.email[0]).toBe('has already been taken');
    });

    test('/POST registration with duplicate username returns 422 with error', async ({ request }) => {
        test.fail(true, 'Website has no validation for duplicate username')
        const id = Math.random().toString(36).slice(2, 8);
        const user = { username: `user_${id}`, email: `user_${id}@test.com`, password: 'Test1234!' };
        await registerViaApi(user);

        const response = await request.post(`${BASE_URL}/users`, {
            data: { user: { username: user.username, email: `different_${id}@test.com`, password: 'Test1234!' } }
        });

        expect(response.status()).toBe(422);
        const body = await response.json();
        expect(body.errors.username[0]).toBe('has already been taken');
    });

    test('/POST registration with empty username returns 422 with error', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/users`, {
            data: { user: { username: '', email: 'test@test.com', password: 'Test1234!' } }
        });

        expect(response.status()).toBe(422);
        const body = await response.json();
        expect(body.errors.username[0]).toBe("can't be blank");
    });

    test('/POST registration with empty email returns 422 with error', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/users`, {
            data: { user: { username: 'testuser', email: '', password: 'Test1234!' } }
        });

        expect(response.status()).toBe(422);
        const body = await response.json();
        expect(body.errors.email[0]).toBe("can't be blank");
    });

    test('/POST registration with empty password returns 422 with error', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/users`, {
            data: { user: { username: 'testuser', email: 'test@test.com', password: '' } }
        });

        expect(response.status()).toBe(422);
        const body = await response.json();
        expect(body.errors.password[0]).toBe("can't be blank");
    });
});

test.describe('POST /users/login - authentication', () => {

    let user: { username: string; email: string; password: string };
    let token: string;

    test.beforeEach(async () => {
        const id = Math.random().toString(36).slice(2, 8);
        user = { username: `user_${id}`, email: `user_${id}@test.com`, password: 'Test1234!' };
        token = await registerViaApi(user);
    });

    test('/POST valid login returns 200 with user object', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/users/login`, {
            data: {user: {email: user.email, password: user.password}}
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.user.email).toBe(user.email);
        expect(body.user.username).toBe(user.username);
        expect(body.user.token).toBeDefined();
    });

    test('/POST invalid login returns 401 with error', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/users/login`, {
            data: {user: {email: user.email, password: user.password + '$'}}
        });

        expect(response.status()).toBe(401);
        const body = await response.json();
        expect(body.errors.credentials[0]).toBe('invalid')
    });

    test('/POST login with empty email returns 422 with error', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/users/login`, {
            data: {user: {email: '', password: 'password'}}
        });

        expect(response.status()).toBe(422);
        const body = await response.json();
        expect(body.errors.email[0]).toBe("can't be blank")
    });

    test('/POST login with empty password returns 422 with error', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/users/login`, {
            data: {user: {email: 'email', password: ''}}
        });

        expect(response.status()).toBe(422);
        const body = await response.json();
        expect(body.errors.password[0]).toBe("can't be blank")
    });
});

test.describe('GET /user & PUT /user - current user', () => {

    let user: { username: string; email: string; password: string };
    let token: string;

    test.beforeEach(async () => {
        const id = Math.random().toString(36).slice(2, 8);
        user = { username: `user_${id}`, email: `user_${id}@test.com`, password: 'Test1234!' };
        token = await registerViaApi(user);
    });

    test('/GET user returns 200 with user object', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/user`, {
            headers: { Authorization: `Token ${token}` }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.user.email).toBe(user.email);
        expect(body.user.username).toBe(user.username);
        expect(body.user.token).toBeDefined();
    });

    test('/GET user with invalid token returns 401 with error', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/user`, {
            headers: { Authorization: `Token ${token}!!!` }
        });

        expect(response.status()).toBe(401);
        const body = await response.json();
        expect(body.errors.token[0]).toBe('is missing')
    });

    test('/GET user with missing token returns 401 with error', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/user`, {
            headers: { Authorization: `` }
        });

        expect(response.status()).toBe(401);
        const body = await response.json();
        expect(body.errors.token[0]).toBe('is missing')
    });

    test('/PUT valid user update returns 200 with user object', async ({ request }) => {
        const response = await request.put(`${BASE_URL}/user`, {
            headers: { Authorization: `Token ${token}` },
            data: {user: {email: 'newEmail@test.com', password: 'newPassword123', bio: 'newBio'}}
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.user.email).toBe('newEmail@test.com');
        expect(body.user.bio).toBe('newBio');
        expect(body.user.username).toBe(user.username);
        expect(body.user.token).toBeDefined();
    });

    test('/PUT invalid user password update returns 422 with error', async ({ request }) => {
        test.fail(true, 'Known app bug: empty password is accepted on update');

        const response = await request.put(`${BASE_URL}/user`, {
            headers: { Authorization: `Token ${token}` },
            data: {user: {email: 'newEmail@test.com', password: ''}}
        });

        expect(response.status()).toBe(422);
        //const body: any = await response.json();
        // assert error message once expected value is confirmed
        // expect(body.errors.password[0]).toBe('???');
    });

    test('/PUT invalid user email update returns 422 with error', async ({ request }) => {
        const response = await request.put(`${BASE_URL}/user`, {
            headers: { Authorization: `Token ${token}` },
            data: {user: {email: '', password: user.password}}
        });

        expect(response.status()).toBe(422);
        const body = await response.json();
        expect(body.errors.body[0]).toBe('email is a string of less than 100 chars')
    });
});
