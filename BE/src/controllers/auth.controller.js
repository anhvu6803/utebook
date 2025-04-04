const authService = require('../services/auth.service');
class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    message: 'Vui lòng nhập email và mật khẩu'
                });
            }
            const result = await authService.login(email, password);
            res.cookie('access_token', result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 2 * 60 * 1000 
            });
            res.json({
                user: result.user
            });
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }
    async googleLogin(req, res) {
        try {
            const { email, name, picture, googleId } = req.body;

            if (!email || !googleId) {
                return res.status(400).json({
                    message: 'Thiếu thông tin đăng nhập Google'
                });
            }

            const result = await authService.googleLogin(email, name, picture, googleId);
            res.cookie('access_token', result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 2 * 60 * 1000 
            });
            res.json({
                user: result.user
            });
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }
    async logout(req, res) {
        try {
            await authService.logout(req.userId);
            res.clearCookie('access_token');
            res.json({ message: 'Đăng xuất thành công' });
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }
    async refreshToken(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const result = await authService.refreshToken(userId);
            res.cookie('access_token', result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 2 * 60 * 1000 /
            });

            res.json({ message: 'Token refreshed successfully' });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
    async register(req, res) {
        try {
            const { email, password, name } = req.body;
            if (!email || !password || !name) {
                return res.status(400).json({
                    message: 'Vui lòng nhập đầy đủ thông tin'
                });
            }
            const result = await authService.register(email, password, name);
            res.status(201).json({
                message: 'Đăng ký thành công',
                user: result.user
            });
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({
                    message: 'Vui lòng nhập email'
                });
            }
            await authService.forgotPassword(email);
            res.json({
                message: 'Vui lòng kiểm tra email để đặt lại mật khẩu'
            });
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }
    async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;
            if (!token || !newPassword) {
                return res.status(400).json({
                    message: 'Thiếu thông tin cần thiết'
                });
            }
            await authService.resetPassword(token, newPassword);
            res.json({
                message: 'Đặt lại mật khẩu thành công'
            });
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }

    async getMe(req, res) {
        try {
            const userId = req.userId;
            const user = await authService.getUserById(userId);
            res.json({ user });
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }
}

module.exports = new AuthController();
