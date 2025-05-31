const User = require('../models/user.model');
const Book = require('../models/book.model');
const Transaction = require('../models/transaction.model');
const MembershipPackage = require('../models/membershipPackage.model');
const PointPackage = require('../models/pointPackage.model');

const dashboardService = {
    async getDashboardStatistics() {
        try {
            // Get total users count
            const totalUsers = await User.countDocuments();

            // Get total books count
            const totalBooks = await Book.countDocuments();

            // Get total active members
            const activeMembers = await User.countDocuments({
                isMember: true,
                membershipExpirationDate: { $gt: new Date() }
            });

            // Get total revenue from successful transactions
            const totalRevenue = await Transaction.aggregate([
                {
                    $match: {
                        status: 'success'
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: '$amount' },
                        totalTransactions: { $sum: 1 }
                    }
                }
            ]);

            // Get membership package statistics
            const membershipPackageStats = await Transaction.aggregate([
                {
                    $match: {
                        status: 'success',
                        typePackage: 'membership'
                    }
                },
                {
                    $group: {
                        _id: '$packageId',
                        count: { $sum: 1 },
                        totalAmount: { $sum: '$amount' }
                    }
                },
                {
                    $lookup: {
                        from: 'membershippackages',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'packageInfo'
                    }
                },
                {
                    $unwind: '$packageInfo'
                },
                {
                    $project: {
                        packageName: '$packageInfo.name',
                        packageDescription: '$packageInfo.description',
                        packagePrice: '$packageInfo.price',
                        packageExpire: '$packageInfo.expire',
                        typePackage: 'membership',
                        count: 1,
                        totalAmount: 1,
                        totalPrice: { $multiply: ['$packageInfo.price', '$count'] }
                    }
                }
            ]);

            // Get point package statistics
            const pointPackageStats = await Transaction.aggregate([
                {
                    $match: {
                        status: 'success',
                        typePackage: 'point'
                    }
                },
                {
                    $group: {
                        _id: '$packageId',
                        count: { $sum: 1 },
                        totalAmount: { $sum: '$amount' }
                    }
                },
                {
                    $lookup: {
                        from: 'pointpackages',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'packageInfo'
                    }
                },
                {
                    $unwind: '$packageInfo'
                },
                {
                    $project: {
                        packageName: '$packageInfo.name',
                        packageDescription: '$packageInfo.description',
                        packagePrice: '$packageInfo.price',
                        pointAmount: '$packageInfo.point',
                        typePackage: 'point',
                        count: 1,
                        totalAmount: 1,
                        totalPrice: { $multiply: ['$packageInfo.price', '$count'] },
                        totalPoints: { $multiply: ['$packageInfo.point', '$count'] }
                    }
                }
            ]);

            // Get payment method statistics
            const paymentStats = await Transaction.aggregate([
                {
                    $match: {
                        status: 'success'
                    }
                },
                {
                    $group: {
                        _id: '$paymentMethod',
                        count: { $sum: 1 },
                        totalAmount: { $sum: '$amount' }
                    }
                }
            ]);

            return {
                totalUsers,
                totalBooks,
                activeMembers,
                revenue: {
                    totalAmount: totalRevenue[0]?.totalAmount || 0,
                    totalTransactions: totalRevenue[0]?.totalTransactions || 0
                },
                packageStatistics: {
                    membership: membershipPackageStats.map(stat => ({
                        ...stat,
                        averagePrice: stat.totalAmount / stat.count,
                        discount: stat.totalPrice - stat.totalAmount
                    })),
                    point: pointPackageStats.map(stat => ({
                        ...stat,
                        averagePrice: stat.totalAmount / stat.count,
                        discount: stat.totalPrice - stat.totalAmount,
                        averagePoints: stat.totalPoints / stat.count
                    }))
                },
                paymentStatistics: paymentStats.map(stat => ({
                    method: stat._id,
                    count: stat.count,
                    totalAmount: stat.totalAmount
                }))
            };
        } catch (error) {
            throw new Error(`Failed to get dashboard statistics: ${error.message}`);
        }
    }
};

module.exports = dashboardService;