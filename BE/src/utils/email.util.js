const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,  
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

 
transporter.verify((error, success) => {
    if (error) {
        console.error('Email configuration error:', error);
    }
});

const emailUtil = {
    
    async sendVerificationCode(email, code) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Email Verification Code',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Email Verification</h2>
                        <p>Your verification code is:</p>
                        <div style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
                            ${code}
                        </div>
                        <p>This code will expire in 15 minutes.</p>
                        <p>If you didn't request this code, please ignore this email.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Error sending verification email:', error);
            throw new Error('Failed to send verification email');
        }
    },

 
    async sendPasswordResetCode(email, code) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Password Reset Code',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Password Reset</h2>
                        <p>Your password reset code is:</p>
                        <div style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
                            ${code}
                        </div>
                        <p>This code will expire in 15 minutes.</p>
                        <p>If you didn't request this code, please ignore this email.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Error sending password reset email:', error);
            throw new Error('Failed to send password reset email');
        }
    },

    async sendPasswordResetLink(email, token) {
        try {
            const resetLink = `${process.env.WEB_URI}/change-password?token=${token}`;
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Password Reset Link',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Password Reset</h2>
                        <p>Click the button below to reset your password:</p>
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="${resetLink}" 
                               style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                Reset Password
                            </a>
                        </div>
                        <p>This link will expire in 2 minutes.</p>
                        <p>If you didn't request this password reset, please ignore this email.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Error sending password reset email:', error);
            throw new Error('Failed to send password reset email');
        }
    }
};

module.exports = emailUtil; 