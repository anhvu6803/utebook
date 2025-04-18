const express = require('express');
const router = express.Router();

const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const bookRouter = require('./book.route');
const reviewRouter = require('./review.route');
const paymentRouter = require('./payment.route');
const membershipPackageRouter = require('./membershipPackage.route');
const pointPackageRouter = require('./pointPackage.route');
const driveRouter = require('./drive.route');
const twilioRoutes = require('./twilio.route');
const cloudinaryRoute = require('./cloudinary.route');

router.use('/user', userRouter);
router.use('/book', bookRouter);
router.use('/review', reviewRouter);
router.use('/drive', driveRouter);
router.use('/auth', authRouter);
router.use('/twilio', twilioRoutes);
router.use('/cloudinary', cloudinaryRoute);
router.use('/payment', paymentRouter);
router.use('/membership-packages', membershipPackageRouter);
router.use('/point-packages', pointPackageRouter);
module.exports = router;