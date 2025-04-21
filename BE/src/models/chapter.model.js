const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
    chapterName: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    viewlink: { type: String, required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Chapter', ChapterSchema);
