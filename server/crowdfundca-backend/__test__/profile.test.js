const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const bcrypt = require('bcryptjs');
const UserAuth = require('../models/UserAuthSchema');
const UserProfile = require('../models/UserProfileSchema');

async function clearDatabase() {
    await mongoose.connection.db.dropDatabase();
}

async function loginUserAndGetToken(email = 'testuser@example.com', password = 'password123', firstName = 'Default FirstName', lastName = 'Default LastName') {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = await UserAuth.create({
        email: email,
        password: hashedPassword,
    });

    // Login to get the token
    const loginResponse = await request(app).post('/api/auth/login').send({
        email,
        password,
    });

    user_Id = newUser._id.toString()

    await UserProfile.create({
        userId: user_Id,
        firstName, // Use the provided firstName or default if not provided
        lastName,  // Use the provided lastName or default if not provided
        profilePic: '', // Assuming an empty string if no pictures are provided
        profileUrl: `https://example.com/user/${user_Id}`, // Example dynamic default based on userId
        description: 'No description provided.',
        location: 'Unknown location',
        birthDate: new Date(), // Default to current date/time
        gender: 'Not specified',
        ownedProjectList: [],
        investedProjectList: []
    });

    // Return the token
    return {token: loginResponse.body.token};
}

beforeAll(async () => {
    process.env.NODE_ENV = 'test';
});

afterAll(async () => {
    await mongoose.connection.close();
});

beforeEach(async () => {
    await UserAuth.deleteMany({});
    await UserProfile.deleteMany({});
    await clearDatabase();
});

describe('Profile Routes', () => {
    describe('Profile management', () => {

        it('/updateProfileInfos updates user profile information', async () => {
            const {token} = await loginUserAndGetToken();

            const updateData = {
                firstName: 'Jane',
                lastName: 'Doe',
                // Additional fields to update
            };

            const response = await request(app)
                .put('/api/profile/updateProfileInfos')
                .set('Authorization', `Bearer ${token}`)
                .send(updateData);

            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Profile updated successfully');
            // Verify updated profile content
        });

        it('/getUserProfile retrieves the authenticated user\'s profile', async () => {
            const {token} = await loginUserAndGetToken();

            const response = await request(app)
                .get('/api/profile/getUserProfile')
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('firstName');
            expect(response.body).toHaveProperty('lastName');
            // Add more assertions to verify profile content
        });
    });
});
