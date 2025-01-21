// src/models/Company.js
const mongoose = require('../config/mongodbConfig');

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    registrationNumber: { type: String, required: true }, // CIN or similar ID
    createdAt: { type: Date, default: Date.now },
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
