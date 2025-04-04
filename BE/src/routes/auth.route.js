const express = require('express');
const authController = require('../controllers/auth.controller');
const authUserMiddleware = require('../middleware/authUser.middleware');

const router = express.Router();

router.post('/login', authController.login);
router.post('/google-login', authController.googleLogin);
router.post('/logout', authUserMiddleware, authController.logout);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
