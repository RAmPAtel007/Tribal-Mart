const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// @route   GET /api/notifications
// @desc    Get user's notifications
router.get('/', auth, async (req, res, next) => {
    try {
        const notifications = await Notification.find({ recipientId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(notifications);
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark a notification as read
router.put('/:id/read', auth, async (req, res, next) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipientId: req.user.id },
            { read: true },
            { new: true }
        );
        
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.json(notification);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
