const Review = require('../models/review.model');
const Book = require('../models/book.model');

const avagradeRating = async (bookId) => {
    const allReviews = await Review.find({ bookId: bookId });

    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;

    return averageRating.toFixed(1);
}
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

    book.listReviews.push(review._id);
    book.avegradeRate = await avagradeRating(bookId);

    await book.save();

    const populateReview = await Review.findById(review._id).populate('userId', 'fullname avatar');

    return populateReview;
};

exports.updateReview = async (reviewId, rating, comment) => {
    const review = await Review.findById(reviewId);
    if (!review) {
        throw new Error('Review not found');
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    const bookId = review.bookId;
    const book = await Book.findById(bookId);
    book.avegradeRate = await avagradeRating(bookId);
    await book.save();

    return review;
};

exports.deleteReview = async (reviewId) => {
    const review = await Review.findById(reviewId);
    const bookId = review.bookId;
    if (!review) {
        throw new Error('Review not found');
    }

    const book = await Book.findById(bookId);
    if (book) {
        book.listReviews = book.listReviews.filter(id => id.toString() !== reviewId);
        book.avegradeRate = await avagradeRating(bookId);

        await book.save();
    }
    await review.remove();
    return review;
};

exports.getReviewsByBookId = async (bookId) => {
    const reviews = await Review.find({ bookId }).populate('userId', 'username fullname');
    return reviews;
};