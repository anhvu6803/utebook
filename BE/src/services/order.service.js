const Order = require('../models/order.model');
const Cart = require('../models/cart.model');

exports.createOrder = async (userId, cartId) => {
    const cart = await Cart.findById(cartId);
    if (!cart) {
        throw new Error('Cart not found');
    }

    const order = new Order({
        userId,
        cartId,
        status: 'Pending'
    });

    await order.save();
    return order;
};

exports.updateOrderStatus = async (orderId, status) => {
    const order = await Order.findById(orderId);
    if (!order) {
        throw new Error('Order not found');
    }

    order.status = status;
    await order.save();
    return order;
};

exports.deleteOrder = async (orderId) => {
    const order = await Order.findById(orderId);
    if (!order) {
        throw new Error('Order not found');
    }

    await order.remove();
    return order;
};

exports.getOrderById = async (orderId) => {
    const order = await Order.findById(orderId).populate('cartId');
    if (!order) {
        throw new Error('Order not found');
    }

    return order;
};