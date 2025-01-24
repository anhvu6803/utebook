const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    bookId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    }],
    totalPrice: {
        type: Number,
        required: true,
        min: 0,
    },
}, {
    timestamps: true, 
});
module.exports = mongoose.model('Cart', CartSchema);