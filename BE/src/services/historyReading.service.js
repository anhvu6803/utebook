const HistoryReading = require('../models/history_reading.model');
const Book = require('../models/book.model');
const Chapter = require('../models/chapter.model');
const User = require('../models/user.model');
exports.getReadingById = async (userId, bookId) => {
    try {
        const reading = await HistoryReading.findOne({ userId, bookId }).populate('bookId');

        if (!reading) {
            throw new Error('Reading not found');
        }
        return reading;
    } catch (error) {
        throw error;
    }
};

exports.addReading = async (readingData) => {
    try {
        const { userId, bookId, chapterId } = readingData;

        const userExists = await User.findById(userId);
        if (!userExists) throw new Error('User does not exist');

        const bookExists = await Book.findById(bookId);
        if (!bookExists) throw new Error('Book does not exist');

        const chapterExists = await Chapter.findById(chapterId);
        if (!chapterExists) throw new Error('Chapter does not exist');

        // Kiểm tra trùng
        const alreadyExists = await HistoryReading.findOne({ userId, bookId, chapterId });
        if (alreadyExists) {
            throw new Error('Reading history already exists');
        }

        // Create new book
        const newReading = new HistoryReading({
            userId,
            bookId,
            chapterId
        });

        // Save book to database
        const savedReading = await newReading.save();
        return savedReading;
    } catch (error) {
        throw error;
    }
};

exports.updateReading = async (readingId, updateData) => {
    try {
        // Check if book exists
        const existingReading = await HistoryReading.findById(readingId);
        if (!existingReading) {
            throw new Error('Reading not found');
        }

        const updatedReading = await HistoryReading.findByIdAndUpdate(
            readingId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        return updatedReading;
    } catch (error) {
        throw error;
    }
};