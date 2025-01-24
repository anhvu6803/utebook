const { validationResult } = require('express-validator');
const UserService = require('../services/user.service');

exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userData = { ...req.body, host: req.headers.host };
        const tempUser = await UserService.registerUser(userData);
        res.status(201).json({
            message: 'User registered successfully. A confirmation email has been sent to ' + userData.email,
            user: tempUser,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.confirmEmail = async (req, res) => {
    try {
        const user = await UserService.confirmEmail(req.params.token);
        res.status(200).json({
            message: 'Your email has been confirmed.',
            user: user,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.resendConfirmationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserService.resendConfirmationEmail(email, req.headers.host);
        res.status(200).json({
            message: 'A confirmation email has been resent to ' + user.email,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserService.requestPasswordReset(email, req.headers.host);
        res.status(200).json({
            message: 'A password reset email has been sent to ' + user.email,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { token, newPassword } = req.body;
        const user = await UserService.resetPassword(token, newPassword);
        res.status(200).json({
            message: 'Your password has been reset successfully.',
            user: user,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};