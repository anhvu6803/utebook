const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const Auth = require('../models/auth.model');

class AuthService {
    async login(email, password) {
        // Tìm user theo email
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Email không tồn tại');
        }

        // Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Mật khẩu không đúng');
        }

        // Tạo access token
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '2m' }
        );

        // Tạo refresh token
        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '1d' }
        );

        // Lưu refresh token vào database
        await Auth.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) 
        });

        return {
            accessToken,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            }
        };
    }

    async googleLogin(email, name, picture, googleId) {
        // Tìm user theo email hoặc googleId
        let user = await User.findOne({ 
            $or: [
                { email },
                { googleId }
            ]
        });
        
        if (!user) {
            // Tạo username từ email
            const username = email.split('@')[0] + Math.floor(Math.random() * 1000);
            
            // Tạo user mới nếu chưa tồn tại
            user = await User.create({
                email,
                name,
                fullname: name,
                username,
                picture,
                googleId,
                isVerified: true,
                password: await bcrypt.hash(googleId, 10),
                // Các trường bắt buộc khác
                address: "Chưa cập nhật",
                numberPhone: "Chưa cập nhật",
                gioiTinh: "Khác",
                ngaySinh: new Date('2000-01-01')
            });
        } else if (!user.googleId) {
            // Cập nhật thông tin Google nếu user đã tồn tại nhưng chưa liên kết với Google
            user.googleId = googleId;
            user.picture = picture;
            user.isVerified = true;
            await user.save();
        }

        // Tạo access token
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '2m' }
        );

        // Tạo refresh token
        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '1d' }
        );

        // Lưu refresh token vào database
        await Auth.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) 
        });

        return {
            accessToken,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                picture: user.picture
            }
        };
    }

    async logout(userId) {
        try {
            await Auth.deleteMany({ userId });
            return { message: 'Đăng xuất thành công' };
        } catch (error) {
            throw new Error('Lỗi khi đăng xuất');
        }
    }

    async refreshToken(userId) {
        try {
            // Tìm refresh token của user trong database
            const auth = await Auth.findOne({ userId });
            if (!auth) {
                throw new Error('No refresh token found');
            }

            // Kiểm tra token hết hạn
            if (auth.expiresAt < new Date()) {
                await Auth.deleteOne({ _id: auth._id });
                throw new Error('Refresh token expired');
            }

            // Tạo access token mới
            const accessToken = jwt.sign(
                { userId },
                process.env.JWT_SECRET,
                { expiresIn: '2m' }
            );

            // Tạo refresh token mới
            const refreshToken = jwt.sign(
                { userId },
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: '1d' }
            );

            // Cập nhật refresh token trong database
            auth.refreshToken = refreshToken;
            auth.expiresAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
            await auth.save();

            return { accessToken };
        } catch (error) {
            throw new Error('Failed to refresh token');
        }
    }
}

module.exports = new AuthService();
