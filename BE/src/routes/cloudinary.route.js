const express = require('express');
const router = express.Router();
const cloudinaryController = require('../controllers/cloudinary.controller');
const { upload } = require('../configs/cloudinary.config');

// Upload image - accept any field name
router.post('/upload', (req, res, next) => {
    upload.any('file')(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: 'Error uploading file',
                error: err.message
            });
        }
        next();
    });
}, cloudinaryController.uploadImage);

// Delete image
router.delete('/:publicId', cloudinaryController.deleteImage);

// Get image info
router.get('/:publicId', cloudinaryController.getImageInfo);

module.exports = router;
