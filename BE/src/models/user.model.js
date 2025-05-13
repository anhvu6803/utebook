const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, default: 'https://res.cloudinary.com/dbmynlh3f/image/upload/v1744344255/uvanagmmqvxwqb0dslew.jpg' },
    googleId: { type: String },
    isVerified: { type: Boolean, default: false },
    ngaySinh: { type: Date, required: false },
    gioiTinh: { type: String, enum: ['Nam', 'Nữ', 'Khác'], required: true },
    isMember: { type: Boolean, default: false },
    membershipExpirationDate: { type: Date },
    isAdmin: { type: Boolean, default: false },
    numberPhone: { type: String, required: true },
    isPhoneVerified: { type: Boolean, default: false },
    listFavoriteBook: { type: [String], default: [] },
}, { timestamps: true });

// Tạo index cho googleId chỉ khi nó không null

module.exports = mongoose.model('User', UserSchema);