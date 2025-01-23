const { validationResult } = require('express-validator');
const BookService = require('../services/book.service');

exports.getAllBook = async (req, res) => {
    try {
        const allBook = await BookService.getAllBook();

        res.status(201).json({
            message: 'Find books successfully',
            books: allBook,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.getOneBook = async (req, res) => {
    try {
        const book = await BookService.getOneBook(req.params.bid);

        res.status(201).json({
            message: 'Find book successfully',
            books: book,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.getBookByCategory = async (req, res) => {
    try {
        const books = await BookService.getBookByCategory(req.params.category);

        res.status(201).json({
            message: 'Find books successfully',
            books: books,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

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
            message: newBook,

        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};