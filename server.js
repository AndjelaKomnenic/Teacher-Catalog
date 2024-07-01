const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const User = require('models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Serve static files
app.use(express.static('public'));

// User registration
app.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    const user = new User({ username, password, role });
    try {
        await user.save();
        res.redirect('/login');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// User login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && await user.matchPassword(password)) {
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true });
            switch (user.role) {
                case 'admin':
                    res.redirect('/admin');
                    break;
                case 'teacher':
                    res.redirect('/teacher');
                    break;
                case 'animator':
                    res.redirect('/animator');
                    break;
                case 'organizer':
                    res.redirect('/organizer');
                    break;
                default:
                    res.status(401).json({ message: 'Invalid role' });
            }
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Middleware for protected routes
const protect = async (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id);
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Admin route
app.get('/admin', protect, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    res.send('Welcome to the admin page');
});

// Teacher route
app.get('/teacher', protect, (req, res) => {
    if (req.user.role !== 'teacher') {
        return res.status(403).json({ message: 'Access denied' });
    }
    res.send('Welcome to the teacher page');
});

// Animator route
app.get('/animator', protect, (req, res) => {
    if (req.user.role !== 'animator') {
        return res.status(403).json({ message: 'Access denied' });
    }
    res.send('Welcome to the animator page');
});

// Organizer route
app.get('/organizer', protect, (req, res) => {
    if (req.user.role !== 'organizer') {
        return res.status(403).json({ message: 'Access denied' });
    }
    res.send('Welcome to the organizer page');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
