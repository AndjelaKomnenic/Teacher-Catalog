const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    kid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Kid',
        required: true
    },
    sundayDinner: String,
    mondayLunch: String,
    mondayDinner: String,
    tuesdayLunch: String,
    tuesdayDinner: String,
    wednesdayLunch: String,
    wednesdayDinner: String,
    thursdayLunch: String,
    thursdayDinner: String,
    fridayLunch: String,
    fridayDinner: String
});

const Menu = mongoose.model('Menu', MenuSchema);
module.exports = Menu;
