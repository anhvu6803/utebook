const userRouter = require('./user.route');
const bookRouter = require('./book.route');
const cartRouter = require('./cart.route');
const orderRouter = require('./order.route');
const reviewRouter = require('./review.route');
const driveRouter = require('./drive.route');
const authRoute = require('./auth.route')
const express = require('express');
const router = express.Router();

router.use('/user', userRouter);
router.use('/book', bookRouter);
router.use('/cart', cartRouter);
router.use('/order', orderRouter);
router.use('/review', reviewRouter);
router.use('/drive', driveRouter);
router.use('/auth', authRoute)
module.exports = router;