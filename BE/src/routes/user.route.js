const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Public routes
router.post('/send-verification-code', userController.sendVerificationCode);
router.post('/register', userController.register);
router.post('/verify-email', userController.verifyEmail);
router.post('/request-password-reset', userController.requestPasswordReset);
router.post('/reset-password', userController.resetPassword);

// Membership status routes
router.get('/membership/check-all', userController.checkAndUpdateAllMemberships);
router.get('/membership/check/:id', userController.checkMembershipStatus);

// Protected routes
router.get('/',userController.getAllUsers);
router.get('/:id',userController.getUserById);
router.patch('/:id',userController.updateUser);
router.delete('/:id',userController.deleteUser);

module.exports = router;
