const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
    firmName: { type: String, required: true },
    cropType: { type: String, required: true },
    cropQuality: { type: String, required: true },
    timePeriod: { type: String, required: true },
    amountOfCrop: { type: Number, required: true },
    additionalInfo: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;
