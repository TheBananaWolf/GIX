const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserAuth = require('../models/UserAuthSchema');
const UserProfile = require('../models/UserProfileSchema');
const Admin = require('../models/AdminSchema');
const router = express.Router();

const JWT_SECRET = 'e5e8ad63c79951b93ba44ae33ffa8395f64c048793fd2a4c1ba38cb051987378';

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    if (!token) {
        return res.status(401).send('Access Denied: No token provided!');
    }
    try {
        req.user = jwt.verify(token, JWT_SECRET);// Add user info to request
        next(); // Continue to the next middleware/route handler
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
};

async function createProfile(userId, {firstName = 'Default FirstName', lastName = 'Default LastName'} = {}) {
    const existingProfile = await UserProfile.findOne({userId});
    if (existingProfile) {
        console.error('UserProfile already exists for userId:', userId);
        throw new Error('UserProfile already exists');
    }

    // Define default values for the user profile here, with firstName and lastName being variable
    const defaultProfileData = {
        firstName, // Use the provided firstName or default if not provided
        lastName,  // Use the provided lastName or default if not provided
        profilePic: '', // Assuming an empty string if no pictures are provided
        profileUrl: `https://example.com/user/${userId}`, // Example dynamic default based on userId
        description: 'No description provided.',
        location: 'Unknown location',
        birthDate: new Date(), // Default to current date/time
        gender: 'Not specified',
        ownedProjectList: [],
        investedProjectList: []
    };

    try {
        const profile = new UserProfile({userId, ...defaultProfileData});
        await profile.save();
        console.log('UserProfile created successfully for userId:', userId);
        return profile; // Return the created profile
    } catch (error) {
        console.error('Failed to create user profile:', error);
        throw error; // Rethrow the error for handling by the caller
    }
}

// Express route handler for creating a user profile via an API call
router.post('/createProfile', verifyToken, async (req, res) => {
    const userId = req.user.userId; // Assuming verifyToken adds userId to req.user
    const profileData = req.body;

    try {
        const profile = await createProfile(userId, profileData);
        res.status(201).json({message: 'Profile created successfully', profile});
    } catch (error) {
        if (error.message === 'UserProfile already exists') {
            res.status(409).send('UserProfile already exists for this user'); // 409 Conflict
        } else {
            res.status(500).send('Failed to create profile');
        }
    }
});

// Route handler for updating a user's profile information
router.put('/updateProfileInfos', verifyToken, async (req, res) => {
    const userId = req.user.userId; // Extracted from verified token
    const updateData = req.body;

    try {
        const updatedProfile = await UserProfile.findOneAndUpdate(
            {userId},
            {$set: updateData},
            {new: true, runValidators: true, context: 'query'} // Ensure the update operation returns the updated document and runs validators
        );

        if (!updatedProfile) {
            return res.status(404).send('UserProfile not found');
        }

        res.json({message: 'Profile updated successfully', profile: updatedProfile});
    } catch (error) {
        console.error('Failed to update profile:', error);
        res.status(500).send('Failed to update profile');
    }
});

// Assuming the front-end sends the Base64 encoded image in the body under profilePic key
router.put('/updateProfilePic', verifyToken, async (req, res) => {
    const userId = req.user.userId;
    const {profilePic} = req.body; // Base64 encoded image string

    try {
        const updatedProfile = await UserProfile.findOneAndUpdate(
            {userId},
            {$set: {profilePic}},
            {new: true}
        );

        if (!updatedProfile) {
            return res.status(404).send('UserProfile not found');
        }

        res.json({message: 'Profile picture updated successfully', profile: updatedProfile});
    } catch (error) {
        console.error('Failed to update profile picture:', error);
        res.status(500).send('Failed to update profile picture');
    }
});

// Route handler for retrieving the currently authenticated user's profile
// router.get('/getUserProfile', verifyToken, async (req, res) => {
//     const userId = req.user.userId; // Extracted from verified token

//     try {
//         const profile = await UserProfile.findOne({userId});
//         if (!profile) {
//             return res.status(404).send('UserProfile not found');
//         }

//         res.json(profile);
//     } catch (error) {
//         console.error('Failed to retrieve profile:', error);
//         res.status(500).send('Failed to retrieve profile');
//     }
// });
router.get('/getUserProfile', verifyToken, async (req, res) => {
    const userId = req.user.userId;

    try {
        const profile = await UserProfile.findOne({userId});
        if (!profile) {
            return res.status(404).send('UserProfile not found');
        }

        // 确保返回的用户信息中包含头像信息
        res.json({
          ...profile.toObject(), // 或者使用 profile.toJSON()，取决于您的设置
          profilePic: profile.profilePic // 确保这里的字段名与您存储头像信息的字段名相匹配
        });
    } catch (error) {
        console.error('Failed to retrieve profile:', error);
        res.status(500).send('Failed to retrieve profile');
    }
});

// zzk: Update project reward in user profile
router.put('/updateProfileProject', async (req, res) => {
    const { userId, newProjectStr } = req.query;
    let profile = await UserProfile.findOne({userId});
    if (!profile) {
        return res.status(404).send('UserProfile not found');
    }
    try {
        profile.investedProjectList.push(newProjectStr);
        console.log("investedProjectList: ", profile.investedProjectList);
        const updatedProfile = await UserProfile.findOneAndUpdate(
            {userId},
            {$set: profile},
            {new: true, runValidators: true, context: 'query'} // Ensure the update operation returns the updated document and runs validators
        );
        
        if (!updatedProfile) {
            return res.status(404).send('UserProfile not found');
        }
        return res.status(200).send('Profile updated successfully');
    } catch (error) {
        console.error('Failed to update profile:', error);
        res.status(500).send('Failed to update profile');
    }
});

module.exports = {router, createProfile};