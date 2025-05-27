const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    bookname: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    categories: { type: [String], required: true },
    type: { type: String, enum: ['Free', 'Member', 'HoaPhuong'], required: true },
    pushlisher: { type: String },
    image: { type: String, required: true },
    description: { type: String },
    chapterIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }],
    ageLimit: { type: Number, required: true },
    listUserFavorited: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    listReading: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HistoryReading',
        default: []
    }],
    listReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
        default: []
    }],
    rating: { type: Number, default: 0 },
    avegradeRate: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);