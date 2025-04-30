const mongoose = require('mongoose');

const historyPackageSchema = new mongoose.Schema({
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MembershipPackage',
        required: true
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

module.exports = mongoose.model('HistoryPackage', historyPackageSchema); 