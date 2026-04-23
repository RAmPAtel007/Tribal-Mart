const mongoose = require('mongoose');

const assistanceRequestSchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // Null initially until an agent accepts it
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    message: {
        type: String, // Description of what assistance is needed
        default: 'Need assistance with packaging and shipping'
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'completed'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('AssistanceRequest', assistanceRequestSchema);
