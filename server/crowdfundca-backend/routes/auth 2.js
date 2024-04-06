const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/userSchemas');

// Sign-in route
router.post('/signin', async function(req, res) {
    const {email, password} = req.body;

    let userQuery = {email};

    try {
        // Attempt to find user
        const user = await User.Auth.findOne(userQuery);

        if(!user) {
            return res.status(400).json({message: 'User does not exist'});
        }

        // Check password
        if(user.password !== password) {
            return res.status(400).json({message: 'Your sign-in info is wrong.'});
        }

        // If the execution reaches this point, the sign in was successful
        return res.status(200).json({message: 'Sign-in successful!', userData: user});

    } catch(e) {
        // Catch any potential errors, probably related to server or database
        console.log(e);
        return res.status(500).json({message: 'An internal server error occurred'});
    }
});

module.exports = router;