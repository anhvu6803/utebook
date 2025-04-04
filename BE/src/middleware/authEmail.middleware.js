const User = require('../models/user.model');

// Danh sách email có quyền truy cập
const ALLOWED_EMAILS = [
    'nguyentrandcm@gmail.com', // Email chính
    'wasabi@gmail.com',      // Email chính
    'admin@gmail.com',       // Admin
    'test@gmail.com'         // Test user
];

const checkAllowedEmail = async (req, res, next) => {
    try {
        const userEmail = req.headers['x-user-email'];

        if (!userEmail) {
            return res.status(401).json({
                success: false,
                message: 'Email không được cung cấp'
            });
        }

        if (!ALLOWED_EMAILS.includes(userEmail.toLowerCase())) {
            if (req.method === 'POST' && req.path.includes('/upload')) {
                const user = await User.findOne({ email: userEmail.toLowerCase() });
                if (user) {
                    req.user = user;
                    req.userEmail = userEmail.toLowerCase();
                    return next();
                }
            }
            
            return res.status(403).json({
                success: false,
                message: 'Email không có quyền truy cập'
            });
        }

        // Kiểm tra email có tồn tại trong UserModel không
        const user = await User.findOne({ email: userEmail.toLowerCase() });
        if (!user) {
            return res.status(403).json({
                success: false,
                message: 'Email không tồn tại trong hệ thống'
            });
        }

        req.user = user;
        req.userEmail = userEmail.toLowerCase();
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi kiểm tra quyền: ' + error.message
        });
    }
};

module.exports = {
    checkAllowedEmail,
    ALLOWED_EMAILS  // Export để có thể sử dụng ở nơi khác nếu cần
}; 