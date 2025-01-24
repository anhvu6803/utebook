const userRouter = require('./user.route');
const bookRouter = require('./book.route');
const cartRouter = require('./cart.route');
const express = require('express');
const router = express.Router();

router.use('/user', userRouter);
router.use('/book', bookRouter);
router.use('/cart', cartRouter);

module.exports = router;