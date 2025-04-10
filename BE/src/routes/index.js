const express = require('express');
const router = express.Router();

const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const bookRouter = require('./book.route');
const reviewRouter = require('./review.route');
const paymentRouter = require('./payment.route');
const membershipPackageRouter = require('./membershipPackage.route');
const pointPackageRouter = require('./pointPackage.route');

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/books', bookRouter);
router.use('/reviews', reviewRouter);
router.use('/payment', paymentRouter);
router.use('/membership-packages', membershipPackageRouter);
router.use('/point-packages', pointPackageRouter);

module.exports = router;