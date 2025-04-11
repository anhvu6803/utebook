const { cloudinary } = require('../configs/cloudinary.config');

class CloudinaryService {
    // Upload image to Cloudinary
    async uploadImage(file) {
        try {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'utebook',
                resource_type: 'auto'
            });

            return {
                url: result.secure_url,
                public_id: result.public_id,
                format: result.format,
                size: result.bytes
            };
        } catch (error) {
            throw new Error(`Error uploading image: ${error.message}`);
        }
    }

    // Delete image from Cloudinary
    async deleteImage(publicId) {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            if (result.result !== 'ok') {
                throw new Error('Failed to delete image');
            }
            return true;
        } catch (error) {
            throw new Error(`Error deleting image: ${error.message}`);
        }
    }

    // Get image information
    async getImageInfo(publicId) {
        try {
            const result = await cloudinary.api.resource(publicId);
            return {
                url: result.secure_url,
                format: result.format,
                size: result.bytes,
                created_at: result.created_at
            };
        } catch (error) {
            throw new Error(`Error getting image info: ${error.message}`);
        }
    }
}

module.exports = new CloudinaryService();
