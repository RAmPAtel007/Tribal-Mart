const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['customer', 'seller', 'agent', 'admin'],
        default: 'customer'
    },
    phone: {
        type: String,
        trim: true,
    },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String
    },
    isVerified: {
        type: Boolean,
        default: true // customers are verified by default. Sellers/agents wait for admin
    },
    verificationDetails: {
        govtIdUrl: String,
        category: String // For sellers
    }
}, { timestamps: true });

userSchema.index({ role: 1 });
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
