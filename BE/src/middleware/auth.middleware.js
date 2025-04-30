const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Auth = require('../models/auth.model');

const authMiddleware = async (req, res, next) => {
    try {
        // Kiểm tra token trong cookie
        let token = req.cookies.access_token;
        
        // Nếu không có token trong cookie, kiểm tra trong header
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }

        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Unauthorized' 
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(401).json({ 
                    success: false,
                    message: 'User not found' 
                });
            }

            // Lưu thông tin user vào request
            req.userId = user._id;
            req.user = user;
            
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                try {
                    // Decode access token để lấy userId
                    const decoded = jwt.decode(token);
                    const userId = decoded.userId;

                    // Lấy refresh token từ database của user đó
                    const auth = await Auth.findOne({ userId });
                    
                    if (!auth) {
                        return res.status(401).json({ 
                            success: false,
                            message: 'No refresh token found' 
                        });
                    }

                    // Verify refresh token
                    const refreshDecoded = jwt.verify(auth.refreshToken, process.env.JWT_REFRESH_SECRET);

                    // Tạo access token mới
                    const newAccessToken = jwt.sign(
                        { 
                            userId,
                            email: refreshDecoded.email,
                            isAdmin: refreshDecoded.isAdmin
                        },
                        process.env.JWT_SECRET,
                        { expiresIn: '2m' }
                    );

                    // Set cookie mới
                    res.cookie('access_token', newAccessToken, {
                        httpOnly: true,
                        secure: false,
                        sameSite: 'lax',
                        maxAge: 24 * 60 * 60 * 1000,
                        path: '/'
                    });

                    // Lấy thông tin user mới
                    const user = await User.findById(userId);
                    if (!user) {
                        return res.status(401).json({ 
                            success: false,
                            message: 'User not found' 
                        });
                    }

                    // Lưu thông tin user vào request
                    req.userId = user._id;
                    req.user = user;
                    
                    next();
                } catch (refreshError) {
                    // Nếu refresh token cũng hết hạn, xóa khỏi database
                    if (refreshError.name === 'TokenExpiredError') {
                        await Auth.deleteOne({ userId: decoded.userId });
                    }
                    return res.status(401).json({ 
                        success: false,
                        message: 'Invalid refresh token' 
                    });
                }
            }
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token' 
            });
        }
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
};

const adminMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            if (!decoded.isAdmin) {
                return res.status(403).json({ message: 'Forbidden - Admin access required' });
            }

            // Lưu thông tin user vào request
            req.userId = decoded.userId;
            req.user = decoded;
            
            next();
        } catch (error) {
            // Nếu token hết hạn, thử refresh
            if (error.name === 'TokenExpiredError') {
                try {
                    // Decode access token để lấy userId
                    const decoded = jwt.decode(token);
                    const userId = decoded.userId;

                    // Lấy refresh token từ database của user đó
                    const auth = await Auth.findOne({ userId });
                    
                    if (!auth) {
                        return res.status(401).json({ message: 'No refresh token found' });
                    }

                    // Verify refresh token
                    const refreshDecoded = jwt.verify(auth.refreshToken, process.env.JWT_REFRESH_SECRET);

                    // Kiểm tra lại quyền admin
                    if (!refreshDecoded.isAdmin) {
                        return res.status(403).json({ message: 'Forbidden - Admin access required' });
                    }

                    // Tạo access token mới
                    const newAccessToken = jwt.sign(
                        { 
                            userId,
                            email: refreshDecoded.email,
                            isAdmin: refreshDecoded.isAdmin
                        },
                        process.env.JWT_SECRET,
                        { expiresIn: '2m' }
                    );

                    // Set cookie mới
                    res.cookie('access_token', newAccessToken, {
                        httpOnly: true,
                        secure: false,
                        sameSite: 'lax',
                        maxAge: 24 * 60 * 60 * 1000,
                        path: '/'
                    });

                    // Lưu thông tin user vào request
                    req.userId = userId;
                    req.user = refreshDecoded;
                    
                    next();
                } catch (refreshError) {
                    // Nếu refresh token cũng hết hạn, xóa khỏi database
                    if (refreshError.name === 'TokenExpiredError') {
                        await Auth.deleteOne({ userId: decoded.userId });
                    }
                    return res.status(401).json({ message: 'Invalid refresh token' });
                }
            }
            return res.status(401).json({ message: 'Invalid token' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    authMiddleware,
    adminMiddleware
}; 