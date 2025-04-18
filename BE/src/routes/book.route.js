const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const BookController = require('../controllers/book.controller');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit for files
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'image') {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(new Error('Only image files are allowed for book cover'));
            }
        } else if (file.fieldname === 'bookFile') {
            const allowedTypes = ['application/pdf', 'application/epub+zip'];
            if (allowedTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Only PDF and EPUB files are allowed for books'));
            }
        }
    }
});

// Add book route
router.post('/add-book', 
    [
        body('bookname').notEmpty().withMessage('Book name is required'),
        body('author').notEmpty().withMessage('Author is required'),
        body('categories')
            .isArray().withMessage('Categories must be an array')
            .notEmpty().withMessage('Categories cannot be empty'),
        body('price')
            .notEmpty().withMessage('Price is required')
            .isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
        body('type').notEmpty().withMessage('Book type is required'),
        body('pushlisher').notEmpty().withMessage('Publisher is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('image').notEmpty().withMessage('Image URL is required').isString(),
        body('viewlink').notEmpty().withMessage('View link is required').isString()
    ],
    BookController.addBook
);

module.exports = router;
