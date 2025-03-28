const { drive } = require('../config/googleDrive.config');
const stream = require('stream');
const FileAccess = require('../models/fileAccess.model');
const { ALLOWED_EMAILS } = require('../middleware/auth.middleware');

class DriveService {
    static async uploadFile(fileObject, user, allowedEmails = []) {
        try {
            const bufferStream = new stream.PassThrough();
            bufferStream.end(fileObject.buffer);

            // Thêm email người upload vào danh sách được phép
            const uniqueEmails = [...new Set([user.email, ...allowedEmails])];

            // Tạo file trong Google Drive
            const { data } = await drive.files.create({
                media: {
                    mimeType: fileObject.mimetype,
                    body: bufferStream,
                },
                requestBody: {
                    name: fileObject.originalname,
                    parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
                    properties: {
                        uploadedBy: user.email,
                        uploadedAt: new Date().toISOString(),
                        userId: user._id.toString(),
                        userName: user.name || 'Unknown'
                    }
                },
                fields: 'id,name,webViewLink,webContentLink,mimeType,size,properties',
            });

            // Xóa tất cả quyền ngoại trừ owner
            const permissions = await drive.permissions.list({
                fileId: data.id,
                fields: 'permissions(id,emailAddress,role)'
            });

            if (permissions.data.permissions) {
                for (const permission of permissions.data.permissions) {
                    if (permission.role !== 'owner') {
                        try {
                            await drive.permissions.delete({
                                fileId: data.id,
                                permissionId: permission.id
                            });
                        } catch (error) {
                            console.log('Không thể xóa quyền:', error.message);
                        }
                    }
                }
            }

            // Cấp quyền cho tất cả email (bao gồm cả người upload)
            const permissionPromises = uniqueEmails.map(email => 
                drive.permissions.create({
                    fileId: data.id,
                    requestBody: {
                        type: 'user',
                        role: 'writer',
                        emailAddress: email
                    },
                    sendNotificationEmail: false
                }).catch(error => {
                    console.log(`Không thể cấp quyền cho ${email}:`, error.message);
                })
            );

            await Promise.all(permissionPromises);

            // Lấy thông tin file sau khi cập nhật quyền
            const updatedFile = await drive.files.get({
                fileId: data.id,
                fields: 'id,name,webViewLink,webContentLink,mimeType,size,properties'
            });

            return {
                ...updatedFile.data,
                allowedEmails: uniqueEmails
            };
        } catch (error) {
            console.error('Upload error:', error);
            throw new Error('Lỗi khi upload file: ' + error.message);
        }
    }

    static async updateFilePermissions(fileId, user, newAllowedEmails = []) {
        try {
            // Kiểm tra quyền sở hữu file
            const file = await drive.files.get({
                fileId: fileId,
                fields: 'properties'
            });

            if (file.data.properties.uploadedBy !== user.email) {
                throw new Error('Bạn không có quyền cập nhật quyền truy cập file này');
            }

            // Thêm email người upload vào danh sách mới
            const uniqueEmails = [...new Set([user.email, ...newAllowedEmails])];

            // Xóa tất cả quyền ngoại trừ owner
            const permissions = await drive.permissions.list({
                fileId: fileId,
                fields: 'permissions(id,emailAddress,role)'
            });

            if (permissions.data.permissions) {
                for (const permission of permissions.data.permissions) {
                    if (permission.role !== 'owner') {
                        try {
                            await drive.permissions.delete({
                                fileId: fileId,
                                permissionId: permission.id
                            });
                        } catch (error) {
                            console.log('Không thể xóa quyền:', error.message);
                        }
                    }
                }
            }

            // Cấp quyền cho danh sách email mới (bao gồm cả người upload)
            const permissionPromises = uniqueEmails.map(email => 
                drive.permissions.create({
                    fileId: fileId,
                    requestBody: {
                        type: 'user',
                        role: 'writer',
                        emailAddress: email
                    },
                    sendNotificationEmail: false
                }).catch(error => {
                    console.log(`Không thể cấp quyền cho ${email}:`, error.message);
                })
            );

            await Promise.all(permissionPromises);

            return uniqueEmails;
        } catch (error) {
            throw new Error('Lỗi khi cập nhật quyền truy cập: ' + error.message);
        }
    }

    static async checkFileAccess(fileId, userEmail) {
        const fileAccess = await FileAccess.findOne({ fileId });
        if (!fileAccess) return false;
        
        return fileAccess.uploadedBy === userEmail || 
               fileAccess.allowedEmails.includes(userEmail);
    }

    static async getFileInfo(fileId, userEmail) {
        try {
            // Kiểm tra quyền truy cập
            if (!ALLOWED_EMAILS.includes(userEmail)) {
                throw new Error('Bạn không có quyền truy cập file này');
            }

            const { data } = await drive.files.get({
                fileId: fileId,
                fields: 'id,name,webViewLink,webContentLink,mimeType,size,properties'
            });

            return {
                ...data,
                accessInfo: {
                    allowedEmails: ALLOWED_EMAILS
                }
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async shareFile(fileId, userEmail, emailsToShare) {
        try {
            const fileAccess = await FileAccess.findOne({ fileId });
            if (!fileAccess) {
                throw new Error('File không tồn tại');
            }

            // Chỉ người upload mới có quyền chia sẻ
            if (fileAccess.uploadedBy !== userEmail) {
                throw new Error('Bạn không có quyền chia sẻ file này');
            }

            // Thêm emails mới vào danh sách được phép
            const newEmails = Array.isArray(emailsToShare) ? emailsToShare : [emailsToShare];
            const uniqueEmails = [...new Set([...fileAccess.allowedEmails, ...newEmails])];

            // Cập nhật danh sách email được phép
            fileAccess.allowedEmails = uniqueEmails;
            await fileAccess.save();

            return fileAccess;
        } catch (error) {
            throw new Error('Lỗi khi chia sẻ file: ' + error.message);
        }
    }

    static async removeFileAccess(fileId, userEmail, emailToRemove) {
        try {
            const fileAccess = await FileAccess.findOne({ fileId });
            if (!fileAccess) {
                throw new Error('File không tồn tại');
            }

            // Chỉ người upload mới có quyền xóa quyền truy cập
            if (fileAccess.uploadedBy !== userEmail) {
                throw new Error('Bạn không có quyền thay đổi quyền truy cập file này');
            }

            // Không thể xóa quyền của người upload
            if (emailToRemove === fileAccess.uploadedBy) {
                throw new Error('Không thể xóa quyền của người upload');
            }

            // Xóa email khỏi danh sách
            fileAccess.allowedEmails = fileAccess.allowedEmails.filter(
                email => email !== emailToRemove
            );
            await fileAccess.save();

            return fileAccess;
        } catch (error) {
            throw new Error('Lỗi khi xóa quyền truy cập: ' + error.message);
        }
    }

    static async listUserFiles(userEmail) {
        try {
            // Kiểm tra quyền truy cập
            if (!ALLOWED_EMAILS.includes(userEmail)) {
                throw new Error('Bạn không có quyền xem danh sách file');
            }

            const { data } = await drive.files.list({
                q: `'${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents and trashed = false`,
                fields: 'files(id,name,webViewLink,webContentLink,mimeType,size,properties)',
                orderBy: 'createdTime desc'
            });

            return data.files.map(file => ({
                ...file,
                accessInfo: {
                    allowedEmails: ALLOWED_EMAILS,
                    isOwner: file.properties?.uploadedBy === userEmail
                }
            }));
        } catch (error) {
            throw new Error('Lỗi khi lấy danh sách file: ' + error.message);
        }
    }
}

module.exports = DriveService; 