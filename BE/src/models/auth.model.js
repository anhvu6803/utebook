const mongoose = require('mongoose');

const AuthSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    refreshToken: {
        type: String, 
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } 
    }
}, { timestamps: true });

module.exports = mongoose.model('Auth', AuthSchema);