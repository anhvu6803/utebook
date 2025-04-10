const mongoose = require('mongoose');

const MembershipPackageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    expire: {
        type: Number, // Thời hạn gói membership (số ngày)
        required: true,
        min: 1
    }
}, { timestamps: true });

module.exports = mongoose.model('MembershipPackage', MembershipPackageSchema); 