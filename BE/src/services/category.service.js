const Category = require('../models/category.model');

class CategoryService {
    // Lấy tất cả thể loại
    static async getAllCategories() {
        try {
            const categories = await Category.find().sort({ createdAt: -1 });
            return { success: true, data: categories };
        } catch (error) {
            throw error;
        }
    }

    // Thêm thể loại mới
    static async createCategory(categoryData) {
        try {
            // Kiểm tra trùng tên
            const existingCategory = await Category.findOne({ 
                name: { $regex: new RegExp('^' + categoryData.name + '$', 'i') } 
            });
            
            if (existingCategory) {
                throw new Error('Tên thể loại đã tồn tại');
            }

            const newCategory = new Category(categoryData);
            await newCategory.save();
            return { success: true, data: newCategory };
        } catch (error) {
            throw error;
        }
    }

    // Cập nhật thể loại
    static async updateCategory(categoryId, updateData) {
        try {
            const category = await Category.findById(categoryId);
            if (!category) {
                throw new Error('Không tìm thấy thể loại');
            }

            // Kiểm tra trùng tên với thể loại khác
            if (updateData.name && updateData.name !== category.name) {
                const existingCategory = await Category.findOne({ name: updateData.name });
                if (existingCategory) {
                    throw new Error('Tên thể loại đã tồn tại');
                }
            }

            const updatedCategory = await Category.findByIdAndUpdate(
                categoryId,
                { $set: updateData },
                { new: true, runValidators: true }
            );

            return { success: true, data: updatedCategory };
        } catch (error) {
            throw error;
        }
    }

    // Xóa thể loại
    static async deleteCategory(categoryId) {
        try {
            const category = await Category.findById(categoryId);
            if (!category) {
                throw new Error('Không tìm thấy thể loại');
            }

            await Category.findByIdAndDelete(categoryId);
            return { success: true, message: 'Xóa thể loại thành công' };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CategoryService;
