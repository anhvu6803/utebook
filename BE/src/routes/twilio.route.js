const express = require('express');
const router = express.Router();
const twilioController = require('../controllers/twilio.controller');

// Phone verification routes
router.post('/send-verification', twilioController.sendVerificationCode);
router.post('/verify-phone', twilioController.verifyPhoneNumber);

module.exports = router; 