const Point = require('../models/point.model');

const pointService = {
    // Create a new point record
    async createPoint(pointData) {
        try {
            // Check if point already exists for this user
            const existingPoint = await Point.findOne({ id_user: pointData.id_user });
            
            if (existingPoint) {
                throw new Error('Point record already exists for this user');
            }
            
            const newPoint = new Point(pointData);
            return await newPoint.save();
        } catch (error) {
            throw error;
        }
    },

    // Get all points
    async getAllPoints() {
        try {
            return await Point.find();
        } catch (error) {
            throw error;
        }
    },

    // Get point by user ID
    async getPointByUserId(userId) {
        try {
            return await Point.findOne({ id_user: userId });
        } catch (error) {
            throw error;
        }
    },

    // Update point by user ID
    async updatePoint(userId, updateData) {
        try {
            const updatedPoint = await Point.findOneAndUpdate(
                { id_user: userId },
                updateData,
                { new: true, runValidators: true }
            );
            
            return updatedPoint;
        } catch (error) {
            throw error;
        }
    },

    // Delete point by user ID
    async deletePoint(userId) {
        try {
            const deletedPoint = await Point.findOneAndDelete({ id_user: userId });
            return deletedPoint;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = pointService; 