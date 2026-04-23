const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        default: []
    },
    pickupLocation: {
        street: String,
        city: String,
        state: String,
        zip: String
    },
    status: {
        type: String,
        enum: ['pending_approval', 'active', 'rejected'],
        default: 'pending_approval' // Admin must approve
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

productSchema.index({ sellerId: 1 });
productSchema.index({ status: 1 });
productSchema.index({ isDeleted: 1 });

module.exports = mongoose.model('Product', productSchema);
