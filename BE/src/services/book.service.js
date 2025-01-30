const Book = require('../models/book.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

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
    console.log(addedBook)
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

exports.addCreateBook = async (bookdata) => {
    const { bookname, author, categories, price,
        statusbook, brief, wordcontents, audios } = bookdata;


    const existingBook = await Book.findOne({ bookname });
    if (existingBook) {
        throw new Error('Bookname already exists', 500);
    }

    const user = await User.findById(author);
    if (!user) {
        throw new Error('Bookname have not exists', 500);
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

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await addedBook.save({ session: sess });
        user.sachSangTac.push(addedBook);
        await user.save({ session: sess });
        await sess.commitTransaction();

        return addedBook;
    } catch (err) {
        throw new Error('Creating book failed, please try again.', 500);
    }
};

exports.deleteCreateBook = async (bookId) => {
    let book, user;
    try {
        book = await Book.findById(bookId);
        user = await User.findById(book.author);
    } catch (err) {
        throw new Error('Something went wrong, could not delete book.', 404);
    }

    if (!book) {
        throw new Error('Could not find book for this id.', 404);
    }

    if (!user) {
        throw new Error('Could not find user for this id.', 404);
    }

    const sess = await mongoose.startSession();
    try {
        sess.startTransaction();
        await book.deleteOne({ session: sess });
        user.sachSangTac.pull(bookId);
        await user.save();
        await sess.commitTransaction();
        sess.endSession();
        return 'Delete create book successfull';

    } catch (err) {
        await sess.abortTransaction();
        sess.endSession();
        throw new Error('Something went wrong, could not delete book.', 404);
    }
};
