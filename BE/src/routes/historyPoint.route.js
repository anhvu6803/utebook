const express = require('express');
const router = express.Router();
const historyPointController = require('../controllers/historyPoint.controller');

// Create a new history point record
router.post('/', historyPointController.createHistoryPoint);

// Get all history points
router.get('/', historyPointController.getAllHistoryPoints);

// Get history points by user ID
router.get('/user/:userId', historyPointController.getHistoryPointsByUserId);

// Get history point by ID
router.get('/:id', historyPointController.getHistoryPointById);

// Update history point by ID
router.patch('/:id', historyPointController.updateHistoryPoint);

// Delete history point by ID
router.delete('/:id', historyPointController.deleteHistoryPoint);

module.exports = router; 