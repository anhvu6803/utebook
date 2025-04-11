const userService = require('../services/user.service');

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

    async updateUser(req, res) {
        try {
            const { userId } = req.params;
            const updateData = {
                fullname: req.body.fullname,
                ngaySinh: req.body.ngaySinh,
                gioiTinh: req.body.gioiTinh,
                avatar: req.body.avatar,
                numberPhone: req.body.numberPhone,
                isPhoneVerified: req.body.isPhoneVerified
            };

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }

            const result = await userService.updateUser(userId, updateData);
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
