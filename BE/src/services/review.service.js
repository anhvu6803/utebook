const Review = require('../models/review.model');
const Book = require('../models/book.model');

exports.addReview = async (userId, bookId, rating, comment) => {
    const book = await Book.findById(bookId);
    if (!book) {
        throw new Error('Book not found');
    }

    const review = new Review({
        userId,
        bookId,
        rating,
        comment
    });

    await review.save();
    return review;
};

exports.updateReview = async (reviewId, rating, comment) => {
    const review = await Review.findById(reviewId);
    if (!review) {
        throw new Error('Review not found');
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();
    return review;
};

exports.deleteReview = async (reviewId) => {
    const review = await Review.findById(reviewId);
    if (!review) {
        throw new Error('Review not found');
    }

    await review.remove();
    return review;
};

exports.getReviewsByBookId = async (bookId) => {
    const reviews = await Review.find({ bookId }).populate('userId', 'username fullname');
    return reviews;
};