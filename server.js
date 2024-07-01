const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protect } = require('./middleware/auth');
const User = require('./models/user');

dotenv.config();  // Load environment variables

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const mongoURI = process.env.MONGO_URI;  // Get MongoDB URI from environment variables
if (!mongoURI) {
    console.error('MONGO_URI is not defined in .env file');
    process.exit(1);
}

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Serve static files
app.use(express.static('public'));

// Routes to serve HTML files
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/register.html');
});

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
/*app.post('/login', async (req, res) => {
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
});*/

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && await user.matchPassword(password)) {
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            console.log(`Generated token: ${token}`);  // Debugging: Log the token
            res.cookie('token', token, { httpOnly: true });
            return res.json({ role: user.role });
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});



// Middleware for protected routes
app.get('/admin', protect, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    res.sendFile(__dirname + '/public/admin.html');
});

app.get('/teacher', protect, (req, res) => {
    if (req.user.role !== 'teacher') {
        return res.status(403).json({ message: 'Access denied' });
    }
    res.sendFile(__dirname + '/public/teacher.html');
});

app.get('/animator', protect, (req, res) => {
    if (req.user.role !== 'animator') {
        return res.status(403).json({ message: 'Access denied' });
    }
    res.sendFile(__dirname + '/public/animator.html');
});

app.get('/organizer', protect, (req, res) => {
    if (req.user.role !== 'organizer') {
        return res.status(403).json({ message: 'Access denied' });
    }
    res.sendFile(__dirname + '/public/organizer.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
