const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            console.log(`User authenticated: ${req.user.username}`); // Add logging
            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        console.log('No token found in authorization header');
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        console.log('Admin access granted'); // Add logging
        next();
    } else {
        console.log(`User ${req.user.username} is not an admin`); // Add logging
        return res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };

/*const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.protect = async (req, res, next) => {
    let token;
    if (req.cookies.token) {
        token = req.cookies.token;
        console.log(`Token found in cookies: ${token}`);  // Debugging: Log the token
    }

    if (!token) {
        console.log('No token found');  // Debugging: Log if no token is found
        return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(`Decoded token: ${JSON.stringify(decoded)}`);  // Debugging: Log the decoded token
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        console.log(`Token verification failed: ${error.message}`);  // Debugging: Log verification failure
        return res.status(401).json({ message: 'Not authorized to access this route' });
    }
};
*/
