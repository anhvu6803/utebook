const { validationResult } = require('express-validator');
const BookService = require('../services/book.service');
const DriveService = require('../services/drive.service');
const CloudinaryService = require('../services/cloudinary.service');

exports.addBook = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { bookname, author, categories, price, type, pushlisher, description, image, viewlink } = req.body;

        // Kiểm tra các trường bắt buộc
        const requiredFields = {
            bookname: 'Tên sách',
            author: 'Tác giả',
            categories: 'Thể loại',
            type: 'Loại sách',
            pushlisher: 'Nhà xuất bản',
            description: 'Mô tả',
            image: 'Ảnh bìa',
            viewlink: 'Link sách'
        };

        const missingFields = [];
        for (const [field, label] of Object.entries(requiredFields)) {
            if (!req.body[field]) {
                missingFields.push(label);
            }
        }

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Vui lòng nhập đầy đủ thông tin: ${missingFields.join(', ')}`
            });
        }

        // Kiểm tra giá nếu là sách có phí
        if (type === "Có phí" && (!price || price <= 0)) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập giá hợp lệ cho sách có phí'
            });
        }

        // Prepare book data
        const bookData = {
            bookname,
            author,
            categories: Array.isArray(categories) ? categories : JSON.parse(categories),
            price: type === "Có phí" ? parseFloat(price) : 0,
            type,
            pushlisher,
            image,
            viewlink,
            description
        };

        // Add book using service
        const newBook = await BookService.addBook(bookData);

        res.status(201).json({
            success: true,
            message: 'Thêm sách thành công',
            data: newBook
        });
    } catch (error) {
        console.error('Error in addBook controller:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Có lỗi xảy ra khi thêm sách'
        });
    }
};
