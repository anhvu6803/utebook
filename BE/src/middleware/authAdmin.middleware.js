const jwt = require('jsonwebtoken');

const authAdminMiddleware = async (req, res, next) => {
    try {
        // Lấy access token từ cookie
        const accessToken = req.cookies.access_token;
        
        if (!accessToken) {
            return res.status(401).json({ message: 'Không tìm thấy access token' });
        }

        try {
            // Verify access token
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
            
            // Kiểm tra quyền admin
            if (!decoded.isAdmin) {
                return res.status(403).json({ message: 'Không có quyền truy cập' });
            }

            // Lưu thông tin user vào request
            req.userId = decoded.userId;
            req.userEmail = decoded.email;
            req.isAdmin = decoded.isAdmin;
            
            return next();
        } catch (error) {
            // Nếu access token hết hạn, thử refresh
            if (error.name === 'TokenExpiredError') {
                try {
                    // Decode access token để lấy thông tin
                    const decoded = jwt.decode(accessToken);
                    
                    // Kiểm tra quyền admin
                    if (!decoded.isAdmin) {
                        return res.status(403).json({ message: 'Không có quyền truy cập' });
                    }

                    // Lưu thông tin user vào request
                    req.userId = decoded.userId;
                    req.userEmail = decoded.email;
                    req.isAdmin = decoded.isAdmin;
                    
                    return next();
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

module.exports = authAdminMiddleware; 