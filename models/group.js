const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    term: {
        type: String,
        required: true
    },
    program: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    yearsOfLearning: {
        type: Number
    },
    testResult: {
        type: Number
    }
});

const Group = mongoose.model('Group', GroupSchema);
module.exports = Group;
