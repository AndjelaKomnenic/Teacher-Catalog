const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.DATABASE_URL);

// JWT secret key
const secretKey = process.env.JWT_SECRET;

// User schema and model
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('User', userSchema);

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
        const token = bearerHeader.split(' ')[1];
        jwt.verify(token, secretKey, (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                req.user = authData.user;
                next();
            }
        });
    } else {
        res.sendStatus(403);
    }
};

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
        const token = jwt.sign({ user }, secretKey);
        res.json({ token });
    } else {
        res.sendStatus(401);
    }
});

// Catalog route
app.get('/catalog', verifyToken, (req, res) => {
    res.json({ message: 'Catalog data' });
});

// Import and use teacher routes
const teacherRoutes = require('./routes/teacher');
app.use('/teachers', verifyToken, teacherRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
