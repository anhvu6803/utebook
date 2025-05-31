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
    },

    async updateUser(userId, updateData) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Extract points data if it exists
            const { points, password, ...userUpdateData } = updateData;

            // Check for duplicate phone number if phone number is being updated
            if (userUpdateData.numberPhone && userUpdateData.numberPhone !== user.numberPhone) {
                const existingUser = await User.findOne({ 
                    numberPhone: userUpdateData.numberPhone,
                    _id: { $ne: userId } // Exclude current user
                });
                if (existingUser) {
                    throw new Error('Phone number already exists');
                }
            }

            // Hash password if provided
            if (password) {
                userUpdateData.password = await bcrypt.hash(password, 10);
            }

            // Update user data
            Object.keys(userUpdateData).forEach(key => {
                if (userUpdateData[key] !== undefined) {
                    user[key] = userUpdateData[key];
                }
            });

            await user.save();

            // Update points if provided
            if (points) {
                const Point = require('../models/point.model');
                await Point.findOneAndUpdate(
                    { id_user: user._id },
                    {
                        quantity_HoaPhuong: points.hoaPhuong,
                        quantity_La: points.la
                    },
                    { new: true, upsert: true }
                );
            }

            // Get updated points
            const Point = require('../models/point.model');
            const point = await Point.findOne({ id_user: user._id });

            // Remove password from response
            const userResponse = user.toObject();
            delete userResponse.password;

            return {
                success: true,
                message: 'User updated successfully',
                data: {
                    ...userResponse,
                    points: point ? {
                        hoaPhuong: point.quantity_HoaPhuong,
                        la: point.quantity_La
                    } : {
                        hoaPhuong: 0,
                        la: 0
                    }
                }
            };
        } catch (error) {
            throw new Error(`Failed to update user: ${error.message}`);
        }
    },

    async getListFavorite(userId) {
        try {
            const user = await User.findById(userId).populate('listFavoriteBook');

            if (!user) {
                throw new Error('User not found');
            }
            const result = {
                Free: [],
                Member: [],
                HoaPhuong: []
            };

            user.listFavoriteBook.forEach(book => {
                if (book && result[book.type]) {
                    result[book.type].push({
                        book: book
                    });
                }
            });

            return result;
        } catch (error) {
            throw error;
        }
    },

    async checkAndUpdateMembershipStatus() {
        try {
            // Tìm tất cả users có isMember=true và membershipExpirationDate đã qua
            const currentDate = new Date();
            const expiredMembers = await User.find({
                isMember: true,
                membershipExpirationDate: { $lt: currentDate }
            });

            if (expiredMembers.length === 0) {
                return {
                    success: true,
                    message: 'No expired memberships found',
                    count: 0
                };
            }

            // Cập nhật trạng thái thành viên thành false
            const updatePromises = expiredMembers.map(user => {
                user.isMember = false;
                return user.save();
            });

            await Promise.all(updatePromises);

            return {
                success: true,
                message: 'Membership status updated successfully',
                count: expiredMembers.length
            };
        } catch (error) {
            throw new Error(`Failed to update membership status: ${error.message}`);
        }
    },

    async checkMembershipStatus(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Kiểm tra nếu user là member nhưng đã hết hạn
            if (user.isMember && user.membershipExpirationDate) {
                const currentDate = new Date();
                if (user.membershipExpirationDate < currentDate) {
                    // Cập nhật trạng thái thành viên thành false
                    user.isMember = false;
                    await user.save();
                }
            }

            return {
                success: true,
                data: {
                    isMember: user.isMember,
                    membershipExpirationDate: user.membershipExpirationDate
                }
            };
        } catch (error) {
            throw new Error(`Failed to check membership status: ${error.message}`);
        }
    }
};

module.exports = userService;
