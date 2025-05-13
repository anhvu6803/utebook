const Book = require('../models/book.model');
const Chapter = require('../models/chapter.model');
const mongoose = require('mongoose');
const HistoryReadingService = require('../services/historyReading.service');

exports.getReadingById = async (req, res) => {
    try {
        const { userId, bookId } = req.query;
        const reading = await HistoryReadingService.getReadingById(userId, bookId);
        res.status(200).json({
            success: true,
            message: 'Lấy thông tin sách thành công',
            data: reading
        });
    } catch (error) {
        console.error('Error in getReadingById controller:', error);
        if (error.message === 'Reading not found') {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy lịch sử đọc sách'
            });
        } else {
            res.status(500).json({
                success: false,
                message: error.message || 'Có lỗi xảy ra khi lấy thông tin lịch sử'
            });
        }
    }
};

exports.addReading = async (req, res) => {

    try {
        const { userId, bookId, chapterId } = req.body;

        // Prepare book data
        const readingData = {
            userId,
            bookId,
            chapterId
        };

        const newReading = await HistoryReadingService.addReading(readingData);

        res.status(201).json({
            success: true,
            message: 'Thêm lịch sử đọc thành công',
            data: newReading
        });
    } catch (error) {
        console.error('Error in addReading controller:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Có lỗi xảy ra khi thêm lịch sử đọc'
        });
    }
};

exports.updateReading = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedBook = await HistoryReadingService.updateReading(id, updateData);

        res.status(200).json({
            success: true,
            message: 'Cập nhật sách thành công',
            data: updatedBook
        });
    } catch (error) {
        console.error('Error in updateReading controller:', error);
        if (error.message === 'Reading not found') {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy lịch sử đọc sách'
            });
        } else {
            res.status(500).json({
                success: false,
                message: error.message || 'Có lỗi xảy ra khi cập nhật sách'
            });
        }
    }
};