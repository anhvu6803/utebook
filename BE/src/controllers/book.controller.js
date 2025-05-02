const { validationResult } = require('express-validator');
const BookService = require('../services/book.service');
const DriveService = require('../services/drive.service');
const CloudinaryService = require('../services/cloudinary.service');
const ChapterService = require('../services/chapter.service');
const Book = require('../models/book.model');
const Chapter = require('../models/chapter.model');
const mongoose = require('mongoose');

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

exports.syncChaptersToBook = async (req, res) => {
    try {
        const { bookId } = req.params;

        console.log('Starting sync for bookId:', bookId);

        // Validate input
        if (!bookId) {
            console.log('Error: Book ID is required');
            return res.status(400).json({
                success: false,
                message: 'Book ID is required'
            });
        }

        // Check if book exists
        const book = await Book.findById(bookId);
        if (!book) {
            console.log('Error: Book not found with ID:', bookId);
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        console.log('Found book:', book.bookname);

        // Tìm chapter với cả hai trường hợp bookId là string hoặc ObjectId
        const chapters = await Chapter.find({
            $or: [
                { bookId: bookId },
                { bookId: new mongoose.Types.ObjectId(bookId) }
            ]
        });
        
        console.log('Found chapters count:', chapters.length);
        console.log('Chapters:', chapters.map(c => ({
            _id: c._id,
            bookId: c.bookId,
            chapterName: c.chapterName
        })));
        
        if (!chapters || chapters.length === 0) {
            console.log('Warning: No chapters found for book:', book.bookname);
            // Thay vì trả về lỗi, chúng ta sẽ cập nhật book với mảng chapterIds rỗng
            book.chapterIds = [];
            await book.save();
            
            return res.status(200).json({
                success: true,
                message: 'No chapters found, book updated with empty chapterIds',
                data: {
                    book: book,
                    chaptersCount: 0
                }
            });
        }

        // Get all chapter IDs
        const chapterIds = chapters.map(chapter => chapter._id);
        console.log('Chapter IDs to add:', chapterIds);

        // Update book's chapterIds array
        book.chapterIds = chapterIds;
        await book.save();

        console.log('Successfully updated book with chapters');

        return res.status(200).json({
            success: true,
            message: 'Successfully synced chapters to book',
            data: {
                book: book,
                chaptersCount: chapters.length,
                chapterIds: chapterIds
            }
        });

    } catch (error) {
        console.error('Error in syncChaptersToBook:', error);
        console.error('Error stack:', error.stack);
        
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

exports.syncAllChaptersToBooks = async (req, res) => {
    try {
        console.log('Starting to sync all chapters to books');

        // Lấy tất cả books
        const books = await Book.find({});
        console.log(`Found ${books.length} books`);

        let totalChaptersSynced = 0;
        let booksUpdated = 0;
        const results = [];

        // Duyệt qua từng book
        for (const book of books) {
            try {
                console.log(`\nProcessing book: ${book.bookname} (${book._id})`);

                // Tìm tất cả chapter của book này
                const chapters = await Chapter.find({
                    $or: [
                        { bookId: book._id.toString() },
                        { bookId: new mongoose.Types.ObjectId(book._id) }
                    ]
                });

                console.log(`Found ${chapters.length} chapters for this book`);

                // Lấy danh sách chapterIds
                const chapterIds = chapters.map(chapter => chapter._id);

                // Cập nhật book
                book.chapterIds = chapterIds;
                await book.save();

                totalChaptersSynced += chapters.length;
                booksUpdated++;

                results.push({
                    bookId: book._id,
                    bookName: book.bookname,
                    chaptersCount: chapters.length,
                    chapterIds: chapterIds
                });

                console.log(`Updated book with ${chapters.length} chapters`);

            } catch (error) {
                console.error(`Error processing book ${book._id}:`, error);
                results.push({
                    bookId: book._id,
                    bookName: book.bookname,
                    error: error.message
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Successfully synced all chapters to books',
            data: {
                totalBooks: books.length,
                booksUpdated: booksUpdated,
                totalChaptersSynced: totalChaptersSynced,
                results: results
            }
        });

    } catch (error) {
        console.error('Error in syncAllChaptersToBooks:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
