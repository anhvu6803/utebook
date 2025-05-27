const userService = require('../services/user.service');
const User = require('../models/user.model');
const Point = require('../models/point.model');
const bcrypt = require('bcryptjs');

const userController = {
     async sendVerificationCode(req, res) {
        try {
            const { email } = req.body;
            const result = await userService.sendVerificationCode(email);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

     async register(req, res) {
        try {
            const { userData, code } = req.body;
            const user = await userService.register(userData, code);

            // Tạo điểm mới cho user
            const newPoint = new Point({
                id_user: user._id,
                quantity_HoaPhuong: 0,
                quantity_La: 0
            });
            await newPoint.save();

            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: user._id,
                    email: user.email,
                    username: user.username
                }
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

     async verifyEmail(req, res) {
        try {
            const { email, code } = req.body;
            const result = await userService.verifyEmail(email, code);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    
    async requestPasswordReset(req, res) {
        try {
            const { email } = req.body;
            const result = await userService.requestPasswordReset(email);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

 
    async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;
            
            if (!token || !newPassword) {
                return res.status(400).json({ 
                    error: 'Token and new password are required' 
                });
            }

            const result = await userService.resetPassword(token, newPassword);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Lấy danh sách tất cả users
    async getAllUsers(req, res) {
        try {
            const users = await User.find().select('-password');
            
            // Lấy thông tin điểm cho mỗi user
            const usersWithPoints = await Promise.all(users.map(async (user) => {
                const point = await Point.findOne({ id_user: user._id });
                return {
                    ...user.toObject(),
                    points: point ? {
                        hoaPhuong: point.quantity_HoaPhuong,
                        la: point.quantity_La
                    } : {
                        hoaPhuong: 0,
                        la: 0
                    }
                };
            }));

            res.status(200).json({
                success: true,
                data: usersWithPoints
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Lấy thông tin một user theo ID
    async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.id).select('-password');
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Lấy thông tin điểm của user
            const point = await Point.findOne({ id_user: user._id });
            const userWithPoints = {
                ...user.toObject(),
                points: point ? {
                    hoaPhuong: point.quantity_HoaPhuong,
                    la: point.quantity_La
                } : {
                    hoaPhuong: 0,
                    la: 0
                }
            };

            res.status(200).json({
                success: true,
                data: userWithPoints
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Cập nhật thông tin user
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            // Nếu có cập nhật mật khẩu, hash mật khẩu mới
            if (updateData.password) {
                updateData.password = await bcrypt.hash(updateData.password, 10);
            }

            const user = await User.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Cập nhật điểm nếu có
            if (updateData.points) {
                await Point.findOneAndUpdate(
                    { id_user: user._id },
                    { 
                        quantity_HoaPhuong: updateData.points.hoaPhuong,
                        quantity_La: updateData.points.la
                    },
                    { new: true }
                );
            }

            // Lấy thông tin điểm của user
            const point = await Point.findOne({ id_user: user._id });
            const userWithPoints = {
                ...user.toObject(),
                points: point ? {
                    hoaPhuong: point.quantity_HoaPhuong,
                    la: point.quantity_La
                } : {
                    hoaPhuong: 0,
                    la: 0
                }
            };

            res.status(200).json({
                success: true,
                data: userWithPoints
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Xóa user
    async deleteUser(req, res) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Xóa thông tin điểm của user
            await Point.deleteOne({ id_user: user._id });

            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Kiểm tra và cập nhật trạng thái hết hạn của tất cả thành viên
    async checkAndUpdateAllMemberships(req, res) {
        try {
            const result = await userService.checkAndUpdateMembershipStatus();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Kiểm tra trạng thái thành viên của một user
    async checkMembershipStatus(req, res) {
        try {
            const { id } = req.params;
            const result = await userService.checkMembershipStatus(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = userController;
