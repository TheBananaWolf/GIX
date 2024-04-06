const mongoose = require('mongoose');

const UserAuthSchema = new mongoose.Schema({
    userId: String,
    password: String,
    email: String,
}, { timestamps: true }); //createdAt and updatedAt fields

const UserAuth = mongoose.model('UserAuth', UserAuthSchema, 'user_authentication_infos');

const UserProfileSchema = new mongoose.Schema({
    // fields in user_profile_info collection
    userId: String,
    firstName: String,
    lastName: String,
}, { timestamps: true }); //createdAt and updatedAt fields

const UserProfile = mongoose.model('UserProfile', UserProfileSchema, 'user_profile_info');

const User = {
    Auth: UserAuth,
    Profile: UserProfile
}

module.exports = User;
