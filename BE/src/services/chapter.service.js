const Chapter = require('../models/chapter.model');
const Book = require('../models/book.model');
const mongoose = require('mongoose');

class ChapterService {
    async addChapter(chapterData) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const { chapterName, price, viewlink, bookId } = chapterData;

            // Create new chapter
            const newChapter = new Chapter({
                chapterName,
                price,
                viewlink,
                bookId
            });

            // Save chapter to database
            const savedChapter = await newChapter.save({ session });

            // Update book with new chapter
            await Book.findByIdAndUpdate(
                bookId,
                { $push: { chapterIds: savedChapter._id } },
                { session }
            );

            await session.commitTransaction();
            return savedChapter;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async getAllChapters() {
        try {
            return await Chapter.find();
        } catch (error) {
            throw error;
        }
    }

    async getChapterById(id) {
        try {
            const chapter = await Chapter.findById(id);
            if (!chapter) {
                throw new Error('Chapter not found');
            }
            return chapter;
        } catch (error) {
            throw error;
        }
    }

    async updateChapter(id, updateData) {
        try {
            const chapter = await Chapter.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            );
            if (!chapter) {
                throw new Error('Chapter not found');
            }
            return chapter;
        } catch (error) {
            throw error;
        }
    }

    async deleteChapter(id) {
        try {
            const chapter = await Chapter.findByIdAndDelete(id);
            if (!chapter) {
                throw new Error('Chapter not found');
            }
            return chapter;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ChapterService();
