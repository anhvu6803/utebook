const Book = require('../models/book.model');

exports.getAllBooks = async () => {
    try {
        const books = await Book.find()
            .select('bookname _id chapterIds image author categories description')
            .sort({ createdAt: -1 });
        return books;
    } catch (error) {
        throw error;
    }
};

exports.getBookById = async (bookId) => {
    try {
        const book = await Book.findById(bookId)
            .select('bookname _id chapterIds image author categories description type pushlisher ageLimit');
        if (!book) {
            throw new Error('Book not found');
        }
        return book;
    } catch (error) {
        throw error;
    }
};

exports.addBook = async (bookData) => {
    try {
        const { bookname, author, categories, type, pushlisher, image, description, ageLimit, chapterIds } = bookData;

        // Check if book with same name already exists
        const existingBook = await Book.findOne({ bookname });
        if (existingBook) {
            throw new Error('Book with this name already exists');
        }

        // Create new book
        const newBook = new Book({
            bookname,
            author,
            categories,
            type,
            pushlisher,
            image,
            description,
            ageLimit,
            chapterIds: chapterIds || []
        });

        // Save book to database
        const savedBook = await newBook.save();
        return savedBook;
    } catch (error) {
        throw error;
    }
};

exports.updateBook = async (bookId, updateData) => {
    try {
        // Check if book exists
        const existingBook = await Book.findById(bookId);
        if (!existingBook) {
            throw new Error('Book not found');
        }

        // Check if new bookname already exists (if bookname is being updated)
        if (updateData.bookname && updateData.bookname !== existingBook.bookname) {
            const bookWithSameName = await Book.findOne({ bookname: updateData.bookname });
            if (bookWithSameName) {
                throw new Error('Book with this name already exists');
            }
        }

        // Update book
        const updatedBook = await Book.findByIdAndUpdate(
            bookId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        return updatedBook;
    } catch (error) {
        throw error;
    }
};

exports.deleteBook = async (bookId) => {
    try {
        // Check if book exists
        const book = await Book.findById(bookId);
        if (!book) {
            throw new Error('Book not found');
        }

        // Delete book
        await Book.findByIdAndDelete(bookId);
        return { message: 'Book deleted successfully' };
    } catch (error) {
        throw error;
    }
};

exports.getRandomBooks = async () => {
    try {
        const randomBooks = await Book.aggregate([{ $sample: { size: 10 } }]);
        return randomBooks;
    } catch (error) {
        throw error;
    }
};
exports.getBooksByCategory = async (category) => {
    try {
        const regex = new RegExp(category, 'i'); // 'i' để không phân biệt chữ hoa - thường
        const books = await Book.find({ categories: { $regex: regex } });
        return books;
    } catch (error) {
        throw error;
    }
};
exports.getRandomBooksByCategory = async (category) => {
    try {
        const regex = new RegExp(category, 'i'); // không phân biệt hoa thường

        const books = await Book.aggregate([
            { $match: { categories: { $regex: regex } } },
            { $sample: { size: 10 } } // lấy ngẫu nhiên 10 cuốn
        ]);

        return books;
    } catch (error) {
        throw error;
    }
};

