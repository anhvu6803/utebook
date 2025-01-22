const userRouter = require('./user.route');
const bookRouter = require('./book.route');
const express = require('express');
const router = express.Router();

router.use('/user', userRouter);
router.use('/book', bookRouter);

module.exports = router;