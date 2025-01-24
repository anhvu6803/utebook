const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { UserController } = require('../controllers/index');

router.post('/register', UserController.registerUser);
router.get('/confirm/:token', UserController.confirmEmail);
router.post('/resend-confirmation', UserController.resendConfirmationEmail);
router.post('/request-password-reset', [
    body('email').isEmail().withMessage('Valid email is required')
], UserController.requestPasswordReset);

router.post('/reset-password', [
    body('token').notEmpty().withMessage('Token is required'),
    body('newPassword').notEmpty().withMessage('New password is required')
], UserController.resetPassword);

module.exports = router;
