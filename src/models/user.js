// src/models/User.js
const mongoose = require('../config/mongodbConfig');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: String,
    role: { type: String, default: 'user' },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
