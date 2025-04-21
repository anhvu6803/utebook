const { validationResult } = require('express-validator');
const CategoryService = require('../services/category.service');

class CategoryController {
    // Lấy tất cả thể loại
    static async getAllCategories(req, res) {
        try {
            const result = await CategoryService.getAllCategories();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Có lỗi xảy ra khi lấy danh sách thể loại'
            });
        }
    }

    // Thêm thể loại mới
    static async createCategory(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const result = await CategoryService.createCategory(req.body);
            return res.status(201).json(result);
        } catch (error) {
            if (error.message === 'Tên thể loại đã tồn tại') {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            return res.status(500).json({
                success: false,
                message: error.message || 'Có lỗi xảy ra khi thêm thể loại'
            });
        }
    }

    // Cập nhật thể loại
    static async updateCategory(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { id } = req.params;
            const result = await CategoryService.updateCategory(id, req.body);
            res.status(200).json(result);
        } catch (error) {
            if (error.message === 'Không tìm thấy thể loại' || 
                error.message === 'Tên thể loại đã tồn tại') {
                res.status(400).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error.message || 'Có lỗi xảy ra khi cập nhật thể loại'
                });
            }
        }
    }

    // Xóa thể loại
    static async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            const result = await CategoryService.deleteCategory(id);
            res.status(200).json(result);
        } catch (error) {
            if (error.message === 'Không tìm thấy thể loại') {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error.message || 'Có lỗi xảy ra khi xóa thể loại'
                });
            }
        }
    }
}

module.exports = CategoryController;
