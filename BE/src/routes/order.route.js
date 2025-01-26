const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {OrderController} = require('../controllers/index');

router.post('/create', [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('cartId').notEmpty().withMessage('Cart ID is required')
], OrderController.createOrder);

router.post('/update-status', [
    body('orderId').notEmpty().withMessage('Order ID is required'),
    body('status').isIn(['Pending', 'Processing', 'Completed', 'Cancelled']).withMessage('Invalid status')
], OrderController.updateOrderStatus);

router.delete('/:orderId', OrderController.deleteOrder);

router.get('/:orderId', OrderController.getOrderById);

module.exports = router;