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
        const book = await Book.findById(bookId);

        if (!book) {
            throw new Error('Book not found');
        }

        // Chỉ populate nếu listReviews có ít nhất 1 phần tử
        if (book.listReviews && book.listReviews.length > 0) {
            await book.populate({
                path: 'listReviews',
                populate: {
                    path: 'userId',         // Đây là field trong Review
                    select: 'fullname avatar'   // Chọn những field bạn cần (tuỳ schema)
                }
            });
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
        const randomBooks = await Book.find();
        const shuffled = randomBooks.sort(() => 0.5 - Math.random()); // trộn ngẫu nhiên
        return shuffled.slice(0, 10); // lấy 10 cuốn đầu tiên
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

        const books = await Book.find({ categories: { $regex: regex } });

        const shuffled = books.sort(() => 0.5 - Math.random()); // trộn ngẫu nhiên
        return shuffled.slice(0, 10);
    } catch (error) {
        throw error;
    }
};

exports.getBooksByType = async (type) => {
    try {
        const regex = new RegExp(type, 'i'); // 'i' để không phân biệt chữ hoa - thường
        const books = await Book.find({ type: { $regex: regex } });
        return books;
    } catch (error) {
        throw error;
    }
};
exports.getTypeBooksByCategory = async (category, type) => {
    try {
        const regex = new RegExp(category, 'i'); // 'i' để không phân biệt chữ hoa - thường
        const regexType = new RegExp(type, 'i');
        const books = await Book.find({
            categories: { $regex: regex },
            type: { $regex: regexType }
        });
        return books;
    } catch (error) {
        throw error;
    }
};
exports.getBooksByCategoryNewest = async (category) => {
    try {
        const regex = new RegExp(category, 'i'); // 'i' để không phân biệt chữ hoa - thường
        const books = await Book.find({ categories: { $regex: regex } })
            .sort({ updatedAt: -1 })
            .limit(90);

        return books;
    } catch (error) {
        throw error;
    }
};

exports.searchBooksByText = async (text, category) => {
    try {
        if (!text) return [];

        const regexCategory = new RegExp(category, 'i');

        const booksByCategory = await Book.find({ categories: { $regex: regexCategory } });

        const filteredBooks = booksByCategory.filter(book => book.bookname.toLowerCase().includes(text.toLowerCase()));

        const shuffled = filteredBooks.sort(() => 0.5 - Math.random()); // trộn ngẫu nhiên
        console.log(shuffled);
        return shuffled.slice(0, 6);
    } catch (error) {
        throw error;
    }
};

