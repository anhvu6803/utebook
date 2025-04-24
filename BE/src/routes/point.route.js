const express = require('express');
const router = express.Router();
const pointController = require('../controllers/point.controller');

// Create a new point record
router.post('/', pointController.createPoint);

// Get all points
router.get('/', pointController.getAllPoints);

// Get point by user ID
router.get('/:userId', pointController.getPointByUserId);

// Update point by user ID
router.patch('/:userId', pointController.updatePoint);

// Delete point by user ID
router.delete('/:userId', pointController.deletePoint);

module.exports = router; 