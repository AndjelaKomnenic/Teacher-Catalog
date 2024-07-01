const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    }
});

const Trip = mongoose.model('Trip', TripSchema);
module.exports = Trip;
