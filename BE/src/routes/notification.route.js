const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');


router.post('/all', notificationController.createNotificationForAllUsers);

router.post('/membership', notificationController.createNotificationForMembers);

router.post('/:userId', notificationController.sendToUser);

router.get('/:userId', notificationController.getUserNotifications);

module.exports = router;
