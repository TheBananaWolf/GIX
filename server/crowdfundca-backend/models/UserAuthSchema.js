const mongoose = require('mongoose');

const UserAuthSchema = new mongoose.Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true}
}, {timestamps: true});

module.exports = mongoose.model('UserAuth', UserAuthSchema, 'user_authentication_infos');
