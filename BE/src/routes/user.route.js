const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { UserController } = require('../controllers/index');

router.post(
    '/register',
    [
        body('username').notEmpty().withMessage('Username is required').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
        body('email').isEmail().withMessage('Invalid email').notEmpty().withMessage('Email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').notEmpty().withMessage('Password is required'),
        body('ngaySinh').isDate().withMessage('Invalid date of birth').notEmpty().withMessage('Date of birth is required'),
        body('gioiTinh').isIn(['Nam', 'Nữ', 'Khác']).withMessage('Invalid gender').notEmpty().withMessage('Gender is required'),
    ],
    UserController.registerUser
);

module.exports = router;
