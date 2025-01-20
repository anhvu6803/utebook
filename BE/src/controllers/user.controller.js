const { validationResult } = require('express-validator');
const UserService = require('../services/user.service');

exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newUser = await UserService.registerUser(req.body);
        res.status(201).json({
            message: 'User registered successfully',
            user: newUser,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
