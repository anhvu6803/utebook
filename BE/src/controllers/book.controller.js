const { validationResult } = require('express-validator');
const BookService = require('../services/book.service');

exports.addBook = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newBook = await BookService.addBook(req.body);
        console.log(newBook)
        res.status(201).json({
            message: 'Added book successfully',
            book: newBook,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateBook = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updatedBook = await BookService.updateBook(req.params.bid, req.body);

        res.status(201).json({
            message: 'updated book successfully',
            book: updatedBook,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const result = await BookService.deleteBook(req.params.bid);

        res.status(200).json({
            message: result,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.addCreateBook = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newBook = await BookService.addCreateBook(req.body);

        res.status(201).json({
            message: 'Added create book successfully',
            book: newBook,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteCreateBook = async (req, res) => {
    try {
        const result = await BookService.deleteCreateBook(req.params.bid);

        res.status(200).json({
            message: result,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};