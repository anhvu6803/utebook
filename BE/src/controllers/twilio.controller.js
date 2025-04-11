const twilioService = require('../services/twilio.service');

class TwilioController {
    async sendVerificationCode(req, res) {
        try {
            const { phoneNumber } = req.body;
            
            if (!phoneNumber) {
                return res.status(400).json({
                    success: false,
                    message: 'Phone number is required'
                });
            }

            const result = await twilioService.sendPhoneVerification(phoneNumber);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async verifyPhoneNumber(req, res) {
        try {
            const { phoneNumber, code } = req.body;
            
            if (!phoneNumber || !code) {
                return res.status(400).json({
                    success: false,
                    message: 'Phone number and verification code are required'
                });
            }

            const result = await twilioService.verifyPhoneNumber(phoneNumber, code);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new TwilioController(); 