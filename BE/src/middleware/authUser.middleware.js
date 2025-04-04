const jwt = require('jsonwebtoken');
const Auth = require('../models/auth.model');

const authUserMiddleware = async (req, res, next) => {
    try {
        // Lấy access token từ cookie
        const accessToken = req.cookies.access_token;
        
        if (!accessToken) {
            return res.status(401).json({ message: 'Không tìm thấy access token' });
        }

        try {
            // Verify access token
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
            req.userId = decoded.userId;
            return next();
        } catch (error) {
            // Nếu access token hết hạn, thử refresh
            if (error.name === 'TokenExpiredError') {
                try {
                    // Decode access token để lấy userId
                    const decoded = jwt.decode(accessToken);
                    const userId = decoded.userId;

                    // Lấy refresh token từ database của user đó
                    const auth = await Auth.findOne({ userId });
                    
                    if (!auth) {
                        return res.status(401).json({ message: 'Không tìm thấy refresh token' });
                    }

                    try {
                        // Verify refresh token
                        const decoded = jwt.verify(auth.refreshToken, process.env.JWT_REFRESH_SECRET);

                        // Tạo access token mới
                        const newAccessToken = jwt.sign(
                            { userId },
                            process.env.JWT_SECRET,
                            { expiresIn: '2m' }
                        );

                        // Set cookie mới
                        res.cookie('access_token', newAccessToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            maxAge: 2 * 60 * 1000 // 15 phút
                        });

                        req.userId = userId;
                        return next();
                    } catch (error) {
                        // Nếu refresh token cũng hết hạn, xóa khỏi database
                        if (error.name === 'TokenExpiredError') {
                            await Auth.deleteOne({ userId });
                        }
                        return res.status(401).json({ message: 'Refresh token không hợp lệ' });
                    }
                } catch (error) {
                    return res.status(401).json({ message: 'Token không hợp lệ' });
                }
            }
            return res.status(401).json({ message: 'Token không hợp lệ' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi xác thực' });
    }
};

module.exports = authUserMiddleware; 