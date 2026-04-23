const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Middleware specifically for checking admin role
const adminAuth = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access denied' });
    }
    next();
};

// @route   GET /api/admin/users/pending
// @desc    Get all users pending verification
router.get('/users/pending', auth, adminAuth, async (req, res) => {
    try {
        const users = await User.find({ isVerified: false })
            .select('-password')
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error('Fetch pending users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/admin/users/:id/approve
// @desc    Approve a pending seller or agent account
router.put('/users/:id/approve', auth, adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        user.isVerified = true;
        await user.save();

        res.json({ message: `User ${user.username} successfully verified for role ${user.role}!`, user });
    } catch (error) {
        console.error('Approve user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/admin/products/pending
// @desc    Get all pending products
router.get('/products/pending', auth, adminAuth, async (req, res) => {
    try {
        const products = await Product.find({ status: 'pending_approval' })
            .populate('sellerId', 'username email');
        res.json(products);
    } catch (error) {
        console.error('Fetch pending products error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/admin/stats
// @desc    Get complete platform stats
router.get('/stats', auth, adminAuth, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalSellers = await User.countDocuments({ role: 'seller', isVerified: true });
        const totalAgents = await User.countDocuments({ role: 'agent', isVerified: true });
        const pendingApprovals = await User.countDocuments({ isVerified: false });
        
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const generatedRevenue = await Order.aggregate([
            { $match: { paymentStatus: { $in: ['escrow', 'released_to_seller'] } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        res.json({
            users: { totalUsers, totalSellers, totalAgents, pendingApprovals },
            products: { totalProducts },
            orders: { totalOrders },
            revenue: generatedRevenue.length > 0 ? generatedRevenue[0].total : 0
        });
    } catch (error) {
        console.error('Fetch stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
