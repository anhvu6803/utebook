const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { BookController } = require('../controllers/index');

router.post(
    '/add-book',
    [
        body('bookname').notEmpty().withMessage('Bookname is required'),
        body('author').notEmpty().withMessage('Author is required'),
        body('categories').notEmpty().withMessage('Categories is required'),
        body('price').notEmpty().withMessage('Price is required').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
        body('statusbook').notEmpty().withMessage('Statusbook is required'),
        body('brief').notEmpty().withMessage('Brief is required'),
        body('wordcontents').notEmpty().withMessage('Wordcontents is required'),
        body('audios').notEmpty().withMessage('Audios is required'),
    ],
    BookController.addBook
);

router.post(
    '/add-createbook',
    [
        body('bookname').notEmpty().withMessage('Bookname is required'),
        body('author').notEmpty().withMessage('Author is required'),
        body('categories').notEmpty().withMessage('Categories is required'),
        body('price').notEmpty().withMessage('Price is required').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
        body('statusbook').notEmpty().withMessage('Statusbook is required'),
        body('brief').notEmpty().withMessage('Brief is required'),
        body('wordcontents').notEmpty().withMessage('Wordcontents is required'),
        body('audios').notEmpty().withMessage('Audios is required'),
    ],
    BookController.addCreateBook
);

router.patch(
    '/update-book/:bid',
    [
        body('bookname').notEmpty().withMessage('Bookname is required'),
        body('author').notEmpty().withMessage('Author is required'),
        body('categories').notEmpty().withMessage('Categories is required'),
        body('price').notEmpty().withMessage('Price is required').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
        body('statusbook').notEmpty().withMessage('Statusbook is required'),
        body('brief').notEmpty().withMessage('Brief is required'),
        body('wordcontents').notEmpty().withMessage('Wordcontents is required'),
        body('audios').notEmpty().withMessage('Audios is required'),
    ],
    BookController.updateBook
);

router.delete('/delete-book/:bid', BookController.deleteBook);
router.delete('/delete-createbook/:bid', BookController.deleteCreateBook);

module.exports = router;