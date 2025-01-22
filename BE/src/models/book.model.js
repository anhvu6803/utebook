const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    bookname: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    categories: [{ type: String, required: true }],
    price: { type: Number, required: true },
    statusbook: { type: Boolean, required: true },
    brief: { type: String, required: true },
    wordcontents:  { type: String, required: true },
    audios:  { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);
