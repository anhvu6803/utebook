const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const emailUtil = require('../utils/email.util');
const jwt = require('jsonwebtoken');

 const generateVerificationCode = () => {
    return crypto.randomInt(100000, 999999).toString();
};

 
const verificationCodes = new Map();

const userService = {
     async sendVerificationCode(email) {
         const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('Email already registered');
        }

         const verificationCode = generateVerificationCode();
        verificationCodes.set(email, {
            code: verificationCode,
            expires: Date.now() + 15 * 60 * 1000 
        });
        await emailUtil.sendVerificationCode(email, verificationCode);

        return { message: 'Verification code sent successfully' };
    },

     async register(userData, code) {
        const { email, password, ...rest } = userData;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('Email already registered');
        }

         const storedCode = verificationCodes.get(email);
        if (!storedCode) {
            throw new Error('No verification code found for this email');
        }

        if (Date.now() > storedCode.expires) {
            verificationCodes.delete(email);
            throw new Error('Verification code has expired');
        }

        if (storedCode.code !== code) {
            throw new Error('Invalid verification code');
        }

         if (storedCode.used) {
            verificationCodes.delete(email);
            throw new Error('Verification code has already been used');
        }

         storedCode.used = true;
        verificationCodes.set(email, storedCode);
    
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            ...rest,
            email,
            password: hashedPassword,
            isVerified: true
        });

         verificationCodes.delete(email);

        return await newUser.save();
    },

    async verifyEmail(email, code) {
        const storedCode = verificationCodes.get(email);
        
        if (!storedCode) {
            throw new Error('No verification code found for this email');
        }

        if (Date.now() > storedCode.expires) {
            verificationCodes.delete(email);
            throw new Error('Verification code has expired');
        }

        if (storedCode.code !== code) {
            throw new Error('Invalid verification code');
        }

         const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        user.isVerified = true;
        await user.save();
        verificationCodes.delete(email);

        return { message: 'Email verified successfully' };
    },

 
    async requestPasswordReset(email) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        // Generate access token that expires in 2 minutes
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '2m' }
        );

        // Store token in memory with used flag
        verificationCodes.set(email, {
            code: accessToken,
            expires: Date.now() + 2 * 60 * 1000,
            used: false
        });

        // Send email with reset password link containing the token
        await emailUtil.sendPasswordResetLink(email, accessToken);

        return { message: 'Password reset link sent to email' };
    },

     async resetPassword(token, newPassword) {
        try {
            // Verify the JWT token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId;

            // Find user by ID
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Check if token exists and hasn't been used
            const storedToken = verificationCodes.get(user.email);
            if (!storedToken || storedToken.code !== token) {
                throw new Error('Invalid reset token');
            }

            if (storedToken.used) {
                throw new Error('Reset token has already been used');
            }

            if (Date.now() > storedToken.expires) {
                verificationCodes.delete(user.email);
                throw new Error('Reset token has expired');
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();

            // Mark token as used
            storedToken.used = true;
            verificationCodes.set(user.email, storedToken);

            return { message: 'Password reset successfully' };
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new Error('Reset token has expired');
            }
            if (error.name === 'JsonWebTokenError') {
                throw new Error('Invalid reset token');
            }
            throw error;
        }
    }
};

module.exports = userService;
