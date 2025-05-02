const { validationResult } = require('express-validator');
const BookService = require('../services/book.service');
const DriveService = require('../services/drive.service');
const CloudinaryService = require('../services/cloudinary.service');
const ChapterService = require('../services/chapter.service');
const Book = require('../models/book.model');

exports.getAllBooks = async (req, res) => {
    try {
        const books = await BookService.getAllBooks();
        res.status(200).json({
            success: true,
            message: 'Lấy danh sách sách thành công',
            data: books
        });
    } catch (error) {
        console.error('Error in getAllBooks controller:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Có lỗi xảy ra khi lấy danh sách sách'
        });
    }
};

exports.getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await BookService.getBookById(id);
        res.status(200).json({
            success: true,
            message: 'Lấy thông tin sách thành công',
            data: book
        });
    } catch (error) {
        console.error('Error in getBookById controller:', error);
        if (error.message === 'Book not found') {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy sách'
            });
        } else {
            res.status(500).json({
                success: false,
                message: error.message || 'Có lỗi xảy ra khi lấy thông tin sách'
            });
        }
    }
};

exports.addBook = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { bookname, author, categories, type, pushlisher, description, image, ageLimit, chapterIds, viewlink } = req.body;

        // Kiểm tra các trường bắt buộc
        const requiredFields = {
            bookname: 'Tên sách',
            author: 'Tác giả',
            categories: 'Thể loại',
            type: 'Loại sách',
            pushlisher: 'Nhà xuất bản',
            description: 'Mô tả',
            image: 'Ảnh bìa',
            viewlink: 'Link PDF'
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
        if (type === "HoaPhuong" && (!price || price <= 0)) {
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
            type,
            pushlisher,
            image,
            description,
            ageLimit: parseInt(ageLimit),
            chapterIds: chapterIds || []
        };

        // Add book using service
        const newBook = await BookService.addBook(bookData);

        // Create first chapter for the book
        const chapterData = {
            chapterName: bookData.bookname,
            price: type === "Có phí" ? parseFloat(price) : 0,
            viewlink: viewlink,
            bookId: newBook._id
        };

        const newChapter = await ChapterService.addChapter(chapterData);
        res.status(201).json({
            success: true,
            message: 'Thêm sách thành công',
            data: {
                book: newBook,
                chapter: newChapter
            }
        });
    } catch (error) {
        console.error('Error in addBook controller:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Có lỗi xảy ra khi thêm sách'
        });
    }
};

exports.updateBook = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id } = req.params;
        const updateData = req.body;

        // Convert categories to array if it's a string
        if (updateData.categories && typeof updateData.categories === 'string') {
            updateData.categories = JSON.parse(updateData.categories);
        }

        // Convert ageLimit to number if it exists
        if (updateData.ageLimit) {
            updateData.ageLimit = parseInt(updateData.ageLimit);
        }

        const updatedBook = await BookService.updateBook(id, updateData);

        res.status(200).json({
            success: true,
            message: 'Cập nhật sách thành công',
            data: updatedBook
        });
    } catch (error) {
        console.error('Error in updateBook controller:', error);
        if (error.message === 'Book not found') {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy sách'
            });
        } else if (error.message === 'Book with this name already exists') {
            res.status(400).json({
                success: false,
                message: 'Tên sách đã tồn tại'
            });
        } else {
            res.status(500).json({
                success: false,
                message: error.message || 'Có lỗi xảy ra khi cập nhật sách'
            });
        }
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        await BookService.deleteBook(id);

        res.status(200).json({
            success: true,
            message: 'Xóa sách thành công'
        });
    } catch (error) {
        console.error('Error in deleteBook controller:', error);
        if (error.message === 'Book not found') {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy sách'
            });
        } else {
            res.status(500).json({
                success: false,
                message: error.message || 'Có lỗi xảy ra khi xóa sách'
            });
        }
    }
};

exports.getRandomBooks = async (req, res) => {
    try {
        const books = await BookService.getRandomBooks();
        res.status(200).json({
            success: true,
            message: 'Lấy danh sách sách ngẫu nhiên thành công',
            data: books
        });
    } catch (error) {
        console.error('Error in getRandomBooks controller:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Có lỗi xảy ra khi lấy danh sách sách'
        });
    }
};

exports.getBooksByCategory = async (req, res) => {
    try {
        const { category } = req.body;
        const books = await BookService.getBooksByCategory(category);
        res.status(200).json({
            success: true,
            message: 'Lấy danh sách sách ngẫu nhiên thành công',
            data: books
        });
    } catch (error) {
        console.error('Error in getRandomBooks controller:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Có lỗi xảy ra khi lấy danh sách sách'
        });
    }
};
exports.getRandomBooksByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const books = await BookService.getRandomBooksByCategory(category);
        res.status(200).json({
            success: true,
            message: 'Lấy danh sách sách ngẫu nhiên thành công',
            data: books
        });
    } catch (error) {
        console.error('Error in getRandomBooks controller:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Có lỗi xảy ra khi lấy danh sách sách'
        });
    }
};
