const Book = require('../models/book.model');

exports.addBook = async (bookData) => {
    try {
        const { bookname, author, categories, price, type, pushlisher, image, viewlink, description } = bookData;

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
            price,
            type,
            pushlisher,
            image,
            viewlink,
            description
        });

        // Save book to database
        const savedBook = await newBook.save();
        return savedBook;
    } catch (error) {
        throw error;
    }
};
