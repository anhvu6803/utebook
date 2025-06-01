const couponService = require('../services/coupon.service');

exports.useCoupon = async (req, res) => {
    const { userId, coupon } = req.body;

    try {
        const result = await couponService.useCoupon(coupon, userId);
        res.status(200).json({
            message: 'Coupon applied successfully',
            data: result
        });
    } catch (error) {
        res.status(400).json({
            message: error.message || 'Failed to use coupon'
        });
    }
};

exports.addCoupon = async (req, res) => {
    const { discount } = req.body;

    try {
        const newCoupon = await couponService.addCoupon(discount);
        res.status(201).json({
            message: 'Coupon created successfully',
            data: newCoupon
        });
    } catch (error) {
        res.status(400).json({
            message: error.message || 'Failed to create coupon'
        });
    }
};


