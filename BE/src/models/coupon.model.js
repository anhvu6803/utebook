const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    coupon: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    listUserUsed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Coupon', couponSchema); 