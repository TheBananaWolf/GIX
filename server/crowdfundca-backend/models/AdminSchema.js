const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true}
}, {timestamps: true});

module.exports = mongoose.model('Admin', AdminSchema, 'admin_infos');
