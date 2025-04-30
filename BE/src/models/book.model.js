const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    bookname: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    categories: { type: [String], required: true },
    type: { type: String, enum: ['Free', 'Member','HoaPhuong'], required: true },
    pushlisher: { type: String },
    image: { type: String, required: true },
    description: { type: String},
    chapterIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }],
    ageLimit: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);
