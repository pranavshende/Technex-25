// src/routes/loginRoutes.js

const express = require('express');
const passport = require('../config/passportConfig2'); // Passport configuration
const router = express.Router();
const { appendUser } = require('../services/loginSheetServices');

// Signin route: Authenticate the user using passport
router.post('/signin', passport.authenticate('local'), (req, res) => {
    res.json({
        success: true,
        message: 'Login successful!',
        user: { name: req.user.name, email: req.user.email, role: req.user.role },
    });
});

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const result = await appendUser(name, email, password, 'user');  // Default role is 'user'

        if (result.success) {
            res.json({
                success: true,
                message: 'Signup successful! Please login.',
            });
        } else {
            res.json({
                success: false,
                message: result.message || 'There was an error during signup. Please try again.',
            });
        }
    } catch (error) {
        console.error('Error during signup:', error);
        res.json({
            success: false,
            message: 'An error occurred during signup. Please try again.',
        });
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ success: false, message: 'Logout failed' });
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

module.exports = router;
