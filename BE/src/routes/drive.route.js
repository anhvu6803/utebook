const express = require('express');
const router = express.Router();
const multer = require('multer');
const DriveController = require('../controllers/drive.controller');
const { checkAllowedEmail } = require('../middleware/authEmail.middleware');

// Cấu hình multer
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
    }
});

// Middleware xử lý lỗi multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File quá lớn. Giới hạn là 100MB'
            });
        }
    }
    next(err);
};

// Routes
router.post('/upload', 
    checkAllowedEmail,
    upload.single('file'), 
    handleMulterError,
    DriveController.uploadFile
);

router.post('/files/:fileId/share', 
    checkAllowedEmail,
    DriveController.shareFile
);

router.delete('/files/:fileId/access', 
    checkAllowedEmail,
    DriveController.removeAccess
);

router.get('/files', 
    checkAllowedEmail,
    DriveController.listFiles
);

router.put('/files/:fileId/permissions',
    checkAllowedEmail,
    DriveController.updateFilePermissions
);

module.exports = router; 