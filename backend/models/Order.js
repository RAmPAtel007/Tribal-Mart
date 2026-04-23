const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    price: {
        type: Number,
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    products: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zip: String
    },
    status: {
        type: String,
        enum: ['placed', 'packaging', 'shipped', 'delivered', 'cancelled'],
        default: 'placed'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'escrow', 'released_to_seller', 'refunded'],
        default: 'pending' // When customer pays, it moves to 'escrow'
    }
}, { timestamps: true });

orderSchema.index({ sellerId: 1 });
orderSchema.index({ customerId: 1 });
orderSchema.index({ agentId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Order', orderSchema);
