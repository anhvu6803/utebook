const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {ReviewController} = require('../controllers/index');

router.post('/add', [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('bookId').notEmpty().withMessage('Book ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').notEmpty().withMessage('Comment is required')
], ReviewController.addReview);

router.post('/update', [
    body('reviewId').notEmpty().withMessage('Review ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').notEmpty().withMessage('Comment is required')
], ReviewController.updateReview);

router.delete('/:reviewId', ReviewController.deleteReview);

router.get('/book/:bookId', ReviewController.getReviewsByBookId);

module.exports = router;