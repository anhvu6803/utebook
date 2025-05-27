const express = require('express');
const router = express.Router();
const { PaymentController } = require('../controllers/index');
const { authMiddleware } = require('../middleware/auth.middleware');
// Tạo URL thanh toán
router.post('/create',authMiddleware, PaymentController.createPayment);

// Xác thực thanh toán từ VNPay
router.get('/vnpay-return', PaymentController.verifyPayment);

// Xác thực thanh toán từ MoMo
router.get('/momo-return', (req, res, next) => {
    console.log('MoMo return callback received:', req.query);
    PaymentController.verifyPayment(req, res, next);
});

router.get('/momo-callback', (req, res, next) => {
    console.log('MoMo callback received:', req.query);
    PaymentController.verifyPayment(req, res, next);
});

router.get('/', (req, res, next) => {
    console.log('Root callback received:', req.query);
    PaymentController.verifyPayment(req, res, next);
});

router.post('/momo-ipn', PaymentController.momoIPN);

// Lấy thông tin giao dịch
router.get('/transaction/:transactionId',authMiddleware, PaymentController.getTransaction);

module.exports = router; 