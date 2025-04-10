const pointPackageService = require('../services/pointPackage.service');

class PointPackageController {
    async createPointPackage(req, res) {
        try {
            const pointPackage = await pointPackageService.createPointPackage(req.body);
            res.status(201).json(pointPackage);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getAllPointPackages(req, res) {
        try {
            const pointPackages = await pointPackageService.getAllPointPackages();
            res.status(200).json(pointPackages);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getPointPackageById(req, res) {
        try {
            const pointPackage = await pointPackageService.getPointPackageById(req.params.id);
            if (!pointPackage) {
                return res.status(404).json({ message: 'Point package not found' });
            }
            res.status(200).json(pointPackage);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updatePointPackage(req, res) {
        try {
            const pointPackage = await pointPackageService.updatePointPackage(req.params.id, req.body);
            if (!pointPackage) {
                return res.status(404).json({ message: 'Point package not found' });
            }
            res.status(200).json(pointPackage);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deletePointPackage(req, res) {
        try {
            const pointPackage = await pointPackageService.deletePointPackage(req.params.id);
            if (!pointPackage) {
                return res.status(404).json({ message: 'Point package not found' });
            }
            res.status(200).json({ message: 'Point package deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new PointPackageController(); 