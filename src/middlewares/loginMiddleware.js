const loginSheetServices = require('../services/loginSheetServices');

async function fetchUserRole(req, res, next) {
    try {
        // Check if req.user exists (set by Passport after successful login)
        if (!req.user) {
            res.status(401).send('User not authenticated');
            return;
        }

        // Fetch users and find the logged-in user by their email
        const users = await loginSheetServices.fetchUsers();
        const user = users.find(u => u.email.toLowerCase() === req.user.email.toLowerCase());

        if (!user) {
            res.status(403).send('Access forbidden: User not found');
            return;
        }

        // Attach the user role to the request object for downstream middleware
        req.user.role = user.role;
        next();
    } catch (error) {
        console.error('Error in fetchUserRole middleware:', error);
        res.status(500).send('Server error while fetching user role');
    }
}

function authorize(allowedRoles = []) {
    return (req, res, next) => {
        try {
            // Ensure the role exists on req.user (set by fetchUserRole middleware)
            if (!req.user || !req.user.role) {
                res.status(403).send('Access forbidden: Role not assigned');
                return;
            }

            // Check if the user role matches any of the allowed roles
            if (allowedRoles.includes(req.user.role)) {
                next();
                return;
            }

            res.status(403).send('Access forbidden: Insufficient permissions');
        } catch (error) {
            console.error('Error in authorization middleware:', error);
            res.status(500).send('Server error during authorization');
        }
    };
}

module.exports = { fetchUserRole, authorize };
