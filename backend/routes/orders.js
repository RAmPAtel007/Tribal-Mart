const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// Validation Schemas
const orderPostSchema = Joi.object({
    sellerId: Joi.string().required(),
    products: Joi.array().items(
        Joi.object({
            productId: Joi.string().required(),
            quantity: Joi.number().min(1).required()
        })
    ).min(1).required(),
    shippingAddress: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zip: Joi.string().required()
    }).required()
});

const statusUpdateSchema = Joi.object({
    status: Joi.string().valid('placed', 'packaging', 'shipped', 'delivered', 'cancelled').required()
});

// @route   POST /api/orders
// @desc    Place a new order
router.post('/', auth, async (req, res, next) => {
    try {
        const { error, value } = orderPostSchema.validate(req.body, { abortEarly: false });
        if (error) {
            error.isJoi = true;
            throw error;
        }

        const { sellerId, products, shippingAddress } = value;

        let totalAmount = 0;
        let orderProducts = [];

        // Validate products, stock, calculate total amount
        for (let item of products) {
            const product = await Product.findById(item.productId);
            if (!product || product.status !== 'active' || product.isDeleted) {
                return res.status(404).json({ message: `Product ${item.productId} not found or active` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }
            
            totalAmount += product.price * item.quantity;
            orderProducts.push({
                productId: product._id,
                quantity: item.quantity,
                price: product.price
            });

            product.stock -= item.quantity;
            await product.save();
        }

        const order = new Order({
            customerId: req.user.id,
            sellerId,
            products: orderProducts,
            totalAmount,
            shippingAddress,
            status: 'placed',
            paymentStatus: 'escrow'
        });

        await order.save();

        const notifMsg = `New order placed for ₹${totalAmount}`;
        await Notification.create({
            recipientId: sellerId,
            message: notifMsg,
            type: 'order',
            actionUrl: `/dashboard`
        });

        if (req.io) {
            req.io.to(sellerId.toString()).emit('notification', {
                message: notifMsg,
                type: 'order',
                actionUrl: `/dashboard`
            });
        }

        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/orders/customer
// @desc    Get logged in user orders
router.get('/customer', auth, async (req, res, next) => {
    try {
        const orders = await Order.find({ customerId: req.user.id })
            .populate('sellerId', 'username email phone')
            .populate('products.productId', 'name images price');
        res.json(orders);
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/orders/seller
// @desc    Get received orders for a seller
router.get('/seller', auth, async (req, res, next) => {
    try {
        if (req.user.role !== 'seller') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const orders = await Order.find({ sellerId: req.user.id })
            .populate('customerId', 'username email phone address')
            .populate('agentId', 'username email phone')
            .populate('products.productId', 'name images')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/orders/seller/analytics
// @desc    Aggregation based earnings specific to Seller
router.get('/seller/analytics', auth, async (req, res, next) => {
    try {
        if (req.user.role !== 'seller') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const aggregateResult = await Order.aggregate([
            { $match: { sellerId: new mongoose.Types.ObjectId(req.user.id) } },
            {
                $group: {
                    _id: "$paymentStatus",
                    totalValue: { $sum: "$totalAmount" },
                    count: { $sum: 1 }
                }
            }
        ]);

        let escrowTotal = 0;
        let releasedTotal = 0;
        let totalOrdersCount = 0;

        aggregateResult.forEach(stat => {
            totalOrdersCount += stat.count;
            if (stat._id === 'escrow') escrowTotal += stat.totalValue;
            if (stat._id === 'released_to_seller') releasedTotal += stat.totalValue;
        });

        res.json({ escrowTotal, releasedTotal, totalOrdersCount });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/orders/agent
// @desc    Get orders assisted by the agent
router.get('/agent', auth, async (req, res, next) => {
    try {
        if (req.user.role !== 'agent') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const orders = await Order.find({ agentId: req.user.id })
            .populate('customerId', 'username email phone address')
            .populate('sellerId', 'username email phone address')
            .populate('products.productId', 'name images pickupLocation');
        res.json(orders);
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order shipping/fulfillment status
router.put('/:id/status', auth, async (req, res, next) => {
    try {
        const { error, value } = statusUpdateSchema.validate(req.body);
        if (error) {
            error.isJoi = true;
            throw error;
        }

        const { status } = value;
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        const isSeller = req.user.role === 'seller' && order.sellerId.toString() === req.user.id;
        const isAgent = req.user.role === 'agent' && order.agentId?.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin';

        if (!isSeller && !isAgent && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to update this order' });
        }

        // Strict State Machine Validation
        const stateRank = { 'placed': 1, 'packaging': 2, 'shipped': 3, 'delivered': 4 };
        if (status === 'cancelled') {
            if (order.status !== 'placed') {
                return res.status(400).json({ message: 'Order can only be cancelled while placed' });
            }
        } else {
            if (stateRank[status] <= stateRank[order.status]) {
                 return res.status(400).json({ message: `Invalid state transition from ${order.status} to ${status}` });
            }
        }

        order.status = status;

        // Auto move escrow to released on delivery
        if (status === 'delivered') {
            order.paymentStatus = 'released_to_seller';
             
             const msg = `Payment Released: ₹${order.totalAmount} for Order ${order._id.toString().substring(0, 6)}`;
             await Notification.create({
                 recipientId: order.sellerId,
                 message: msg,
                 type: 'payment',
                 actionUrl: `/dashboard`
             });

             if (req.io) {
                req.io.to(order.sellerId.toString()).emit('notification', {
                    message: msg,
                    type: 'payment',
                    actionUrl: `/dashboard`
                });
            }
        }

        await order.save();
        res.json(order);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
