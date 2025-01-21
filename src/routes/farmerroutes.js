// Import your FarmerRegistration model
const express = require('express');
const router = express.Router();
const {addFarmersRegistrationToMongoDB} = require('../routes/loginRoutes');

// API endpoint to fetch farmer registration by email
router.get('/api/fetch-registration', async (req, res) => {
    const { email } = req.query;

    try {
        const farmerRegistration = await addFarmersRegistrationToMongoDB.findOne({ email });

        if (!farmerRegistration) {
            return res.status(404).json({ error: 'Farmer registration not found for the provided email.' });
        }

        res.json(farmerRegistration);
    } catch (error) {
        console.error('Error fetching farmer registration:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
