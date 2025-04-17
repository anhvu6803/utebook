const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    bookname: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    categories: [{ type: String, required: true }],
    price: { type: Number, required: true },
    type: { type: String, required: true },
    pushlisher: { type: String, required: true },
    image: { type: String, required: true },
    viewlink: { type: String, required: true },
    description: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);
