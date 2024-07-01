const mongoose = require('mongoose');

const KidSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    }
});

const Kid = mongoose.model('Kid', KidSchema);
module.exports = Kid;
