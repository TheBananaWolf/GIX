const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
//const UserAuth = require('../models/UserAuthSchema');
//const UserProfile = require('../models/UserProfileSchema');
const Admin = require('../models/AdminSchema');
//const {createProfile} = require("./profile");
const router = express.Router();

const JWT_SECRET = 'e5e8ad63c79951b93ba44ae33ffa8395f64c048793fd2a4c1ba38cb051987378';

const API_BASE_URL_PROJECT = 'http://localhost:3001/api/project'; //path for project handlers
const API_BASE_URL_PROFILE = 'http://localhost:3001/api/profile'; //path for profile handlers
const API_BASE_URL_INDEX = 'http://localhost:3001/api'; //path for profile handlers

function generateTokenForUserId(userId) {
    return jwt.sign({userId: userId}, JWT_SECRET, {expiresIn: '365d'});
}

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

router.post('/adminregister', async (req, res) => {
    const {email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const admin = new Admin({email, password: hashedPassword});
        await admin.save();

        // U decide if your want to sign in here @Pengyu.
        // const token = jwt.sign({ userId: userAuth._id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).send('User created with profile');
    } catch (error) {
        console.error(error); // It's helpful to log the error for debugging
        res.status(500).send('Error creating the user or profile');
    }
});

router.post('/adminlogin', async (req, res) => {
    const {email, password} = req.body;
    try {
        const admin = await Admin.findOne({email});
        if (!admin || !await bcrypt.compare(password, admin.password)) {
            return res.status(401).send('Invalid credentials');
        }
        // verified user, generate JWT token
        //const token = jwt.sign({userId: admin._id}, JWT_SECRET, {expiresIn: '1h'}); //assume expire in 1h
        const token = generateTokenForUserId(admin._id)
        res.json({token});
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('An error occurred during the login process.');
    }
});

router.post('/adminCreateProfile', verifyToken, async (req, res) => {
    try {
        const {userId, profileData} = req.body; // Extract userId from the incoming request body
        const token = generateTokenForUserId(userId); // Generate the token with the target userId

        const response = await axios.post(`${API_BASE_URL_PROFILE}/createProfile`, profileData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include the generated token in the Authorization header
            },
        });

        res.json(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).json({message: error.message});
    }
});

router.put('/adminUpdateProfileInfos', verifyToken, async (req, res) => {
    try {
        const {userId, profileData} = req.body; // Extract userId and profileData from the incoming request body

        // Generate the token with the target userId
        const token = generateTokenForUserId(userId);

        // Forwarding the request to the profile.js service
        const response = await axios.put(`${API_BASE_URL_PROFILE}/updateProfileInfos`, profileData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include the generated token in the Authorization header
            },
        });

        // Responding with the data received from the profile.js service
        res.json(response.data);
    } catch (error) {
        // Error handling: respond based on the Axios error response
        res.status(error.response ? error.response.status : 500).json({message: error.message});
    }
});

router.put('/adminUpdateProfilePic', verifyToken, async (req, res) => {
    try {
        const {userId, profilePic} = req.body; // Extract userId and the base64-encoded image from the incoming request body

        // Generate the token with the target userId
        const token = generateTokenForUserId(userId);

        // Construct the body for the profile picture update. It's assumed that the profile.js
        // endpoint expects a structure similar to this.
        const requestBody = {profilePic};

        // Forwarding the request to the profile.js service
        const response = await axios.put(`${API_BASE_URL_PROFILE}/updateProfilePic`, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include the generated token in the Authorization header
            },
        });

        // Responding with the data received from the profile.js service
        res.json(response.data);
    } catch (error) {
        // Error handling: respond based on the Axios error response
        res.status(error.response ? error.response.status : 500).json({message: error.message});
    }
});

router.get('/adminGetUserProfile', verifyToken, async (req, res) => {
    try {
        // Extract the target userId from query parameters or directly from the admin's request
        // const {userId} = req.query;
        const userId = req.user.userId;

        // Generate the token with the target userId
        const token = generateTokenForUserId(userId);

        // Forwarding the request to the profile.js service
        // Note: Since it's a GET request, we don't send a body, but we set the Authorization header
        const response = await axios.get(`${API_BASE_URL_PROFILE}/getUserProfile`, {
            headers: {
                'Authorization': `Bearer ${token}`, // Include the generated token in the Authorization header
            },
        });

        // Responding with the data received from the profile.js service
        res.json(response.data);
    } catch (error) {
        // Error handling: respond based on the Axios error response
        res.status(error.response ? error.response.status : 500).json({message: error.message});
    }
});


// Not support files uploading, too complicated to implement it.
router.post('/adminUploadProject', verifyToken, async (req, res) => {
    try {
        const {userId, projectData} = req.body;
        const token = generateTokenForUserId(userId);
        // Directly passing req.body to the Axios request
        const response = await axios.post(`${API_BASE_URL_PROJECT}/`, projectData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        // Forwarding the response from the projects API
        res.json(response.data);
    } catch (error) {
        // Error handling: Respond based on the Axios error response
        res.status(error.response ? error.response.status : 500).json({message: error.message});
    }
});

// Not support files updating, too complicated to implement it.
router.post('/adminUpdateProject', verifyToken, async (req, res) => {
    try {
        const {userId, projectData} = req.body;
        const token = generateTokenForUserId(userId);
        // Similarly, directly passing req.body to Axios for the updateProject endpoint
        const response = await axios.post(`${API_BASE_URL_PROJECT}/updateProject`, projectData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        // Forwarding the response from the projects API
        res.json(response.data);
    } catch (error) {
        // Error handling
        res.status(error.response ? error.response.status : 500).json({message: error.message});
    }
});

router.post('/adminDeleteProject', verifyToken, async (req, res) => {
    try {
        // Assuming pid and token are sent as query parameters to the admin endpoint
        const {pid, token} = req.query;

        // Correctly forwarding the request using params for query parameters
        const response = await axios.post(`${API_BASE_URL_PROJECT}/deleteproject`, {}, {
            params: {pid, token} // This ensures pid and token are appended as query parameters
        });

        // Responding with the data received from the project.js handler
        res.json(response.data);
    } catch (error) {
        // Error handling, providing a response based on the Axios error response
        res.status(error.response ? error.response.status : 500).json({message: error.message});
    }
});

// Not support files return, too complicated to implement it.
router.post('/adminShowUserProject', verifyToken, async (req, res) => {
    try {
        const {userId, ...reqBodyWithoutUserId} = req.body;
        const token = generateTokenForUserId(userId);
        const response = await axios.post(`${API_BASE_URL_PROJECT}/showUserProjectAdmin`, reqBodyWithoutUserId, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).json({message: error.message});
    }
});

// Not support files return, too complicated to implement it.
router.get('/adminShowProjectBy', verifyToken, async (req, res) => {
    try {
        const userId = req.body;
        const token = generateTokenForUserId(userId);
        const response = await axios.get(`${API_BASE_URL_PROJECT}/showProjectBy`, {
            params: req.query,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).json({message: error.message});
    }
});


router.get('/adminGetCategoryInfoById', verifyToken, async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL_PROJECT}/getCategoryInfoById`, {
            params: req.query, // Forward all query parameters received directly
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).json({message: error.message});
    }
});


router.post('/adminUpdateProjectPrice', verifyToken, async (req, res) => {
    try {
        const {userId, ...reqBodyWithoutUserId} = req.body;
        const token = generateTokenForUserId(userId);
        // Directly forwarding the entire body received from the admin endpoint to the projects endpoint.
        const response = await axios.post(`${API_BASE_URL_PROJECT}/updateProjectPrice`, reqBodyWithoutUserId, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                // Include any authentication headers if needed
            },
        });

        // Responding with the data received from the projects API
        res.json(response.data);
    } catch (error) {
        // Error handling based on Axios error response
        res.status(error.response ? error.response.status : 500).json({message: error.message});
    }
});

//Doesn't support image/:filename

module.exports = router;