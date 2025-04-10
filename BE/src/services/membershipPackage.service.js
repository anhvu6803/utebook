const MembershipPackage = require('../models/membershipPackage.model');

class MembershipPackageService {
    async createPackage(packageData) {
        const membershipPackage = new MembershipPackage(packageData);
        return await membershipPackage.save();
    }

    async getAllPackages() {
        return await MembershipPackage.find();
    }

    async getPackageById(id) {
        return await MembershipPackage.findById(id);
    }

    async updatePackage(id, updateData) {
        return await MembershipPackage.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
    }

    async deletePackage(id) {
        return await MembershipPackage.findByIdAndDelete(id);
    }
}

module.exports = new MembershipPackageService(); 