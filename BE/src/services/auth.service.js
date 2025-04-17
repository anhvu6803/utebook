const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const Auth = require('../models/auth.model');
const { sendVerificationCode, verifyCode } = require('../configs/twilio.config');

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

        // Xóa refresh token cũ nếu có
        await Auth.deleteMany({ userId: user._id });

        // Tạo access token
        const accessToken = jwt.sign(
            { 
                userId: user._id,
                email: user.email,
                isAdmin: user.isAdmin || false
            },
            process.env.JWT_SECRET,
            { expiresIn: '2m' }
        );

        // Tạo refresh token
        const refreshToken = jwt.sign(
            { 
                userId: user._id,
                email: user.email,
                isAdmin: user.isAdmin || false
            },
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
                googleId,
                avatar: picture.split('=')[0] + '?sz=100', // Lưu ảnh chất lượng cao hơn
                isVerified: true,
                password: await bcrypt.hash(googleId, 10),
                // Các trường bắt buộc khác
                address: "Chưa cập nhật",
                numberPhone: "Chưa cập nhật",
                gioiTinh: "Khác",
            });
        } else if (!user.googleId) {
            user.avatar = picture.split('=')[0] + '?sz=100'; // Cập nhật ảnh chất lượng cao hơn
            user.isVerified = true;
            await user.save();
        }

        // Xóa refresh token cũ nếu có
        await Auth.deleteMany({ userId: user._id });

        // Tạo access token
        const accessToken = jwt.sign(
            { 
                userId: user._id,
                email: user.email,
                isAdmin: user.isAdmin || false
            },
            process.env.JWT_SECRET,
            { expiresIn: '2m' }
        );

        // Tạo refresh token
        const refreshToken = jwt.sign(
            { 
                userId: user._id,
                email: user.email,
                isAdmin: user.isAdmin || false
            },
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
                avatar: user.avatar
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

            // Lấy thông tin user
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Tạo access token mới
            const accessToken = jwt.sign(
                { 
                    userId,
                    email: user.email,
                    isAdmin: user.isAdmin || false
                },
                process.env.JWT_SECRET,
                { expiresIn: '2m' }
            );

            return { 
                accessToken,
                user: {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    avatar: user.avatar
                }
            };
        } catch (error) {
            throw new Error('Failed to refresh token');
        }
    }

    async getMe(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            console.error('Get me service error:', error);
            throw error;
        }
    }
}

const sendPhoneVerification = async (phoneNumber) => {
    try {
        // Format phone number to international format
        const formattedPhone = phoneNumber.startsWith('0') ? `+84${phoneNumber.substring(1)}` : phoneNumber;
        const result = await sendVerificationCode(formattedPhone);
        return {
            success: true,
            message: 'Verification code sent successfully',
            data: result
        };
    } catch (error) {
        throw new Error(`Failed to send verification code: ${error.message}`);
    }
};

const verifyPhoneCode = async (phoneNumber, code) => {
    try {
        // Format phone number to international format
        const formattedPhone = phoneNumber.startsWith('0') ? `+84${phoneNumber.substring(1)}` : phoneNumber;
        const result = await verifyCode(formattedPhone, code);
        return {
            success: result.status === 'approved',
            message: result.status === 'approved' ? 'Phone number verified successfully' : 'Invalid verification code',
            data: result
        };
    } catch (error) {
        throw new Error(`Failed to verify code: ${error.message}`);
    }
};

module.exports = module.exports = new AuthService();
