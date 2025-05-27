const express = require('express');
const router = express.Router();
const {
    getReadingById,
    addReading,
    updateReading,
    getReadingbyUserId
} = require('../controllers/historyReading.controller');

router.get('/', getReadingById);
router.post('/', addReading);
router.put('/:id', updateReading);
router.get('/user/:id', getReadingbyUserId);

module.exports = router;