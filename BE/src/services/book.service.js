const Book = require('../models/book.model');

exports.getAllBooks = async () => {
    try {
        const books = await Book.find()
            .select('bookname _id')
            .sort({ createdAt: -1 });
        return books;
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
