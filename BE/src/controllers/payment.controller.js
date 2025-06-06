const paymentService = require('../services/payment.service');
const pointService = require('../services/point.service');
const historyPointService = require('../services/historyPoint.service');
const historyPackageService = require('../services/historyPackage.service');
const PointPackage = require('../models/pointPackage.model');
const MembershipPackage = require('../models/membershipPackage.model');
const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');

class PaymentController {
    async createPayment(req, res) {
        try {
            const { packageId, typePackage, amount, paymentMethod } = req.body;
            const userId = req.userId;

            if (!packageId || !typePackage || !amount || !paymentMethod) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields'
                });
            }

            console.log('Creating payment with data:', { packageId, typePackage, amount, paymentMethod, userId });
            const result = await paymentService.createPaymentUrl({
                userId,
                packageId,
                typePackage,
                amount,
                paymentMethod
            });

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Create payment error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    verifyPayment = async (req, res) => {
        try {
            console.log('Payment callback params:', req.query);
            const transaction = await paymentService.verifyPayment(req.query);

            if (transaction.status === 'success') {
                // Xử lý sau khi thanh toán thành công
                if (transaction.typePackage === 'point') {
                    // Lấy thông tin gói điểm
                    const pointPackage = await PointPackage.findById(transaction.packageId);
                    
                    if (!pointPackage) {
                        throw new Error('Point package not found');
                    }
                    
                    // Cập nhật điểm cho user
                    await this.updateUserPoints(transaction.userId, pointPackage);
                    
                    // Tạo lịch sử nạp điểm với transactionId
                    await this.createPointHistory(transaction.userId, pointPackage, transaction._id);
                } else if (transaction.typePackage === 'membership') {
                    // Lấy thông tin gói membership
                    const membershipPackage = await MembershipPackage.findById(transaction.packageId);
                    
                    if (!membershipPackage) {
                        throw new Error('Membership package not found');
                    }
                    
                    // Cập nhật trạng thái membership cho user
                    await this.updateUserMembership(transaction.userId, membershipPackage);
                    
                    // Lưu thông tin gói membership vào history_package
                    await this.createMembershipHistory(transaction.userId, membershipPackage, transaction._id);
                }
            }

            // Redirect về trang kết quả
            const redirectUrl = transaction.status === 'success' 
                ? `${process.env.FRONTEND_URL}/payment/success?transactionId=${transaction._id}`
                : `${process.env.FRONTEND_URL}/payment/failed?transactionId=${transaction._id}`;
            
            console.log('Redirecting to:', redirectUrl);
            return res.redirect(redirectUrl);
        } catch (error) {
            console.error('Payment verification error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    momoIPN = async (req, res) => {
        try {
            console.log('MoMo IPN params:', req.body);
            const result = await paymentService.momoIPN(req.body);
            res.status(200).json(result);
        } catch (error) {
            console.error('MoMo IPN error:', error);
            res.status(500).json({
                RspCode: 99,
                Message: error.message
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

    // Helper methods...
    updateUserPoints = async (userId, pointPackage) => {
        try {
            let userPoint = await pointService.getPointByUserId(userId);
            
            if (!userPoint) {
                await pointService.createPoint({
                    id_user: userId,
                    quantity_HoaPhuong: pointPackage.quantity_HoaPhuong,
                    quantity_La: pointPackage.quantity_La
                });
            } else {
                await pointService.updatePoint(userId, {
                    quantity_HoaPhuong: userPoint.quantity_HoaPhuong + pointPackage.quantity_HoaPhuong,
                    quantity_La: userPoint.quantity_La + pointPackage.quantity_La
                });
            }
        } catch (error) {
            console.error('Error updating user points:', error);
            throw error;
        }
    }
    
    createPointHistory = async (userId, pointPackage, transactionId) => {
        try {
            await historyPointService.createHistoryPoint({
                id_user: userId,
                type: 'Nạp',
                number_point_HoaPhuong: pointPackage.quantity_HoaPhuong,
                number_point_La: pointPackage.quantity_La,
                time: new Date(),
                transactionId: transactionId
            });
        } catch (error) {
            console.error('Error creating point history:', error);
            throw error;
        }
    }
    
    updateUserMembership = async (userId, membershipPackage) => {
        try {
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + membershipPackage.expire);
            
            await User.findByIdAndUpdate(userId, {
                isMember: true,
                membershipExpirationDate: expirationDate
            });
        } catch (error) {
            console.error('Error updating user membership:', error);
            throw error;
        }
    }

    createMembershipHistory = async (userId, membershipPackage, transactionId) => {
        try {
            await historyPackageService.createHistoryPackage({
                id_user: userId,
                packageId: membershipPackage._id,
                status: 'Thành công',
                transactionId: transactionId
            });
        } catch (error) {
            console.error('Error creating membership history:', error);
            throw error;
        }
    }
}

module.exports = new PaymentController(); 