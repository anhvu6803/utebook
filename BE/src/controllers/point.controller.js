const Point = require('../models/point.model');
const Chapter = require('../models/chapter.model');
const Book = require('../models/book.model');
const HistoryPoint = require('../models/history_point.model');
const pointService = require('../services/point.service');

const pointController = {
    // Lấy tất cả điểm
    async getAllPoints(req, res) {
        try {
            const points = await Point.find();
            res.status(200).json({
                success: true,
                data: points
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Lấy điểm theo user ID
    async getPointByUserId(req, res) {
        try {
            const { userId } = req.params;
            const point = await Point.findOne({ id_user: userId });
            
            if (!point) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy điểm cho người dùng này'
                });
            }

            res.status(200).json({
                success: true,
                data: point
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Tạo điểm mới
    async createPoint(req, res) {
        try {
            const { id_user, quantity_HoaPhuong, quantity_La } = req.body;

            // Kiểm tra xem điểm đã tồn tại cho user này chưa
            const existingPoint = await Point.findOne({ id_user });
            if (existingPoint) {
                return res.status(400).json({
                    success: false,
                    message: 'Điểm đã tồn tại cho người dùng này'
                });
            }

            const newPoint = new Point({
                id_user,
                quantity_HoaPhuong: quantity_HoaPhuong || 0,
                quantity_La: quantity_La || 0
            });

            const savedPoint = await newPoint.save();
            res.status(201).json({
                success: true,
                data: savedPoint
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Cập nhật điểm
    async updatePoint(req, res) {
        try {
            const { userId } = req.params;
            const { quantity_HoaPhuong, quantity_La } = req.body;

            // Kiểm tra xem điểm có tồn tại không
            const existingPoint = await Point.findOne({ id_user: userId });
            if (!existingPoint) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy điểm cho người dùng này'
                });
            }

            // Cập nhật điểm
            const updatedPoint = await Point.findOneAndUpdate(
                { id_user: userId },
                { 
                    quantity_HoaPhuong: quantity_HoaPhuong !== undefined ? quantity_HoaPhuong : existingPoint.quantity_HoaPhuong,
                    quantity_La: quantity_La !== undefined ? quantity_La : existingPoint.quantity_La
                },
                { new: true, runValidators: true }
            );

            res.status(200).json({
                success: true,
                data: updatedPoint
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Xóa điểm
    async deletePoint(req, res) {
        try {
            const { userId } = req.params;

            // Kiểm tra xem điểm có tồn tại không
            const existingPoint = await Point.findOne({ id_user: userId });
            if (!existingPoint) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy điểm cho người dùng này'
                });
            }

            await Point.findOneAndDelete({ id_user: userId });

            res.status(200).json({
                success: true,
                message: 'Đã xóa điểm thành công'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    buyChapter: async (req, res) => {
        try {
            const { userId, chapterId } = req.body;
            const result = await pointService.buyChapter(userId, chapterId);
            res.status(200).json({
                success: true,
                message: 'Mua chương thành công',
                data: result
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};

module.exports = pointController; 