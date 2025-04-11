require('dotenv').config();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;

const client = twilio(accountSid, authToken);

const sendVerificationCode = async (phoneNumber) => {
    client.verify.v2.services(serviceId)
        .verifications
        .create({ to: phoneNumber, channel: 'sms' })
        .then(verification => console.log(verification.code));
};

const verifyNumber = async (phoneNumber, code) => {
    try {
        const verificationCheck = await client.verify.v2
            .services(serviceId)
            .verificationChecks
            .create({ to: phoneNumber, code: code });
        return verificationCheck;
    } catch (error) {
        throw new Error(`Failed to verify number: ${error.message}`);
    }
};

module.exports = {
    sendVerificationCode,
    verifyNumber
}; 