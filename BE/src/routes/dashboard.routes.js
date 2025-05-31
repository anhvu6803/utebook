const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');

// Get dashboard statistics
router.get('/statistics', dashboardController.getDashboardStatistics);

module.exports = router; 