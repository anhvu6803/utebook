const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { CartController } = require('../controllers/index');

router.post('/add-book', [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('bookId').notEmpty().withMessage('Book ID is required')
], CartController.addBookToCart);

router.post('/remove-book', [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('bookId').notEmpty().withMessage('Book ID is required')
], CartController.removeBookFromCart);

module.exports = router;