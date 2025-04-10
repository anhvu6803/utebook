const express = require('express');
const router = express.Router();
const { MembershipPackageController } = require('../controllers/index');

// All routes are public for now
router.get('/', MembershipPackageController.getAllPackages);
router.get('/:id', MembershipPackageController.getPackageById);
router.post('/', MembershipPackageController.createPackage);
router.put('/:id', MembershipPackageController.updatePackage);
router.delete('/:id', MembershipPackageController.deletePackage);

module.exports = router; 