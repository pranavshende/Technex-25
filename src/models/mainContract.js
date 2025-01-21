const mongoose = require('mongoose');

const mainContractSchema = new mongoose.Schema({
    date: String,
    month: String,
    year: String,
    farmer: {
        name: String,
        address: String,
        contact: String,
        id: String
    },
    company: {
        name: String,
        address: String,
        contact: String,
        id: String
    },
    crops: String,
    price: Number,
    payment: {
        advance: Number,
        advanceDate: String,
        finalPaymentDays: Number
    },
    signatures: {
        farmerName: String,
        farmerSignDate: String,
        companyName: String,
        companySignDesignation: String,
        companySignDate: String
    }
});

module.exports = mongoose.model('mainContract', mainContractSchema);
