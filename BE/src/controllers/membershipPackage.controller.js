const membershipPackageService = require('../services/membershipPackage.service');

class MembershipPackageController {
    async createPackage(req, res) {
        try {
            const packageData = req.body;
            const newPackage = await membershipPackageService.createPackage(packageData);
            
            res.status(201).json({
                success: true,
                data: newPackage
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getAllPackages(req, res) {
        try {
            const packages = await membershipPackageService.getAllPackages();
            
            res.json({
                success: true,
                data: packages
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getPackageById(req, res) {
        try {
            const { id } = req.params;
            const membershipPackage = await membershipPackageService.getPackageById(id);
            
            if (!membershipPackage) {
                return res.status(404).json({
                    success: false,
                    message: 'Package not found'
                });
            }

            res.json({
                success: true,
                data: membershipPackage
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async updatePackage(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            
            const updatedPackage = await membershipPackageService.updatePackage(id, updateData);
            
            if (!updatedPackage) {
                return res.status(404).json({
                    success: false,
                    message: 'Package not found'
                });
            }

            res.json({
                success: true,
                data: updatedPackage
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async deletePackage(req, res) {
        try {
            const { id } = req.params;
            const deletedPackage = await membershipPackageService.deletePackage(id);
            
            if (!deletedPackage) {
                return res.status(404).json({
                    success: false,
                    message: 'Package not found'
                });
            }

            res.json({
                success: true,
                data: deletedPackage
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new MembershipPackageController(); 