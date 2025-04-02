const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    googleId: { type: String, unique: true },
    googleAccessToken: { type: String },
    googleRefreshToken: { type: String },
    avatar: { type: String },
    isVerified: { type: Boolean, default: false },
    ngaySinh: { type: Date, required: true },
    gioiTinh: { type: String, enum: ['Nam', 'Nữ', 'Khác'], required: true },
    isMember: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    numberPhone: { type: String, required: true },
    address: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);