const authService = require('../services/auth.service');
const jwt = require('jsonwebtoken');

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
                maxAge: 24* 60  * 60 * 1000
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
                maxAge: 24* 60  * 60 * 1000
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
            const accessToken = req.cookies.access_token;
            if (!accessToken) {
                return res.status(401).json({ message: 'No access token found' });
            }

            // Decode the access token to get userId
            const decoded = jwt.decode(accessToken);
            if (!decoded || !decoded.userId) {
                return res.status(401).json({ message: 'Invalid access token' });
            }

            const result = await authService.refreshToken(decoded.userId);
            
            // Set new access token in cookie
            res.cookie('access_token', result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24* 60  * 60 * 1000
            });

            // Return user data along with the response
            res.json({
                user: result.user,
                message: 'Token refreshed successfully'
            });
        } catch (error) {
            console.error('Refresh token error:', error);
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
            // Lấy access token từ cookie
            const accessToken = req.cookies.access_token;
            if (!accessToken) {
                return res.status(401).json({ message: 'No access token found' });
            }

            try {
                const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
                const user = await authService.getMe(decoded.userId);
                
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                const { password, ...userWithoutPassword } = user.toObject();
                res.json(userWithoutPassword);
            } catch (error) {
                // Nếu token hết hạn, thử refresh token
                if (error.name === 'TokenExpiredError') {
                    // Lấy userId từ token đã hết hạn
                    const decoded = jwt.decode(accessToken);
                    if (!decoded || !decoded.userId) {
                        return res.status(401).json({ message: 'Invalid token' });
                    }

                    // Thử refresh token
                    const result = await authService.refreshToken(decoded.userId);
                    
                    // Set new access token in cookie
                    res.cookie('access_token', result.accessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 24* 60  * 60 * 1000// 2 phút
                    });

                    // Trả về thông tin user mới
                    res.json(result.user);
                } else {
                    throw error;
                }
            }
        } catch (error) {
            console.error('Get me error:', error);
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token' });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new AuthController();
