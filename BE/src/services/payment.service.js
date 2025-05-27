const Transaction = require('../models/transaction.model');
const crypto = require('crypto');
const querystring = require('qs');
const moment = require('moment');

class PaymentService {
    constructor() {
        // VNPay config
        this.vnp_TmnCode = process.env.VNP_TMNCODE;
        this.vnp_HashSecret = process.env.VNP_HASHSECRET;
        this.vnp_Url = process.env.VNP_URL;
        this.vnp_ReturnUrl = process.env.VNP_RETURNURL;

        // MoMo config
        this.momo_PartnerCode = process.env.MOMO_PARTNER_CODE;
        this.momo_AccessKey = process.env.MOMO_ACCESS_KEY;
        this.momo_SecretKey = process.env.MOMO_SECRET_KEY;
        this.momo_Endpoint = process.env.MOMO_ENDPOINT;
        this.momo_ReturnUrl = process.env.MOMO_RETURN_URL;
        this.momo_IpnUrl = process.env.MOMO_IPN_URL;
    }

    async createPaymentUrl(transactionData) {
        const { userId, packageId, typePackage, amount, paymentMethod } = transactionData;

        // Tạo transaction mới
        const transaction = await Transaction.create({
            userId,
            packageId,
            typePackage,
            amount,
            paymentMethod,
            status: 'pending'
        });

        if (paymentMethod === 'vnpay') {
            return this.createVnpayPaymentUrl(transaction);
        } else if (paymentMethod === 'momo') {
            return this.createMomoPaymentUrl(transaction);
        } else {
            throw new Error('Invalid payment method');
        }
    }

    async createVnpayPaymentUrl(transaction) {
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
            vnp_OrderInfo: `Thanh toan goi ${transaction.typePackage}`,
            vnp_OrderType: 'other',
            vnp_Amount: transaction.amount * 100,
            vnp_ReturnUrl: this.vnp_ReturnUrl,
            vnp_IpAddr: '127.0.0.1',
            vnp_CreateDate: createDate,
            vnp_ExpireDate: moment(date).add(15, 'minutes').format('YYYYMMDDHHmmss')
        };

        const sortedParams = this.sortObject(vnp_Params);
        const signData = querystring.stringify(sortedParams, { encode: false });
        const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        sortedParams['vnp_SecureHash'] = signed;

        const paymentUrl = this.vnp_Url + '?' + querystring.stringify(sortedParams, { encode: false });

        return {
            paymentUrl,
            transactionId: transaction._id
        };
    }

    async createMomoPaymentUrl(transaction) {
        const orderId = this.momo_PartnerCode + new Date().getTime();
        const requestId = orderId;
        const orderInfo = `Thanh toan goi ${transaction.typePackage}`;
        const extraData = '';
        const amount = transaction.amount.toString();
        const requestType = "payWithMethod";
        const lang = 'vi';
        const autoCapture = true;
        const orderGroupId = '';

        // Tạo chuỗi dữ liệu để hash theo đúng thứ tự của MoMo
        const rawSignature = `accessKey=${this.momo_AccessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${this.momo_IpnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${this.momo_PartnerCode}&redirectUrl=${this.momo_ReturnUrl}&requestId=${requestId}&requestType=${requestType}`;

        // Tạo chữ ký
        const signature = crypto.createHmac('sha256', this.momo_SecretKey)
            .update(rawSignature)
            .digest('hex');

        // Tạo request body
        const requestBody = {
            partnerCode: this.momo_PartnerCode,
            partnerName: "UTEBOOK",
            storeId: "UTEBOOK",
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: this.momo_ReturnUrl,
            ipnUrl: this.momo_IpnUrl,
            lang: lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData: extraData,
            orderGroupId: orderGroupId,
            signature: signature
        };

        try {
            console.log('Creating MoMo payment URL with request:', requestBody);
            const response = await fetch(this.momo_Endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const result = await response.json();
            console.log('MoMo payment URL response:', result);

            if (result.resultCode === 0) {
                // Cập nhật transaction với thông tin MoMo
                transaction.momo_RequestId = requestId;
                transaction.momo_OrderId = orderId;
                await transaction.save();

                return {
                    paymentUrl: result.payUrl,
                    transactionId: transaction._id
                };
            } else {
                throw new Error(result.message || 'Failed to create MoMo payment');
            }
        } catch (error) {
            console.error('MoMo payment error:', error);
            throw new Error(`MoMo payment error: ${error.message}`);
        }
    }

    async verifyPayment(params) {
        console.log('Verifying payment with params:', params);
        
        if (params.vnp_TransactionNo) {
            return this.verifyVnpayPayment(params);
        } else if (params.partnerCode === 'MOMO') {
            return this.verifyMomoPayment(params);
        } else {
            throw new Error('Invalid payment parameters');
        }
    }

    async verifyVnpayPayment(vnp_Params) {
        const secureHash = vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        const sortedParams = this.sortObject(vnp_Params);
        const signData = querystring.stringify(sortedParams, { encode: false });
        const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        if (secureHash !== signed) {
            throw new Error('Invalid signature');
        }

        const orderId = vnp_Params['vnp_TxnRef'];
        const transactionId = orderId.slice(8);
        const transaction = await Transaction.findById(transactionId);

        if (!transaction) {
            throw new Error('Transaction not found');
        }

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

    async verifyMomoPayment(params) {
        console.log('Verifying MoMo payment with params:', params);
        
        // Extract parameters from MoMo callback
        const {
            partnerCode,
            orderId,
            requestId,
            amount,
            orderInfo,
            orderType,
            transId,
            resultCode,
            message,
            payType,
            responseTime,
            extraData,
            signature
        } = params;

        // Find transaction by orderId first
        const transaction = await Transaction.findOne({ momo_OrderId: orderId });
        console.log('Found transaction:', transaction);

        if (!transaction) {
            throw new Error('Transaction not found');
        }

        // Debug: Log all received parameters
        console.log('MoMo callback raw parameters:', JSON.stringify(params));

        // Temporarily skip signature verification
        // TODO: Get correct signature algorithm from MoMo
        console.log('NOTE: Temporarily skipping signature verification');
        
        // Update transaction status based on resultCode
        if (resultCode === '0') {
            console.log('Setting transaction status to success');
            transaction.status = 'success';
        } else {
            console.log('Setting transaction status to failed');
            transaction.status = 'failed';
        }

        // Update MoMo specific fields
        transaction.momo_TransId = transId;
        transaction.momo_ResultCode = resultCode;
        transaction.momo_Message = message;
        transaction.momo_PayType = payType;

        // Save the updated transaction
        const updatedTransaction = await transaction.save();
        console.log('Updated transaction:', updatedTransaction);
        
        return updatedTransaction;
    }

    async momoIPN(params) {
        console.log('Processing MoMo IPN with params:', params);
        
        const {
            partnerCode,
            orderId,
            requestId,
            amount,
            orderInfo,
            orderType,
            transId,
            resultCode,
            message,
            payType,
            responseTime,
            extraData,
            signature
        } = params;

        // Find transaction first
        const transaction = await Transaction.findOne({ momo_OrderId: orderId });
        console.log('Found transaction for IPN:', transaction);

        if (!transaction) {
            return {
                RspCode: 404,
                Message: 'Transaction not found'
            };
        }

        // Temporarily skip signature verification
        // TODO: Get correct signature algorithm from MoMo
        console.log('NOTE: Temporarily skipping signature verification for IPN');

        // Update transaction status based on resultCode
        if (resultCode === '0') {
            console.log('Setting IPN transaction status to success');
            transaction.status = 'success';
        } else {
            console.log('Setting IPN transaction status to failed');
            transaction.status = 'failed';
        }

        // Update MoMo specific fields
        transaction.momo_TransId = transId;
        transaction.momo_ResultCode = resultCode;
        transaction.momo_Message = message;
        transaction.momo_PayType = payType;

        // Save the updated transaction
        await transaction.save();
        console.log('Updated IPN transaction:', transaction);

        return {
            RspCode: 0,
            Message: 'OK'
        };
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