const Book = require('../models/book.model');
const mongoose = require('mongoose');
const { findById } = require('../models/user.model');

exports.getAllBook = async () => {
    let books;
    try {
        books = await Book.find({});
        console.log(books)
        return books.map(book => book.toObject({ getters: true }));
    } catch (err) {
        throw new Error('Something went wrong, could not find a book.', 500);
    }
}

exports.getOneBook = async (bookId) => {
    let book;
    try {
        book = await Book.findById(bookId);
        return book.toObject({ getters: true });
    } catch (err) {
        throw new Error('Something went wrong, could not find a book.', 500);
    }
}

exports.getBookByCategory = async (category) => {
    let books;
    try {
        books = await Book.find({ categories: category });
        return books.map(book => book.toObject({ getters: true }));
    } catch (err) {
        throw new Error('Something went wrong, could not find a book.', 500);
    }
}

exports.addBook = async (bookdata) => {
    const { bookname, author, categories, price,
        statusbook, brief, wordcontents, audios } = bookdata;


    const existingBook = await Book.findOne({ bookname });
    if (existingBook) {
        throw new Error('Bookname already exists', 500);
    }

    const addedBook = new Book({
        bookname,
        author,
        categories,
        price,
        statusbook,
        brief,
        wordcontents,
        audios
    });

    return await addedBook.save();
};

exports.updateBook = async (bookId, bookdata) => {
    const { bookname, author, categories, price,
        statusbook, brief, wordcontents, audios } = bookdata;

    let book;
    try {
        book = await Book.findById(bookId);
    } catch (err) {
        throw new Error('Could not find book by id', 500);
    }

    book.bookname = bookname;
    book.author = author;
    book.categories = categories;
    book.price = price;
    book.statusbook = statusbook;
    book.brief = brief;
    book.wordcontents = wordcontents;
    book.audios = audios

    return await book.save();
};

exports.deleteBook = async (bookId) => {
    let book;
    try {
        book = await Book.findById(bookId);
    } catch (err) {
        throw new Error('Something went wrong, could not delete book.', 404);
    }

    if (!book) {
        throw new Error('Could not find book for this id.', 404);
    }

    const sess = await mongoose.startSession();
    try {
        sess.startTransaction();
        await book.deleteOne({ session: sess });
        await sess.commitTransaction();
        sess.endSession();
        return 'Delete book successfull';

    } catch (err) {
        await sess.abortTransaction();
        sess.endSession();
        throw new Error('Something went wrong, could not delete book.', 404);
    }
};