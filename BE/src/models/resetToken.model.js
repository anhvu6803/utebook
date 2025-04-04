const mongoose = require('mongoose');

const resetTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    used: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 120 // Token expires after 2 minutes
    }
});

module.exports = mongoose.model('ResetToken', resetTokenSchema); 