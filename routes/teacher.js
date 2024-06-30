// routes/teacher.js
const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');

// Get all teachers
router.get('/', async (req, res) => {
    const teachers = await Teacher.find();
    res.json(teachers);
});

// Add a new teacher
router.post('/', async (req, res) => {
    const teacher = new Teacher(req.body);
    await teacher.save();
    res.status(201).json(teacher);
});

module.exports = router;
