const { drive } = require('../configs/googleDrive.config');
const stream = require('stream');
const FileAccess = require('../models/fileAccess.model');
const { ALLOWED_EMAILS } = require('../middleware/authEmail.middleware');

class DriveService {
    static async uploadFile(fileObject, user, allowedEmails = []) {
        try {
            const bufferStream = new stream.PassThrough();
            bufferStream.end(fileObject.buffer);

            // Thêm email người upload và admin vào danh sách được phép
            const uniqueEmails = [...new Set([user.email, 'nguyentrandcm@gmail.com', ...allowedEmails])];

            // Kiểm tra và tạo folder nếu chưa tồn tại
            let folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
            if (!folderId) {
                // Tạo folder mới nếu chưa có folder ID
                const folderMetadata = {
                    name: 'UTEBook Files',
                    mimeType: 'application/vnd.google-apps.folder',
                    properties: {
                        createdBy: 'UTEBook System',
                        createdAt: new Date().toISOString()
                    }
                };

                const folder = await drive.files.create({
                    resource: folderMetadata,
                    fields: 'id'
                });

                folderId = folder.data.id;
                process.env.GOOGLE_DRIVE_FOLDER_ID = folderId;
            }

            // Tạo file trong Google Drive với folder ID đã xác định
            const { data } = await drive.files.create({
                media: {
                    mimeType: fileObject.mimetype,
                    body: bufferStream,
                },
                requestBody: {
                    name: fileObject.originalname,
                    parents: [folderId],
                    properties: {
                        uploadedBy: user.email,
                        uploadedAt: new Date().toISOString(),
                        userId: user._id.toString(),
                        userName: user.name || 'Unknown'
                    }
                },
                fields: 'id,name,webViewLink,webContentLink,mimeType,size,properties,parents',
            });

            // Kiểm tra xem file có được lưu trong folder không
            if (!data.parents || !data.parents.includes(folderId)) {
                // Thử di chuyển file vào folder nếu chưa được lưu đúng
                try {
                    await drive.files.update({
                        fileId: data.id,
                        addParents: folderId,
                        fields: 'id,parents'
                    });
                } catch (error) {
                    console.error('Lỗi khi di chuyển file vào folder:', error);
                    throw new Error('Không thể lưu file vào folder');
                }
            }

            // Lưu thông tin file vào database
            const fileAccess = new FileAccess({
                fileId: data.id,
                fileName: fileObject.originalname,
                mimeType: fileObject.mimetype,
                size: fileObject.size,
                uploadedBy: user.email,
                uploadedAt: new Date(),
                allowedEmails: uniqueEmails,
                webViewLink: data.webViewLink,
                webContentLink: data.webContentLink
            });
            await fileAccess.save();

            await drive.files.update({
                fileId: data.id,
                requestBody: {
                    viewersCanCopyContent: false,
                    copyRequiresWriterPermission: true,
                    viewersCanPrint: false,
                    viewersCanDownload: false,
                    viewersCanShare: false,
                    viewersCanComment: false,
                    viewersCanRequestAccess: false,
                    viewersCanModify: false,
                    viewersCanMoveItemWithinDrive: false,
                    viewersCanDelete: false,
                    viewersCanRename: false,
                    viewersCanTrash: false,
                    viewersCanView: true,
                    viewersCanPreview: true,
                    viewersCanViewOnline: true
                },
            });
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

            // Cấp quyền viewer cho tất cả email được phép
            const permissionPromises = uniqueEmails.map(email => {
                return drive.permissions.create({
                    fileId: data.id,
                    requestBody: {
                        type: 'user',
                        role: 'reader',
                        emailAddress: email
                    },
                    sendNotificationEmail: false
                }).catch(error => {
                    console.log(`Không thể cấp quyền cho ${email}:`, error.message);
                });
            });

            await Promise.all(permissionPromises);

            // Lấy thông tin file sau khi cập nhật quyền
            const updatedFile = await drive.files.get({
                fileId: data.id,
                fields: 'id,name,webViewLink,webContentLink,mimeType,size,properties'
            });

            // Cập nhật lại webViewLink và webContentLink trong database
            fileAccess.webViewLink = updatedFile.data.webViewLink;
            fileAccess.webContentLink = updatedFile.data.webContentLink;
            await fileAccess.save();

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
            // Kiểm tra file có tồn tại trong Google Drive không
            try {
                await drive.files.get({
                    fileId: fileId,
                    fields: 'id'
                });
            } catch (error) {
                throw new Error('File không tồn tại trong Google Drive');
            }

            // Kiểm tra quyền sở hữu file
            const file = await drive.files.get({
                fileId: fileId,
                fields: 'properties'
            });

            if (file.data.properties.uploadedBy !== user.email) {
                throw new Error('Bạn không có quyền cập nhật quyền truy cập file này');
            }

            // Lấy thông tin file từ database
            const fileAccess = await FileAccess.findOne({ fileId });
            if (!fileAccess) {
                throw new Error('File không tồn tại trong database');
            }

            // Thêm email người upload và admin vào danh sách mới
            const currentEmails = fileAccess.allowedEmails || [];
            const newEmails = Array.isArray(newAllowedEmails) ? newAllowedEmails : [newAllowedEmails];
            const uniqueEmails = [...new Set([...currentEmails, 'nguyentrandcm@gmail.com', ...newEmails])];

            // Cập nhật cài đặt file để ngăn tất cả quyền truy cập ngoại trừ xem
            await drive.files.update({
                fileId: fileId,
                requestBody: {
                    viewersCanCopyContent: false,
                    copyRequiresWriterPermission: true,
                    viewersCanPrint: false,
                    viewersCanDownload: false,
                    viewersCanShare: false,
                    viewersCanComment: false,
                    viewersCanRequestAccess: false,
                    viewersCanModify: false,
                    viewersCanMoveItemWithinDrive: false,
                    viewersCanDelete: false,
                    viewersCanRename: false,
                    viewersCanTrash: false,
                    viewersCanView: true,
                    viewersCanPreview: true,
                    viewersCanViewOnline: true
                },
            });

            // Xóa tất cả quyền hiện tại
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

            // Cấp quyền viewer cho tất cả email
            const permissionPromises = uniqueEmails.map(email => {
                return drive.permissions.create({
                    fileId: fileId,
                    requestBody: {
                        type: 'user',
                        role: 'reader',
                        emailAddress: email
                    },
                    sendNotificationEmail: false
                }).catch(error => {
                    console.log(`Không thể cấp quyền cho ${email}:`, error.message);
                });
            });

            await Promise.all(permissionPromises);

            // Cập nhật lại thông tin trong database
            fileAccess.allowedEmails = uniqueEmails;
            await fileAccess.save();

            return {
                success: true,
                message: 'Cập nhật quyền truy cập thành công',
                allowedEmails: uniqueEmails
            };
        } catch (error) {
            throw new Error('Lỗi khi cập nhật quyền truy cập: ' + error.message);
        }
    }
    

    static async checkFileAccess(fileId, userEmail) {
        const fileAccess = await FileAccess.findOne({ fileId });
        if (!fileAccess) return false;
        
        // Chỉ cho phép truy cập nếu email nằm trong danh sách allowedEmails
        return fileAccess.allowedEmails.includes(userEmail);
    }

    static async getFileInfo(fileId, userEmail) {
        try {
            // Kiểm tra quyền truy cập từ database
            const fileAccess = await FileAccess.findOne({ fileId });
            if (!fileAccess) {
                throw new Error('File không tồn tại');
            }

            // Chỉ cho phép truy cập nếu email nằm trong danh sách allowedEmails
            if (!fileAccess.allowedEmails.includes(userEmail)) {
                throw new Error('Bạn không có quyền truy cập file này');
            }

            // Kiểm tra quyền truy cập từ Google Drive
            const permissions = await drive.permissions.list({
                fileId: fileId,
                fields: 'permissions(id,emailAddress,role)'
            });

            // Kiểm tra xem người dùng có quyền truy cập trong Google Drive không
            const hasDriveAccess = permissions.data.permissions.some(
                permission => permission.emailAddress === userEmail && permission.role === 'reader'
            );

            if (!hasDriveAccess) {
                // Nếu không có quyền trong Drive, cập nhật lại quyền
                try {
                    await drive.permissions.create({
                        fileId: fileId,
                        requestBody: {
                            type: 'user',
                            role: 'reader',
                            emailAddress: userEmail
                        },
                        sendNotificationEmail: false
                    });
                } catch (error) {
                    console.log(`Không thể cấp quyền cho ${userEmail}:`, error.message);
                    throw new Error('Không thể cấp quyền truy cập file');
                }
            }

            const { data } = await drive.files.get({
                fileId: fileId,
                fields: 'id,name,webViewLink,webContentLink,mimeType,size,properties'
            });

            // Cập nhật lại webViewLink và webContentLink trong database
            if (data.webViewLink !== fileAccess.webViewLink || data.webContentLink !== fileAccess.webContentLink) {
                fileAccess.webViewLink = data.webViewLink;
                fileAccess.webContentLink = data.webContentLink;
                await fileAccess.save();
            }

            return {
                ...data,
                accessInfo: {
                    allowedEmails: fileAccess.allowedEmails,
                    isOwner: fileAccess.uploadedBy === userEmail
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

            // Thêm emails mới và admin vào danh sách được phép
            const newEmails = Array.isArray(emailsToShare) ? emailsToShare : [emailsToShare];
            const uniqueEmails = [...new Set([...fileAccess.allowedEmails, 'nguyentrandcm@gmail.com', ...newEmails])];

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

            // Không thể xóa quyền của người upload và admin
            if (emailToRemove === fileAccess.uploadedBy || emailToRemove === 'nguyentrandcm@gmail.com') {
                throw new Error('Không thể xóa quyền của người upload hoặc admin');
            }

            // Xóa quyền truy cập trực tiếp từ Google Drive
            const permissions = await drive.permissions.list({
                fileId: fileId,
                fields: 'permissions(id,emailAddress,role)'
            });

            if (permissions.data.permissions) {
                for (const permission of permissions.data.permissions) {
                    if (permission.emailAddress === emailToRemove) {
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

            // Cập nhật cài đặt file để cho phép xem nhưng hạn chế các quyền khác
            await drive.files.update({
                fileId: fileId,
                requestBody: {
                    viewersCanCopyContent: false,
                    copyRequiresWriterPermission: true,
                    viewersCanPrint: false,
                    viewersCanDownload: false,
                    viewersCanShare: false,
                    viewersCanComment: false,
                    viewersCanRequestAccess: false,
                    viewersCanModify: false,
                    viewersCanMoveItemWithinDrive: false,
                    viewersCanDelete: false,
                    viewersCanRename: false,
                    viewersCanTrash: false,
                    viewersCanView: true,
                    viewersCanPreview: true,
                    viewersCanViewOnline: true
                },
            });

            // Cập nhật lại quyền truy cập cho tất cả email còn lại
            const remainingEmails = fileAccess.allowedEmails.filter(email => email !== emailToRemove);
            
            // Xóa tất cả quyền hiện tại ngoại trừ owner
            const currentPermissions = await drive.permissions.list({
                fileId: fileId,
                fields: 'permissions(id,emailAddress,role)'
            });

            if (currentPermissions.data.permissions) {
                for (const permission of currentPermissions.data.permissions) {
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

            // Cấp lại quyền cho các email còn lại
            const permissionPromises = remainingEmails.map(email => {
                return drive.permissions.create({
                    fileId: fileId,
                    requestBody: {
                        type: 'user',
                        role: 'reader',
                        emailAddress: email
                    },
                    sendNotificationEmail: false
                }).catch(error => {
                    console.log(`Không thể cấp quyền cho ${email}:`, error.message);
                });
            });

            await Promise.all(permissionPromises);

            // Xóa email khỏi danh sách trong database
            fileAccess.allowedEmails = remainingEmails;
            await fileAccess.save();

            return {
                success: true,
                message: 'Xóa quyền truy cập thành công',
                allowedEmails: remainingEmails
            };
        } catch (error) {
            throw new Error('Lỗi khi xóa quyền truy cập: ' + error.message);
        }
    }

    static async listUserFiles(userEmail) {
        try {
            // Lấy danh sách file từ database mà user có quyền truy cập
            const fileAccesses = await FileAccess.find({
                allowedEmails: userEmail
            });

            const fileIds = fileAccesses.map(fa => fa.fileId);

            if (fileIds.length === 0) {
                return [];
            }

            // Kiểm tra folder ID
            if (!process.env.GOOGLE_DRIVE_FOLDER_ID) {
                process.env.GOOGLE_DRIVE_FOLDER_ID = '1P8XuQ9eSWEsHXX8m_SgRABc8VtPpVUyy';
            }

            // Lấy danh sách file từ Google Drive
            const { data } = await drive.files.list({
                q: `'${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents and trashed = false and (${fileIds.map(id => `id = '${id}'`).join(' or ')})`,
                fields: 'files(id,name,webViewLink,webContentLink,mimeType,size,properties,parents)',
                orderBy: 'createdTime desc'
            });

            // Kiểm tra và cập nhật lại quyền truy cập cho các file
            const files = await Promise.all(data.files.map(async (file) => {
                const fileAccess = fileAccesses.find(fa => fa.fileId === file.id);
                
                // Kiểm tra xem file có trong folder đúng không
                if (!file.parents || !file.parents.includes(process.env.GOOGLE_DRIVE_FOLDER_ID)) {
                    try {
                        // Thử di chuyển file vào folder
                        await drive.files.update({
                            fileId: file.id,
                            addParents: process.env.GOOGLE_DRIVE_FOLDER_ID,
                            fields: 'id,parents'
                        });
                    } catch (error) {
                        console.error(`Lỗi khi di chuyển file ${file.id} vào folder:`, error);
                    }
                }

                // Kiểm tra và cập nhật lại quyền truy cập
                const permissions = await drive.permissions.list({
                    fileId: file.id,
                    fields: 'permissions(id,emailAddress,role)'
                });

                // Lấy danh sách email có quyền truy cập hiện tại
                const currentEmails = permissions.data.permissions
                    .filter(p => p.role === 'reader')
                    .map(p => p.emailAddress);

                // Kiểm tra xem có email nào trong allowedEmails chưa có quyền không
                const missingEmails = fileAccess.allowedEmails.filter(
                    email => !currentEmails.includes(email)
                );

                // Cấp quyền cho các email còn thiếu
                if (missingEmails.length > 0) {
                    const permissionPromises = missingEmails.map(email => {
                        return drive.permissions.create({
                            fileId: file.id,
                            requestBody: {
                                type: 'user',
                                role: 'reader',
                                emailAddress: email
                            },
                            sendNotificationEmail: false
                        }).catch(error => {
                            console.log(`Không thể cấp quyền cho ${email}:`, error.message);
                        });
                    });

                    await Promise.all(permissionPromises);
                }

                return {
                    ...file,
                    accessInfo: {
                        allowedEmails: fileAccess.allowedEmails,
                        isOwner: file.properties?.uploadedBy === userEmail
                    }
                };
            }));

            return files;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách file:', error);
            throw new Error('Lỗi khi lấy danh sách file: ' + error.message);
        }
    }
}

module.exports = DriveService; 