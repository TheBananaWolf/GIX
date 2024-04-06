const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Adjust the path as necessary to import your Express app
const UserAuth = require('../models/UserAuthSchema');
const bcrypt = require('bcryptjs');

// Optional: If you're using a separate test database and want to clear it before each test
async function clearDatabase() {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
}

async function loginUserAndGetToken(email = 'testuser@example.com', password = 'password123') {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    await UserAuth.create({
        email: email,
        password: hashedPassword,
    });

    // Login to get the token
    const loginResponse = await request(app).post('/api/auth/login').send({
        email,
        password,
    });

    // Return the token
    return {token: loginResponse.body.token};
}

describe('Auth Routes', () => {
    beforeAll(async () => {
        // Ensure the NODE_ENV is set to 'test' to use the local test database
        process.env.NODE_ENV = 'test';
    });

    afterAll(async () => {
        // Close the mongoose connection
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Clear the test database before each test
        await clearDatabase();
    });

    describe('For endpoints:', () => {
        it('/register should create a new user and return status 201', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'password',
                firstName: 'Test',
                lastName: 'User',
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData);

            expect(response.statusCode).toBe(201);
            expect(response.text).toBe('User created with profile');
            // Add more assertions as needed
        });

        it('/login authenticates a user and returns a token', async () => {
            // First, create a user directly in the database
            const hashedPassword = await bcrypt.hash('password123', 10);
            await UserAuth.create({
                email: 'testlogin@example.com',
                password: hashedPassword,
            });

            // Now, attempt to log in as that user
            const response = await request(app).post('/api/auth/login').send({
                email: 'testlogin@example.com',
                password: 'password123',
            });

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('token'); // Assuming token is returned in body
        });

        it('/getUserAuth returns user auth info for a logged-in user', async () => {
            // Assuming you have a utility function or a beforeAll setup that logs in a user and provides a token
            const {token} = await loginUserAndGetToken();

            const response = await request(app)
                .get('/api/auth/getUserAuth')
                .set('Authorization', `Bearer ${token}`); // Set the token in the Authorization header

            expect(response.statusCode).toBe(200);
            // Add assertions specific to the returned user auth info
        });

        it('/updateUserAuth updates user info for logged-in user', async () => {
            // Log in to get a token
            const {token} = await loginUserAndGetToken(); // Implement this based on your auth flow

            const response = await request(app)
                .put('/api/auth/updateUserAuth')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    email: 'newemail@example.com',
                    currentPassword: 'password123', // Assuming this matches the user's current password
                    newPassword: 'newPassword123',
                });

            expect(response.statusCode).toBe(200);
            // Check if the user's info has been updated as expected
        });

        it('/deleteAccount deletes the user account for logged-in user', async () => {
            // Log in to get a token
            const {token} = await loginUserAndGetToken(); // Implement this based on your auth flow

            const response = await request(app)
                .delete('/api/auth/deleteAccount')
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            // Further verify that the user has been deleted from the database
        });

        it('/logout confirms user logout', async () => {
            const response = await request(app).post('/api/auth/logout');
            expect(response.statusCode).toBe(200);
            expect(response.text).toContain('Logout successful');
        });

        // Add more tests as needed
    });

    // Test other endpoints as needed
});
