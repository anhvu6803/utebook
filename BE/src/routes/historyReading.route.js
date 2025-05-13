const express = require('express');
const router = express.Router();
const {
    getReadingById,
    addReading,
    updateReading,
} = require('../controllers/historyReading.controller');

router.get('/', getReadingById);
router.post('/', addReading);
router.put('/:id', updateReading);

module.exports = router;