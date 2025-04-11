const { sendVerificationCode, verifyNumber } = require('../configs/twilio.config');

class TwilioService {
    async sendPhoneVerification(phoneNumber) {
        try {
            // Format phone number to international format
            const formattedPhone = phoneNumber.startsWith('0') ? `+84${phoneNumber.substring(1)}` : phoneNumber;
            const result = await sendVerificationCode(formattedPhone);
            return {
                success: true,
                message: 'Verification code sent successfully', 
                data: result
            };
        } catch (error) {
            throw new Error(`Failed to send verification code: ${error.message}`);
        }
    }

    async verifyPhoneNumber(phoneNumber, code) {
        try {
            // Format phone number to international format
            const formattedPhone = phoneNumber.startsWith('0') ? `+84${phoneNumber.substring(1)}` : phoneNumber;
            const result = await verifyNumber(formattedPhone, code);
            return {
                success: result.status === 'approved',
                message: result.status === 'approved' ? 'Phone number verified successfully' : 'Invalid verification code',
                data: result
            };
        } catch (error) {
            throw new Error(`Failed to verify phone number: ${error.message}`);
        }
    }
}

module.exports = new TwilioService(); 