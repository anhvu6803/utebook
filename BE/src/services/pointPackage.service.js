const PointPackage = require('../models/pointPackage.model');

class PointPackageService {
    async createPointPackage(data) {
        try {
            const pointPackage = new PointPackage(data);
            return await pointPackage.save();
        } catch (error) {
            throw error;
        }
    }

    async getAllPointPackages() {
        try {
            return await PointPackage.find();
        } catch (error) {
            throw error;
        }
    }

    async getPointPackageById(id) {
        try {
            return await PointPackage.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async updatePointPackage(id, data) {
        try {
            return await PointPackage.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            throw error;
        }
    }

    async deletePointPackage(id) {
        try {
            return await PointPackage.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new PointPackageService(); 