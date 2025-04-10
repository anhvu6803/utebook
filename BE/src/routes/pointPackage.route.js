const express = require('express');
const router = express.Router();
const { PointPackageController } = require('../controllers/index');

// Create a new point package
router.post('/', PointPackageController.createPointPackage);

// Get all point packages
router.get('/', PointPackageController.getAllPointPackages);

// Get a single point package by id
router.get('/:id', PointPackageController.getPointPackageById);

// Update a point package
router.put('/:id', PointPackageController.updatePointPackage);

// Delete a point package
router.delete('/:id', PointPackageController.deletePointPackage);

module.exports = router; 