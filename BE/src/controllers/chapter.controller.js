const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const ChapterService = require('../services/chapter.service');

exports.addChapter = async (req, res) => {
    try {
        // Check if user is authenticated and is admin
        if (!req.user || !req.user.isAdmin) {
            return res.status(401).json({
                success: false,
                message: 'Không có quyền thực hiện thao tác này'
            });
        }

        const { chapterName, price, viewlink, bookId } = req.body;
        const errors = {};

        if (!chapterName || typeof chapterName !== 'string' || !chapterName.trim()) {
            errors.chapterName = 'Tên chương không được để trống';
        }
        if (price === undefined || price === null || isNaN(price) || Number(price) < 0) {
            errors.price = 'Giá chương phải là số không âm';
        }
        if (!viewlink || typeof viewlink !== 'string' || !viewlink.trim()) {
            errors.viewlink = 'Link nội dung không hợp lệ';
        }
        if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
            errors.bookId = 'BookId không hợp lệ';
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Dữ liệu đầu vào không hợp lệ',
                errors
            });
        }

        // Add chapter using service
        const newChapter = await ChapterService.addChapter({
            chapterName,
            price: price || 0,
            viewlink,
            bookId
        });

        // Return success response
        return res.status(201).json({
            success: true,
            message: 'Thêm chapter thành công',
            data: newChapter
        });
    } catch (error) {
        console.error('Error in addChapter controller:', error);
        // Đảm bảo chỉ gửi một response lỗi
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Có lỗi xảy ra khi thêm chapter'
            });
        }
    }
};

exports.getAllChapters = async (req, res) => {
    try {
        const chapters = await ChapterService.getAllChapters();
        res.status(200).json({
            success: true,
            data: chapters
        });
    } catch (error) {
        console.error('Error in getAllChapters controller:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Có lỗi xảy ra khi lấy danh sách chapter'
        });
    }
};

exports.getChapterById = async (req, res) => {
    try {
        const chapter = await ChapterService.getChapterById(req.params.id);
        res.status(200).json({
            success: true,
            data: chapter
        });
    } catch (error) {
        console.error('Error in getChapterById controller:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Có lỗi xảy ra khi lấy thông tin chapter'
        });
    }
};

exports.updateChapter = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { chapterName, price, viewlink } = req.body;
        const updateData = {};

        if (chapterName) updateData.chapterName = chapterName;
        if (price) updateData.price = parseFloat(price);
        if (viewlink) updateData.viewlink = viewlink;

        const updatedChapter = await ChapterService.updateChapter(req.params.id, updateData);

        res.status(200).json({
            success: true,
            message: 'Cập nhật chapter thành công',
            data: updatedChapter
        });
    } catch (error) {
        console.error('Error in updateChapter controller:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Có lỗi xảy ra khi cập nhật chapter'
        });
    }
};

exports.deleteChapter = async (req, res) => {
    try {
        const deletedChapter = await ChapterService.deleteChapter(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Xóa chapter thành công',
            data: deletedChapter
        });
    } catch (error) {
        console.error('Error in deleteChapter controller:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Có lỗi xảy ra khi xóa chapter'
        });
    }
};
