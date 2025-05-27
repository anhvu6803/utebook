const Point = require('../models/point.model');
const Chapter = require('../models/chapter.model');
const Book = require('../models/book.model');
const HistoryPoint = require('../models/history_point.model');

const pointService = {
    // Create a new point record
    async createPoint(pointData) {
        try {
            // Check if point already exists for this user
            const existingPoint = await Point.findOne({ id_user: pointData.id_user });
            
            if (existingPoint) {
                throw new Error('Point record already exists for this user');
            }
            
            const newPoint = new Point(pointData);
            return await newPoint.save();
        } catch (error) {
            throw error;
        }
    },

    // Get all points
    async getAllPoints() {
        try {
            return await Point.find();
        } catch (error) {
            throw error;
        }
    },

    // Get point by user ID
    async getPointByUserId(userId) {
        try {
            return await Point.findOne({ id_user: userId });
        } catch (error) {
            throw error;
        }
    },

    // Update point by user ID
    async updatePoint(userId, updateData) {
        try {
            const updatedPoint = await Point.findOneAndUpdate(
                { id_user: userId },
                updateData,
                { new: true, runValidators: true }
            );
            
            return updatedPoint;
        } catch (error) {
            throw error;
        }
    },

    // Delete point by user ID
    async deletePoint(userId) {
        try {
            const deletedPoint = await Point.findOneAndDelete({ id_user: userId });
            return deletedPoint;
        } catch (error) {
            throw error;
        }
    },

    async buyChapter(userId, chapterId) {
        if (!userId || !chapterId) {
            throw new Error('Thiếu userId hoặc chapterId');
        }

        // Lấy thông tin chapter
        const chapter = await Chapter.findById(chapterId);
        if (!chapter) throw new Error('Không tìm thấy chapter');

        // Lấy thông tin book
        const book = await Book.findById(chapter.bookId);
        if (!book) throw new Error('Không tìm thấy book');

        // Lấy điểm user
        const point = await Point.findOne({ id_user: userId });
        if (!point) throw new Error('Không tìm thấy điểm của user');

        // Kiểm tra đủ điểm chưa
        if (point.quantity_HoaPhuong < chapter.price) {
            throw new Error('Không đủ điểm Hoa Phượng');
        }

        // Trừ điểm
        point.quantity_HoaPhuong -= chapter.price;
        await point.save();

        // Thêm vào history point
        const history = new HistoryPoint({
            id_user: userId,
            type: 'Đọc',
            number_point_HoaPhuong: chapter.price,
            number_point_La: 0,
            chapterId: chapter._id,
            time: new Date(),
            status: 'Thành công'
        });
        await history.save();

        return {
            point,
            history,
            book: {
                _id: book._id,
                bookname: book.bookname,
                author: book.author,
                categories: book.categories,
                type: book.type,
                pushlisher: book.pushlisher,
                image: book.image,
                description: book.description
            },
            chapter: {
                _id: chapter._id,
                chapterName: chapter.chapterName,
                price: chapter.price
            }
        };
    }
};

module.exports = pointService; 