const { validationResult } = require('express-validator');
const ReviewService = require('../services/review.service');

exports.addReview = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { userId, bookId, rating, comment } = req.body;
        const review = await ReviewService.addReview(userId, bookId, rating, comment);
        res.status(201).json({
            message: 'Review added successfully',
            review: review,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateReview = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { reviewId, rating, comment } = req.body;
        const review = await ReviewService.updateReview(reviewId, rating, comment);
        res.status(200).json({
            message: 'Review updated successfully',
            review: review,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await ReviewService.deleteReview(reviewId);
        res.status(200).json({
            message: 'Review deleted successfully',
            review: review,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getReviewsByBookId = async (req, res) => {
    try {
        const { bookId } = req.params;
        const reviews = await ReviewService.getReviewsByBookId(bookId);
        res.status(200).json({
            reviews: reviews,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};