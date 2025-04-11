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
module.exports = {
    UserController,
    BookController,
    CartController,
    OrderController,
    ReviewController,
    DriveController,
    AuthController,
    TwilioController,
    CloudinaryController,
};