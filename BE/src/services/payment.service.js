const Transaction = require('../models/transaction.model');
const crypto = require('crypto');
const querystring = require('qs');
const moment = require('moment');

class PaymentService {
    constructor() {
        this.vnp_TmnCode = process.env.VNP_TMNCODE;
        this.vnp_HashSecret = process.env.VNP_HASHSECRET;
        this.vnp_Url = process.env.VNP_URL;
        this.vnp_ReturnUrl = process.env.VNP_RETURNURL;
    }

    async createPaymentUrl(transactionData) {
        const { userId, packageId, typePackage, amount } = transactionData;

        // Tạo transaction mới
        const transaction = await Transaction.create({
            userId,
            packageId,
            typePackage,
            amount,
            status: 'pending'
        });

        // Tạo URL thanh toán VNPay
        const date = new Date();
        const createDate = moment(date).format('YYYYMMDDHHmmss');
        const orderId = moment(date).format('DDHHmmss') + transaction._id.toString();

        const vnp_Params = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: this.vnp_TmnCode,
            vnp_Locale: 'vn',
            vnp_CurrCode: 'VND',
            vnp_TxnRef: orderId,
            vnp_OrderInfo: `Thanh toan goi ${typePackage}`,
            vnp_OrderType: 'other',
            vnp_Amount: amount * 100,
            vnp_ReturnUrl: this.vnp_ReturnUrl,
            vnp_IpAddr: '127.0.0.1',
            vnp_CreateDate: createDate,
            vnp_ExpireDate: moment(date).add(15, 'minutes').format('YYYYMMDDHHmmss')
        };

        // Sắp xếp tham số theo thứ tự alphabet
        const sortedParams = this.sortObject(vnp_Params);

        // Tạo chuỗi dữ liệu để hash
        const signData = querystring.stringify(sortedParams, { encode: false });
        const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        // Thêm chữ ký vào params
        sortedParams['vnp_SecureHash'] = signed;

        // Tạo URL thanh toán
        const paymentUrl = this.vnp_Url + '?' + querystring.stringify(sortedParams, { encode: false });

        return {
            paymentUrl,
            transactionId: transaction._id
        };
    }

    async verifyPayment(vnp_Params) {
        const secureHash = vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        // Sắp xếp tham số theo thứ tự alphabet
        const sortedParams = this.sortObject(vnp_Params);

        // Tạo chuỗi dữ liệu để hash
        const signData = querystring.stringify(sortedParams, { encode: false });
        const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        // Kiểm tra chữ ký
        if (secureHash !== signed) {
            throw new Error('Invalid signature');
        }

        // Lấy thông tin giao dịch
        const orderId = vnp_Params['vnp_TxnRef'];
        const transactionId = orderId.slice(8); // Get the full transaction ID from the order reference
        const transaction = await Transaction.findById(transactionId);

        if (!transaction) {
            throw new Error('Transaction not found');
        }

        // Cập nhật trạng thái giao dịch
        transaction.status = vnp_Params['vnp_ResponseCode'] === '00' ? 'success' : 'failed';
        transaction.vnp_TransactionNo = vnp_Params['vnp_TransactionNo'];
        transaction.vnp_BankCode = vnp_Params['vnp_BankCode'];
        transaction.vnp_BankTranNo = vnp_Params['vnp_BankTranNo'];
        transaction.vnp_CardType = vnp_Params['vnp_CardType'];
        transaction.vnp_PayDate = vnp_Params['vnp_PayDate'];
        transaction.vnp_ResponseCode = vnp_Params['vnp_ResponseCode'];

        await transaction.save();

        return transaction;
    }

    sortObject(obj) {
        const sorted = {};
        const str = [];
        let key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
        }
        return sorted;
    }
}

module.exports = new PaymentService(); 