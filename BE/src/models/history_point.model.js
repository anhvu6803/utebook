const mongoose = require('mongoose');

const historyPointSchema = new mongoose.Schema({
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['Nạp', 'Đọc', 'Thu nhập'],
        required: true
    },
    number_point_HoaPhuong: {
        type: Number,
        required: true
    },
    number_point_La: {
        type: Number,
        default: 0
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: function() {
            return this.type === 'Đọc' || this.type === 'Thu nhập';
        }
    },
    time: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Thành công', 'Đang xử lý'],
        default: 'Thành công'
    },
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        required: function() {
            return this.type === 'Nạp';
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('HistoryPoint', historyPointSchema); 