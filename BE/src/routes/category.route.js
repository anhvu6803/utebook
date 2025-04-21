const express = require('express');
const { body } = require('express-validator');
const CategoryController = require('../controllers/category.controller');
const { adminMiddleware } = require('../middleware/auth.middleware');
const router = express.Router();

// Get all categories
router.get('/', CategoryController.getAllCategories);

// Add new category
router.post('/', 
    adminMiddleware,
    body('name').trim().notEmpty().withMessage('Tên thể loại không được để trống').isLength({ min: 2 }).withMessage('Tên thể loại phải có ít nhất 2 ký tự'),
    CategoryController.createCategory
);

// Update category
router.put('/:id',
    adminMiddleware,
    body('name').trim().notEmpty().withMessage('Tên thể loại không được để trống').isLength({ min: 2 }).withMessage('Tên thể loại phải có ít nhất 2 ký tự'),
    CategoryController.updateCategory
);

// Delete category
router.delete('/:id',
    adminMiddleware,
    CategoryController.deleteCategory
);

module.exports = router;
