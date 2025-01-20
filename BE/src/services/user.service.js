const bcrypt = require('bcrypt');
const User = require('../models/user.model');

exports.registerUser = async (userData) => {
    const { username, email, password } = userData;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        throw new Error('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        username,
        fullname: userData.fullname,
        password: hashedPassword,
        email,
        ngaySinh: userData.ngaySinh,
        gioiTinh: userData.gioiTinh,
        sachYeuThich: [],
        sachSangTac: [],
    });

    return await newUser.save();
};
