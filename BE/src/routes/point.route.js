const express = require('express');
const router = express.Router();
const pointController = require('../controllers/point.controller');

// Lấy tất cả điểm
router.get('/', pointController.getAllPoints);

// Lấy điểm theo user ID
router.get('/:userId', pointController.getPointByUserId);

// Tạo điểm mới
router.post('/', pointController.createPoint);

// Cập nhật điểm theo user ID
router.patch('/:userId', pointController.updatePoint);

// Xóa điểm theo user ID
router.delete('/:userId', pointController.deletePoint);

module.exports = router; 