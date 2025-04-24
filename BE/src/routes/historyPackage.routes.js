const express = require('express');
const router = express.Router();
const historyPackageController = require('../controllers/historyPackage.controller');
// Tạo mới history package
router.post('/',  historyPackageController.createHistoryPackage);

// Lấy tất cả history package
router.get('/',  historyPackageController.getAllHistoryPackages);

// Lấy history package theo ID
router.get('/:id',historyPackageController.getHistoryPackageById);

// Lấy history package theo user ID
router.get('/user/:userId',  historyPackageController.getHistoryPackagesByUserId);

// Cập nhật history package
router.put('/:id',  historyPackageController.updateHistoryPackage);

// Xóa history package
router.delete('/:id', historyPackageController.deleteHistoryPackage);

// Lấy history package theo trạng thái
router.get('/status/:status',historyPackageController.getHistoryPackagesByStatus);

module.exports = router; 