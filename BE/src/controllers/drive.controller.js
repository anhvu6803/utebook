const DriveService = require('../services/drive.service');

class DriveController {
    static async uploadFile(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Không có file nào được upload' 
                });
            }

            // Lấy danh sách email được phép từ request body
            const allowedEmails = req.body.allowedEmails 
                ? Array.isArray(req.body.allowedEmails) 
                    ? req.body.allowedEmails 
                    : [req.body.allowedEmails]
                : [];

            const result = await DriveService.uploadFile(req.file, req.user, allowedEmails);
            
            res.status(200).json({
                success: true,
                message: 'Upload file thành công',
                file: {
                    id: result.id,
                    name: result.name,
                    mimeType: result.mimeType,
                    size: result.size,
                    viewLink: result.webViewLink,
                    downloadLink: result.webContentLink,
                    uploadInfo: {
                        uploadedBy: result.properties.uploadedBy,
                        uploadedAt: result.properties.uploadedAt,
                        userName: result.properties.userName
                    },
                    allowedEmails: result.allowedEmails
                }
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: error.message 
            });
        }
    }

    static async deleteFile(req, res) {
        try {
            const { fileId } = req.params;
            await DriveService.deleteFile(fileId);
            
            res.status(200).json({
                success: true,
                message: 'Xóa file thành công'
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: 'Lỗi khi xóa file',
                error: error.message 
            });
        }
    }

    static async getFileInfo(req, res) {
        try {
            const { fileId } = req.params;
            const fileInfo = await DriveService.getFileInfo(fileId, req.userEmail);
            
            res.status(200).json({
                success: true,
                file: fileInfo
            });
        } catch (error) {
            res.status(status = error.message.includes('không có quyền') ? 403 : 500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async listUserFiles(req, res) {
        try {
            const files = await DriveService.listUserFiles(req.userEmail);
            
            res.status(200).json({
                success: true,
                files: files
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async shareFile(req, res) {
        try {
            const { fileId } = req.params;
            const { emails } = req.body;

            const result = await DriveService.shareFile(fileId, req.userEmail, emails);
            
            res.status(200).json({
                success: true,
                message: 'Chia sẻ file thành công',
                accessInfo: result
            });
        } catch (error) {
            res.status(403).json({
                success: false,
                message: error.message
            });
        }
    }

    static async removeAccess(req, res) {
        try {
            const { fileId, email } = req.params;

            const result = await DriveService.removeFileAccess(fileId, req.userEmail, email);
            
            res.status(200).json({
                success: true,
                message: 'Đã xóa quyền truy cập',
                accessInfo: result
            });
        } catch (error) {
            res.status(403).json({
                success: false,
                message: error.message
            });
        }
    }

    static async listFiles(req, res) {
        try {
            const files = await DriveService.listUserAccessibleFiles(req.userEmail);
            
            res.status(200).json({
                success: true,
                files: files
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async updateFilePermissions(req, res) {
        try {
            const { fileId } = req.params;
            const { allowedEmails } = req.body;

            if (!Array.isArray(allowedEmails)) {
                return res.status(400).json({
                    success: false,
                    message: 'allowedEmails phải là một mảng email'
                });
            }

            const result = await DriveService.updateFilePermissions(fileId, req.user, allowedEmails);

            res.status(200).json({
                success: true,
                message: 'Cập nhật quyền truy cập thành công',
                allowedEmails: result
            });
        } catch (error) {
            res.status(error.message.includes('không có quyền') ? 403 : 500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = DriveController; 