const pointService = require('../services/point.service');

const pointController = {
    // Create a new point record
    async createPoint(req, res) {
        try {
            const pointData = req.body;
            
            // Check if point record already exists for this user
            const existingPoint = await pointService.getPointByUserId(pointData.id_user);
            
            if (existingPoint) {
                return res.status(400).json({ 
                    error: 'Point record already exists for this user. Use update instead.' 
                });
            }
            
            const point = await pointService.createPoint(pointData);
            res.status(201).json({
                message: 'Point created successfully',
                point
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Get all points
    async getAllPoints(req, res) {
        try {
            const points = await pointService.getAllPoints();
            res.status(200).json(points);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get point by user ID
    async getPointByUserId(req, res) {
        try {
            const { userId } = req.params;
            const point = await pointService.getPointByUserId(userId);
            
            if (!point) {
                return res.status(404).json({ message: 'Point not found' });
            }
            
            res.status(200).json(point);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update point by user ID
    async updatePoint(req, res) {
        try {
            const { userId } = req.params;
            const updateData = req.body;
            
            // Ensure we're not updating the user ID
            if (updateData.id_user) {
                delete updateData.id_user;
            }
            
            const result = await pointService.updatePoint(userId, updateData);
            
            if (!result) {
                return res.status(404).json({ message: 'Point not found' });
            }
            
            res.status(200).json({
                message: 'Point updated successfully',
                point: result
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Delete point by user ID
    async deletePoint(req, res) {
        try {
            const { userId } = req.params;
            const result = await pointService.deletePoint(userId);
            
            if (!result) {
                return res.status(404).json({ message: 'Point not found' });
            }
            
            res.status(200).json({ message: 'Point deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = pointController; 