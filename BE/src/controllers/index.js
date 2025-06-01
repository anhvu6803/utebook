const UserController = require('../controllers/user.controller');
const BookController = require('../controllers/book.controller');
const ReviewController = require('../controllers/review.controller');
const DriveController = require('../controllers/drive.controller');
const PointPackageController = require('../controllers/pointPackage.controller');
const MembershipPackageController = require('../controllers/membershipPackage.controller');
const PaymentController = require('../controllers/payment.controller');
const AuthController = require('../controllers/auth.controller')
const TwilioController = require('../controllers/twilio.controller')
const CloudinaryController = require('../controllers/cloudinary.controller');
const HistoryReadingController = require('../controllers/historyReading.controller');
const CouponController = require('../controllers/coupon.controller');
const NotificationController = require('../controllers/notification.controller');
module.exports = {
    UserController,
    BookController,
    ReviewController,
    DriveController,
    AuthController,
    TwilioController,
    CloudinaryController,
    PointPackageController,
    MembershipPackageController,
    PaymentController,
    HistoryReadingController,
    CouponController,
    NotificationController
};