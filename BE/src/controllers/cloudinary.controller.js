const cloudinaryService = require('../services/cloudinary.service');

class CloudinaryController {
    // Upload image
    async uploadImage(req, res) {
        try {
            console.log(req.files);
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded',
                    data: null
                });
            }

            // Lấy file đầu tiên từ mảng files
            const file = req.files[0];
            const result = await cloudinaryService.uploadImage(file);
            
            res.status(200).json({
                success: true,
                message: 'Image uploaded successfully',
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error uploading image',
                error: error.message,
                data: null
            });
        }
    }

    // Delete image
    async deleteImage(req, res) {
        try {
            const { publicId } = req.params;
            if (!publicId) {
                return res.status(400).json({
                    success: false,
                    message: 'Public ID is required',
                    data: null
                });
            }

            await cloudinaryService.deleteImage(publicId);
            res.status(200).json({
                success: true,
                message: 'Image deleted successfully',
                data: null
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting image',
                error: error.message,
                data: null
            });
        }
    }

    // Get image info
    async getImageInfo(req, res) {
        try {
            const { publicId } = req.params;
            if (!publicId) {
                return res.status(400).json({
                    success: false,
                    message: 'Public ID is required',
                    data: null
                });
            }

            const result = await cloudinaryService.getImageInfo(publicId);
            res.status(200).json({
                success: true,
                message: 'Image info retrieved successfully',
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error getting image info',
                error: error.message,
                data: null
            });
        }
    }
}

module.exports = new CloudinaryController();
