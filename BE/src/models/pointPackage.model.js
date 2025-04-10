const mongoose = require('mongoose');

const PointPackageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    quantity_HoaPhuong: {
        type: Number,
        required: true,
        min: 0
    },
    quantity_La: {
        type: Number,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('PointPackage', PointPackageSchema); 