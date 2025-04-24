const historyPackageService = require('../services/historyPackage.service');

class HistoryPackageController {
    // Tạo mới history package
    async createHistoryPackage(req, res) {
        try {
            const historyPackage = await historyPackageService.createHistoryPackage(req.body);
            res.status(201).json({
                success: true,
                data: historyPackage
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Lấy tất cả history package
    async getAllHistoryPackages(req, res) {
        try {
            const historyPackages = await historyPackageService.getAllHistoryPackages();
            res.status(200).json({
                success: true,
                data: historyPackages
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Lấy history package theo ID
    async getHistoryPackageById(req, res) {
        try {
            const historyPackage = await historyPackageService.getHistoryPackageById(req.params.id);
            if (!historyPackage) {
                return res.status(404).json({
                    success: false,
                    message: 'History package not found'
                });
            }
            res.status(200).json({
                success: true,
                data: historyPackage
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Lấy history package theo user ID
    async getHistoryPackagesByUserId(req, res) {
        try {
            const historyPackages = await historyPackageService.getHistoryPackagesByUserId(req.params.userId);
            res.status(200).json({
                success: true,
                data: historyPackages
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Cập nhật history package
    async updateHistoryPackage(req, res) {
        try {
            const historyPackage = await historyPackageService.updateHistoryPackage(req.params.id, req.body);
            if (!historyPackage) {
                return res.status(404).json({
                    success: false,
                    message: 'History package not found'
                });
            }
            res.status(200).json({
                success: true,
                data: historyPackage
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Xóa history package
    async deleteHistoryPackage(req, res) {
        try {
            const historyPackage = await historyPackageService.deleteHistoryPackage(req.params.id);
            if (!historyPackage) {
                return res.status(404).json({
                    success: false,
                    message: 'History package not found'
                });
            }
            res.status(200).json({
                success: true,
                message: 'History package deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Lấy history package theo trạng thái
    async getHistoryPackagesByStatus(req, res) {
        try {
            const historyPackages = await historyPackageService.getHistoryPackagesByStatus(req.params.status);
            res.status(200).json({
                success: true,
                data: historyPackages
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Lấy history package theo loại gói
    async getHistoryPackagesByType(req, res) {
        try {
            const historyPackages = await historyPackageService.getHistoryPackagesByType(req.params.type);
            res.status(200).json({
                success: true,
                data: historyPackages
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Lấy history package theo khoảng thời gian
    async getHistoryPackagesByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const historyPackages = await historyPackageService.getHistoryPackagesByDateRange(startDate, endDate);
            res.status(200).json({
                success: true,
                data: historyPackages
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new HistoryPackageController(); 