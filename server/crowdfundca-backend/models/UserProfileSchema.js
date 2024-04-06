const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
    userId: {type: String, unique: true, required: true},
    firstName: String,
    lastName: String,
    profilePic: String, // To store a Base64 image string
    profileUrl: String,
    description: String,
    location: String,
    birthDate: Date,
    gender: String,
    ownedProjectList: [String],
    investedProjectList: [String],
}, {timestamps: true});

module.exports = mongoose.model('UserProfile', UserProfileSchema, 'user_profile_info');
