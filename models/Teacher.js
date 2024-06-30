// models/Teacher.js
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    // Add more fields as needed
});

module.exports = mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema);
