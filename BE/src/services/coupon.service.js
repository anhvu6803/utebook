const Coupon = require('../models/coupon.model');
const User = require('../models/user.model');
const Point = require('../models/point.model');

function generateCoupon(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let coupon = '';
    for (let i = 0; i < length; i++) {
        coupon += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return coupon;
}

exports.useCoupon = async (coupon, userId) => {
    try {
        const userExists = await User.findById(userId);
        if (!userExists) throw new Error('User does not exist');

        const couponExists = await Coupon.findOne({ coupon });
        if (!couponExists) throw new Error('Coupon does not exist');

        // Kiểm tra nếu coupon đã được dùng rồi
        if (couponExists.listUserUsed.includes(userId)) {
            throw new Error('Coupon has already been used');
        }

        // Lấy hoặc tạo mới điểm nếu chưa có
        const userPoint = await Point.findOne({ id_user: userId });
        if (!userPoint) throw new Error('Point does not exist');

        // Cộng điểm và lưu
        userPoint.quantity_HoaPhuong += couponExists.discount;
        await userPoint.save();

        // Đánh dấu coupon đã sử dụng
        couponExists.listUserUsed.push(userId);
        await couponExists.save();

        return userPoint;
    } catch (error) {
        throw error;
    }
};


exports.addCoupon = async (discount) => {
    try {
        let unique = false;
        let coupon;
        let savedCoupon;

        while (!unique) {
            coupon = generateCoupon();

            // Kiểm tra xem coupon đã tồn tại chưa
            const existing = await Coupon.findOne({ coupon });
            if (!existing) {
                const newCoupon = new Coupon({ coupon, discount });
                savedCoupon = await newCoupon.save();
                unique = true;
            }
        }

        return savedCoupon;
    } catch (error) {
        throw error;
    }
};

