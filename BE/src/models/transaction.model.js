const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    typePackage: {
        type: String,
        enum: ['membership', 'point'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['vnpay', 'momo'],
        required: true
    },
    // VNPay fields
    vnp_TransactionNo: {
        type: String
    },
    vnp_BankCode: {
        type: String
    },
    vnp_BankTranNo: {
        type: String
    },
    vnp_CardType: {
        type: String
    },
    vnp_PayDate: {
        type: String
    },
    vnp_ResponseCode: {
        type: String
    },
    // MoMo fields
    momo_RequestId: {
        type: String
    },
    momo_OrderId: {
        type: String
    },
    momo_TransId: {
        type: String
    },
    momo_ResultCode: {
        type: String
    },
    momo_Message: {
        type: String
    },
    momo_PayType: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema); 