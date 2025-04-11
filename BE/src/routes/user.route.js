const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.post('/send-verification-code', userController.sendVerificationCode);
router.post('/register', userController.register);
router.post('/verify-email', userController.verifyEmail);
router.post('/request-password-reset', userController.requestPasswordReset);
router.post('/reset-password', userController.resetPassword);
router.patch('/:userId', userController.updateUser);

module.exports = router;
