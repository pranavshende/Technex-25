const express = require('express');
const router = express.Router();
const Contract = require('../models/contract');
const Company = require('../models/company');



router.post('/contracts', async (req, res) => {
    try {
        const { firmName, cropType, cropQuality, timePeriod, amountOfCrop, additionalInfo } = req.body;

        const newContract = new Contract({
            firmName,
            cropType,
            cropQuality,
            timePeriod,
            amountOfCrop,
            additionalInfo
        });

        await newContract.save();
        res.json({ success: true });
    } catch (error) {
        console.error('Error creating contract:', error);
        res.status(500).json({ success: false, message: 'An error occurred while creating the contract.' });
    }
});

module.exports = router;
