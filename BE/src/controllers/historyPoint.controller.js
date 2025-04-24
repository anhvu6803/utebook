const historyPointService = require('../services/historyPoint.service');
const pointService = require('../services/point.service');

const historyPointController = {
    // Create a new history point record
    async createHistoryPoint(req, res) {
        try {
            const historyPointData = req.body;
            const newHistoryPoint = await historyPointService.createHistoryPoint(historyPointData);
            
            // Update point based on history
            await updatePointBasedOnHistory(newHistoryPoint);
            
            res.status(201).json({
                success: true,
                data: newHistoryPoint
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Get all history points
    async getAllHistoryPoints(req, res) {
        try {
            const historyPoints = await historyPointService.getAllHistoryPointsWithUserInfo();
            res.status(200).json({
                success: true,
                data: historyPoints
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Get history points by user ID
    async getHistoryPointsByUserId(req, res) {
        try {
            const { userId } = req.params;
            const historyPoints = await historyPointService.getHistoryPointsByUserIdWithUserInfo(userId);
            res.status(200).json({
                success: true,
                data: historyPoints
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Get history point by ID
    async getHistoryPointById(req, res) {
        try {
            const { id } = req.params;
            const historyPoint = await historyPointService.getHistoryPointByIdWithUserInfo(id);
            
            if (!historyPoint) {
                return res.status(404).json({
                    success: false,
                    message: 'History point not found'
                });
            }
            
            res.status(200).json({
                success: true,
                data: historyPoint
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Update history point by ID
    async updateHistoryPoint(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            
            // Get the original history point to check if type has changed
            const originalHistoryPoint = await historyPointService.getHistoryPointById(id);
            
            if (!originalHistoryPoint) {
                return res.status(404).json({
                    success: false,
                    message: 'History point not found'
                });
            }
            
            // If type has changed, reverse the original point change
            if (updateData.type && updateData.type !== originalHistoryPoint.type) {
                await reversePointChange(originalHistoryPoint);
            }
            
            // Update the history point
            const updatedHistoryPoint = await historyPointService.updateHistoryPoint(id, updateData);
            
            // If type has changed, apply the new point change
            if (updateData.type && updateData.type !== originalHistoryPoint.type) {
                await updatePointBasedOnHistory(updatedHistoryPoint);
            }
            
            res.status(200).json({
                success: true,
                data: updatedHistoryPoint
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Delete history point by ID
    async deleteHistoryPoint(req, res) {
        try {
            const { id } = req.params;
            
            // Get the history point to reverse the point change
            const historyPoint = await historyPointService.getHistoryPointById(id);
            
            if (!historyPoint) {
                return res.status(404).json({
                    success: false,
                    message: 'History point not found'
                });
            }
            
            // Reverse the point change
            await reversePointChange(historyPoint);
            
            // Delete the history point
            const deletedHistoryPoint = await historyPointService.deleteHistoryPoint(id);
            
            res.status(200).json({
                success: true,
                data: deletedHistoryPoint
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

// Helper function to update point based on history
async function updatePointBasedOnHistory(historyPoint) {
    try {
        const userId = historyPoint.id_user;
        const type = historyPoint.type;
        const pointChange = historyPoint.number_point_HoaPhuong || 0;
        
        // Get current point record
        let pointRecord = await pointService.getPointByUserId(userId);
        
        // If no point record exists, create one
        if (!pointRecord) {
            pointRecord = await pointService.createPoint({
                id_user: userId,
                point_HoaPhuong: 0,
                point_La: 0
            });
        }
        
        // Update point based on type
        let newPointBalance = pointRecord.point_HoaPhuong;
        
        if (type === 'Nạp' || type === 'Thu Nhập') {
            // Add points for deposit and income
            newPointBalance += pointChange;
        } else if (type === 'Đọc') {
            // Subtract points for reading
            newPointBalance -= pointChange;
            
            // Ensure balance doesn't go below zero
            if (newPointBalance < 0) {
                newPointBalance = 0;
            }
        }
        
        // Update point record
        await pointService.updatePoint(pointRecord._id, {
            point_HoaPhuong: newPointBalance
        });
        
        return true;
    } catch (error) {
        console.error('Error updating point based on history:', error);
        throw error;
    }
}

// Helper function to reverse point change
async function reversePointChange(historyPoint) {
    try {
        const userId = historyPoint.id_user;
        const type = historyPoint.type;
        const pointChange = historyPoint.number_point_HoaPhuong || 0;
        
        // Get current point record
        const pointRecord = await pointService.getPointByUserId(userId);
        
        if (!pointRecord) {
            throw new Error('Point record not found for user');
        }
        
        // Reverse point change based on type
        let newPointBalance = pointRecord.point_HoaPhuong;
        
        if (type === 'Nạp' || type === 'Thu Nhập') {
            // Subtract points for deposit and income reversal
            newPointBalance -= pointChange;
        } else if (type === 'Đọc') {
            // Add points for reading reversal
            newPointBalance += pointChange;
        }
        
        // Ensure balance doesn't go below zero
        if (newPointBalance < 0) {
            newPointBalance = 0;
        }
        
        // Update point record
        await pointService.updatePoint(pointRecord._id, {
            point_HoaPhuong: newPointBalance
        });
        
        return true;
    } catch (error) {
        console.error('Error reversing point change:', error);
        throw error;
    }
}

module.exports = historyPointController; 