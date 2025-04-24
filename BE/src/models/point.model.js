const mongoose = require('mongoose');

const PointSchema = new mongoose.Schema({
    id_user: {
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
    }
}, { timestamps: true });

module.exports = mongoose.model('Point', PointSchema); 