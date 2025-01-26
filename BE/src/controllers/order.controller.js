const { validationResult } = require('express-validator');
const OrderService = require('../services/order.service');

exports.createOrder = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { userId, cartId } = req.body;
        const order = await OrderService.createOrder(userId, cartId);
        res.status(201).json({
            message: 'Order created successfully',
            order: order,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { orderId, status } = req.body;
        const order = await OrderService.updateOrderStatus(orderId, status);
        res.status(200).json({
            message: 'Order status updated successfully',
            order: order,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await OrderService.deleteOrder(orderId);
        res.status(200).json({
            message: 'Order deleted successfully',
            order: order,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await OrderService.getOrderById(orderId);
        res.status(200).json({
            order: order,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};