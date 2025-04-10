const paymentService = require('../services/payment.service');

class PaymentController {
    async createPayment(req, res) {
        try {
            const { packageId, typePackage, amount } = req.body;
            const userId = req.userId;

            const result = await paymentService.createPaymentUrl({
                userId,
                packageId,
                typePackage,
                amount
            });

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async verifyPayment(req, res) {
        try {
            const transaction = await paymentService.verifyPayment(req.query);

            if (transaction.status === 'success') {
                // Xử lý sau khi thanh toán thành công
                // Ví dụ: cập nhật trạng thái membership hoặc cộng điểm
                res.redirect(`${process.env.FRONTEND_URL}/payment/success?transactionId=${transaction._id}`);
            } else {
                res.redirect(`${process.env.FRONTEND_URL}/payment/failed?transactionId=${transaction._id}`);
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getTransaction(req, res) {
        try {
            const { transactionId } = req.params;
            const transaction = await Transaction.findById(transactionId);

            if (!transaction) {
                return res.status(404).json({
                    success: false,
                    message: 'Transaction not found'
                });
            }

            res.json({
                success: true,
                data: transaction
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new PaymentController(); 