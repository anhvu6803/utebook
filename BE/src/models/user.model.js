const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    ngaySinh: { type: Date, required: true },
    gioiTinh: { type: String, enum: ['Nam', 'Nữ', 'Khác'], required: true },
    sachYeuThich: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    sachSangTac: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    isAdmin: { type: Boolean, default: false },
    confirmationToken: String,
    confirmationExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);