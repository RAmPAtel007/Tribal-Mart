const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['order', 'payment', 'agent', 'system'],
        default: 'system'
    },
    actionUrl: {
        type: String
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
