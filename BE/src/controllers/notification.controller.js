const notificationService = require('../services/notification.service');

exports.createNotificationForAllUsers = async (req, res) => {
    const { type, title, content } = req.body;

    try {
        const notification = await notificationService.createNotificationForAllUsers({
            type, title, content
        });

        res.status(201).json({
            message: 'Notification sent to all users successfully.',
            data: notification
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || 'Failed to create notification for all users.'
        });
    }
};

exports.createNotificationForMembers = async (req, res) => {
    const { type, title, content } = req.body;

    try {
        const notification = await notificationService.createNotificationForMembers({
            type, title, content
        });

        res.status(201).json({
            message: 'Notification sent to members successfully.',
            data: notification
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || 'Failed to create notification for members.'
        });
    }
};

exports.getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params;

        const notifications = await notificationService.getNotificationsByUserId(userId);
        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.sendToUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { type, title, content } = req.body;

        const notification = await notificationService.sendNotificationToUser({
            userId,
            type,
            title,
            content
        });

        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};