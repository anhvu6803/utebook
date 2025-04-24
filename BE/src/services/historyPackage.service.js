const HistoryPackage = require('../models/history_package.model');

class HistoryPackageService {
    // Tạo mới history package
    async createHistoryPackage(data) {
        try {
            const historyPackage = new HistoryPackage(data);
            return await historyPackage.save();
        } catch (error) {
            throw error;
        }
    }

    // Lấy tất cả history package
    async getAllHistoryPackages() {
        try {
            return await HistoryPackage.find()
                .populate('id_user', 'username fullname email')
                .populate('packageId')
                .populate('transactionId')
                .sort({ createdAt: -1 });
        } catch (error) {
            throw error;
        }
    }

    // Lấy history package theo ID
    async getHistoryPackageById(id) {
        try {
            return await HistoryPackage.findById(id)
                .populate('id_user', 'username fullname email')
                .populate('packageId')
                .populate('transactionId');
        } catch (error) {
            throw error;
        }
    }

    // Lấy history package theo user ID
    async getHistoryPackagesByUserId(userId) {
        try {
            return await HistoryPackage.find({ id_user: userId })
                .populate('packageId')
                .populate('transactionId')
                .sort({ createdAt: -1 });
        } catch (error) {
            throw error;
        }
    }

    // Cập nhật history package
    async updateHistoryPackage(id, data) {
        try {
            return await HistoryPackage.findByIdAndUpdate(
                id,
                data,
                { new: true }
            ).populate('id_user', 'username fullname email')
             .populate('packageId')
             .populate('transactionId');
        } catch (error) {
            throw error;
        }
    }

    // Xóa history package
    async deleteHistoryPackage(id) {
        try {
            return await HistoryPackage.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }

    // Lấy history package theo trạng thái
    async getHistoryPackagesByStatus(status) {
        try {
            return await HistoryPackage.find({ status })
                .populate('id_user', 'username fullname email')
                .populate('packageId')
                .populate('transactionId')
                .sort({ createdAt: -1 });
        } catch (error) {
            throw error;
        }
    }

    // Lấy history package theo loại gói
    async getHistoryPackagesByType(typePackage) {
        try {
            return await HistoryPackage.find({ typePackage })
                .populate('id_user', 'username fullname email')
                .sort({ createdAt: -1 });
        } catch (error) {
            throw error;
        }
    }

    // Lấy history package theo khoảng thời gian
    async getHistoryPackagesByDateRange(startDate, endDate) {
        try {
            return await HistoryPackage.find({
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            })
            .populate('id_user', 'username fullname email')
            .sort({ createdAt: -1 });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new HistoryPackageService(); 