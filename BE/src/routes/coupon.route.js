const express = require('express');
const {
    useCoupon,
    addCoupon,
} = require('../controllers/coupon.controller');

const router = express.Router();

router.get('/', useCoupon);
router.post('/', addCoupon);

module.exports = router;
