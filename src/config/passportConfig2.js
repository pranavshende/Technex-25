// src/config/passportConfig2.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const loginSheetServices = require('../services/loginSheetServices');

// Passport Local Strategy
passport.use(new LocalStrategy(
    async (email, password, done) => {
        try {
            const users = await loginSheetServices.fetchUsers();
            const user = users.find(u => u.email === email && u.password === password);

            if (!user) {
                return done(null, false, { message: 'Invalid credentials' });
            }

            // User found, authenticate them
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// Serialize and deserialize user to manage sessions
passport.serializeUser((user, done) => {
    done(null, user.email);  // Store email in session
});

passport.deserializeUser(async (email, done) => {
    try {
        const users = await loginSheetServices.fetchUsers();
        const user = users.find(u => u.email === email);
        done(null, user);  // Attach user to req.user
    } catch (error) {
        done(error);
    }
});

module.exports = passport;
