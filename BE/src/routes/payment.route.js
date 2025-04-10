const express = require('express');
const router = express.Router();
const { PaymentController } = require('../controllers/index');
const { authMiddleware } = require('../middleware/auth.middleware');
// Tạo URL thanh toán
router.post('/create',authMiddleware, PaymentController.createPayment);

// Xác thực thanh toán từ VNPay
router.get('/vnpay-return', PaymentController.verifyPayment);

// Lấy thông tin giao dịch
router.get('/transaction/:transactionId',authMiddleware, PaymentController.getTransaction);

module.exports = router; 