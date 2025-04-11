const UserController = require('../controllers/user.controller');
const BookController = require('../controllers/book.controller');
const CartController = require('../controllers/cart.controller');
const OrderController = require('../controllers/order.controller');
const ReviewController = require('../controllers/review.controller');
const DriveController = require('../controllers/drive.controller');
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