const Cart = require('../models/cart.model');
const Book = require('../models/book.model');

exports.addBookToCart = async (userId, bookId) => {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
        cart = new Cart({ userId, bookId: [], totalPrice: 0 });
    }

    const book = await Book.findById(bookId);
    if (!book) {
        throw new Error('Book not found');
    }

    cart.bookId.push(bookId);
    cart.totalPrice += book.price;

    await cart.save();
    return cart;
};

exports.removeBookFromCart = async (userId, bookId) => {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
        throw new Error('Cart not found');
    }

    const bookIndex = cart.bookId.indexOf(bookId);
    if (bookIndex === -1) {
        throw new Error('Book not found in cart');
    }

    const book = await Book.findById(bookId);
    if (!book) {
        throw new Error('Book not found');
    }

    cart.bookId.splice(bookIndex, 1);
    cart.totalPrice -= book.price;

    await cart.save();
    return cart;
};