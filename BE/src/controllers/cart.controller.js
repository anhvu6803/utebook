const { validationResult } = require('express-validator');
const CartService = require('../services/cart.service');

exports.addBookToCart = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { userId, bookId } = req.body;
        const cart = await CartService.addBookToCart(userId, bookId);
        res.status(200).json({
            message: 'Book added to cart successfully',
            cart: cart,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.removeBookFromCart = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { userId, bookId } = req.body;
        const cart = await CartService.removeBookFromCart(userId, bookId);
        res.status(200).json({
            message: 'Book removed from cart successfully',
            cart: cart,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};