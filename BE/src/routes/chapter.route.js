const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { addChapter, getAllChapters, getChapterById, updateChapter, deleteChapter } = require('../controllers/chapter.controller');
const { adminMiddleware } = require('../middleware/auth.middleware');
// Add chapter route
router.post('/add-chapter', adminMiddleware, addChapter);

// Get all chapters route
router.get('/chapters', getAllChapters);

// Get chapter by ID route
router.get('/chapter/:id', getChapterById);

// Update chapter route
router.put('/update-chapter/:id', 
    adminMiddleware,
    [
        body('chapterName').optional().notEmpty().withMessage('Chapter name cannot be empty'),
        body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
        body('viewlink').optional().notEmpty().withMessage('View link cannot be empty').isString()
    ],
    updateChapter
);

// Delete chapter route
router.delete('/delete-chapter/:id', adminMiddleware, deleteChapter);

module.exports = router;
