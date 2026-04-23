const express = require('express');
const router = express.Router();
const AssistanceRequest = require('../models/AssistanceRequest');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// @route   POST /api/agent/request
// @desc    Seller requests assistance for an order
router.post('/request', auth, async (req, res) => {
    try {
        if (req.user.role !== 'seller') {
            return res.status(403).json({ message: 'Only sellers can request assistance' });
        }

        const { orderId, message } = req.body;

        const order = await Order.findById(orderId);
        if (!order || order.sellerId.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Order not found or not owned by seller' });
        }

        // Check if a request already exists
        let existingRequest = await AssistanceRequest.findOne({ orderId });
        if (existingRequest) {
            return res.status(400).json({ message: 'Assistance already requested for this order' });
        }

        const newRequest = new AssistanceRequest({
            sellerId: req.user.id,
            orderId,
            message
        });

        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (error) {
        console.error('Assistance request error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/agent/requests/pending
// @desc    Get all pending assistance requests (For Agents to pick up)
router.get('/requests/pending', auth, async (req, res) => {
    try {
        if (req.user.role !== 'agent') {
            return res.status(403).json({ message: 'Access denied. Agents only.' });
        }
        if (!req.user.isVerified) {
            return res.status(403).json({ message: 'Agent account not verified yet.' });
        }

        const requests = await AssistanceRequest.find({ status: 'pending' })
            .populate('sellerId', 'username phone address')
            .populate({
                path: 'orderId',
                populate: { path: 'products.productId', select: 'name pickupLocation' }
            });

        res.json(requests);
    } catch (error) {
        console.error('Fetch pending requests error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/agent/requests/my
// @desc    Get assistance requests accepted by this agent
router.get('/requests/my', auth, async (req, res) => {
    try {
        if (req.user.role !== 'agent') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const requests = await AssistanceRequest.find({ agentId: req.user.id })
            .populate('sellerId', 'username phone address')
            .populate({
                path: 'orderId',
                populate: { path: 'products.productId', select: 'name pickupLocation' }
            });

        res.json(requests);
    } catch (error) {
        console.error('Fetch my requests error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/agent/requests/:id/accept
// @desc    Agent accepts an assistance request
router.put('/requests/:id/accept', auth, async (req, res) => {
    try {
        if (req.user.role !== 'agent' || !req.user.isVerified) {
            return res.status(403).json({ message: 'Access denied or unverified' });
        }

        const request = await AssistanceRequest.findById(req.params.id);
        if (!request || request.status !== 'pending') {
            return res.status(404).json({ message: 'Request not found or already accepted' });
        }

        request.agentId = req.user.id;
        request.status = 'accepted';
        await request.save();

        // Assign the agent to the order as well
        const order = await Order.findById(request.orderId);
        if (order) {
            order.agentId = req.user.id;
            await order.save();
        }

        res.json(request);
    } catch (error) {
        console.error('Accept request error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/agent/requests/:id/complete
// @desc    Agent marks assistance request task as complete
router.put('/requests/:id/complete', auth, async (req, res) => {
    try {
        if (req.user.role !== 'agent') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const request = await AssistanceRequest.findById(req.params.id);
        if (!request || request.agentId.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Request not found or not assigned to you' });
        }

        request.status = 'completed';
        await request.save();

        res.json(request);
    } catch (error) {
        console.error('Complete request error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
