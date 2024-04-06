// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');
// const User = require('../models/userSchemas');
//
// // Sign-in route
// router.post('/signin', async function (req, res) {
//     const {email, password} = req.body;
//
//     let userQuery = {email};
//
//     try {
//         // Attempt to find user
//         const user = await User.Auth.findOne(userQuery);
//
//         if (!user) {
//             return res.status(400).json({message: 'User does not exist'});
//         }
//
//         // Check password
//         if (user.password !== password) {
//             return res.status(400).json({message: 'Your sign-in info is wrong.'});
//         }
//
//         // If the execution reaches this point, the sign in was successful
//         return res.status(200).json({message: 'Sign-in successful!', userData: user});
//
//     } catch (e) {
//         // Catch any potential errors, probably related to server or database
//         console.log(e);
//         return res.status(500).json({message: 'An internal server error occurred'});
//     }
// });

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserAuth = require('../models/UserAuthSchema');
const UserProfile = require('../models/UserProfileSchema');
const {createProfile} = require('./profile');
const Admin = require('../models/AdminSchema');
const router = express.Router();

const JWT_SECRET = 'e5e8ad63c79951b93ba44ae33ffa8395f64c048793fd2a4c1ba38cb051987378';

// Middleware to verify token
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

router.post('/register', async (req, res) => {
    const {email, password, firstName, lastName} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const userAuth = new UserAuth({email, password: hashedPassword});
        await userAuth.save();

        // Now call createProfile, passing userId and the names to replace default ones
        await createProfile(userAuth._id.toString(), {firstName, lastName});

        // U decide if your want to sign in here @Pengyu.
        // const token = jwt.sign({ userId: userAuth._id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).send('User created with profile');
    } catch (error) {
        console.error(error); // It's helpful to log the error for debugging
        res.status(500).send('Error creating the user or profile');
    }
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const userAuth = await UserAuth.findOne({email});
        if (!userAuth || !await bcrypt.compare(password, userAuth.password)) {
            return res.status(401).send('Invalid credentials');
        }
        // verified user, generate JWT token
        const token = jwt.sign({userId: userAuth._id}, JWT_SECRET, {expiresIn: '365d'}); //assume expire in 1h
        res.json({token});
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('An error occurred during the login process.');
    }
});

router.get('/getUserAuth', verifyToken, async (req, res) => {
    try {
        // Directly access userId from req.user, which is set by verifyToken middleware
        const userId = req.user.userId;

        // Get user auth info based on userId and exclude password
        const userAuth = await UserAuth.findById(userId).select('-password');

        if (!userAuth) {
            return res.status(404).send('User not found');
        }

        res.json(userAuth);
    } catch (error) {
        // Adjusted to catch potential errors from findById operation
        console.error('Error fetching user authentication information:', error);
        res.status(500).send('Error fetching user authentication information');
    }
});


router.put('/updateUserAuth', verifyToken, async (req, res) => {
    const {email, newPassword, currentPassword} = req.body;
    const userId = req.user.userId;

    try {
        const userAuth = await UserAuth.findById(userId);
        if (!userAuth) {
            return res.status(404).send('User not found');
        }

        let update = {};
        if (email) update.email = email;

        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).send('Current password is required for password changes.');
            }
            if (!await bcrypt.compare(currentPassword, userAuth.password)) {
                return res.status(401).send('Invalid current password.');
            }
            update.password = await bcrypt.hash(newPassword, 10);
        }

        const updatedUser = await UserAuth.findByIdAndUpdate(userId, {$set: update}, {new: true}).select('-password');

        res.json({message: 'User updated successfully', user: updatedUser});
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating user');
    }
});

// Updating UserAuth Without Current Password Verification
// router.put('/updateUserAuth', verifyToken, async (req, res) => {
//     const { email, newPassword } = req.body;
//     const userId = req.user.userId;
//
//     try {
//         let update = {};
//         if (email) update.email = email;
//
//         if (newPassword) {
//             update.password = await bcrypt.hash(newPassword, 10);
//         }
//
//         const updatedUser = await UserAuth.findByIdAndUpdate(userId, { $set: update }, { new: true }).select('-password');
//
//         if (!updatedUser) {
//             return res.status(404).send('User not found');
//         }
//
//         res.json({ message: 'User updated successfully', user: updatedUser });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error updating user');
//     }
// });


router.delete('/deleteAccount', verifyToken, async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Access Denied: No token provided!');
    }

    try {
        const userId = req.user.userId;

        // Attempt to delete the user's authentication record
        const deletedUserAuth = await UserAuth.findByIdAndDelete(userId);
        if (!deletedUserAuth) {
            return res.status(404).send('User authentication record not found');
        }

        // Attempt to delete the user's profile record
        // Assuming userId is used as a reference in UserProfile
        const deletedUserProfile = await UserProfile.findOneAndDelete({userId: userId});
        if (!deletedUserProfile) {
            // Consider whether you should return an error or just a warning if the profile is not found
            console.log('UserProfile not found for userId:', userId);
        }

        res.json({message: 'Account deleted successfully'});
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            res.status(401).send('Invalid Token');
        } else {
            console.log(error);
            res.status(500).send('Error deleting account');
        }
    }
});

router.post('/logout', (req, res) => {
    res.send('Logout successful. Please delete your token.');
});

module.exports = router;