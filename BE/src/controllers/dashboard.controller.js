const dashboardService = require('../services/dashboard.service');

const dashboardController = {
    async getDashboardStatistics(req, res) {
        try {
            const statistics = await dashboardService.getDashboardStatistics();
            res.status(200).json({
                success: true,
                data: statistics
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = dashboardController; 