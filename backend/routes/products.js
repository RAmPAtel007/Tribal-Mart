const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Joi Schemas
const productSchema = Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().required(),
    price: Joi.number().min(0).required(),
    stock: Joi.number().min(0).required(),
    category: Joi.string().required(),
    pickupLocation: Joi.object({
        street: Joi.string().allow(''),
        city: Joi.string().allow(''),
        state: Joi.string().allow(''),
        zip: Joi.string().allow('')
    }).optional()
});

const updateProductSchema = Joi.object({
    name: Joi.string().trim().optional(),
    description: Joi.string().optional(),
    price: Joi.number().min(0).optional(),
    stock: Joi.number().min(0).optional(),
    category: Joi.string().optional(),
    pickupLocation: Joi.object({
        street: Joi.string().allow(''),
        city: Joi.string().allow(''),
        state: Joi.string().allow(''),
        zip: Joi.string().allow('')
    }).optional(),
    removeImages: Joi.string().optional() // Comma separated list of URLs to remove (optional)
});

// @route   POST /api/products
// @desc    Create a product (Seller only)
router.post('/', auth, upload.array('images', 5), async (req, res, next) => {
    try {
        if (req.user.role !== 'seller') {
            return res.status(403).json({ message: 'Only sellers can create products' });
        }
        if (!req.user.isVerified) {
            return res.status(403).json({ message: 'Your seller account must be approved by an Admin first.' });
        }

        if (req.body.pickupLocation && typeof req.body.pickupLocation === 'string') {
            try { req.body.pickupLocation = JSON.parse(req.body.pickupLocation); } catch(e) {}
        }

        const { error, value } = productSchema.validate(req.body, { abortEarly: false, allowUnknown: true });
        if (error) {
            error.isJoi = true;
            throw error;
        }

        const imageUrls = req.files ? req.files.map(file => file.path) : [];

        const newProduct = new Product({
            sellerId: req.user.id,
            ...value,
            images: imageUrls,
            status: 'pending_approval'
        });

        const product = await newProduct.save();
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/products
// @desc    Get all active products (Public)
router.get('/', async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const filter = { status: 'active', isDeleted: false };
        
        const products = await Product.find(filter)
            .populate('sellerId', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Product.countDocuments(filter);

        res.json({
            data: products,
            page,
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/products/seller
// @desc    Get all products for the logged-in seller
router.get('/seller', auth, async (req, res, next) => {
    try {
        if (req.user.role !== 'seller') {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const filter = { sellerId: req.user.id, isDeleted: false };

        const products = await Product.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
            
        const total = await Product.countDocuments(filter);

        res.json({
            data: products,
            page,
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/products/:id
// @desc    Update a product (Seller only, must own product)
router.put('/:id', auth, upload.array('images', 5), async (req, res, next) => {
    try {
        if (req.user.role !== 'seller') {
            return res.status(403).json({ message: 'Only sellers can update products' });
        }
        
        let product = await Product.findById(req.params.id);
        if (!product || product.isDeleted) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.sellerId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to update this product' });
        }

        if (req.body.pickupLocation && typeof req.body.pickupLocation === 'string') {
            try { req.body.pickupLocation = JSON.parse(req.body.pickupLocation); } catch(e) {}
        }
        
        const { error, value } = updateProductSchema.validate(req.body, { abortEarly: false, allowUnknown: true });
        if (error) {
            error.isJoi = true;
            throw error;
        }

        // Add new images
        const newImageUrls = req.files && req.files.length > 0 ? req.files.map(file => file.path) : [];
        let updatedImages = [...product.images, ...newImageUrls];

        // Remove old images if requested
        if (req.body.removeImages) {
            const toRemove = req.body.removeImages.split(',');
            updatedImages = updatedImages.filter(img => !toRemove.includes(img));
        }

        // Apply string/number updates
        Object.keys(value).forEach(key => {
            if (key !== 'removeImages') product[key] = value[key];
        });
        product.images = updatedImages;

        await product.save();
        res.json(product);
    } catch (error) {
        next(error);
    }
});

// @route   DELETE /api/products/:id
// @desc    Soft Delete a product (Seller only)
router.delete('/:id', auth, async (req, res, next) => {
    try {
        if (req.user.role !== 'seller') {
            return res.status(403).json({ message: 'Only sellers can delete products' });
        }
        
        let product = await Product.findById(req.params.id);
        if (!product || product.isDeleted) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.sellerId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to delete this product' });
        }

        // Soft Delete
        product.isDeleted = true;
        await product.save();
        res.json({ message: 'Product removed successfully' });
    } catch (error) {
         next(error);
    }
});

// @route   PUT /api/products/:id/status
// @desc    Update product status (Admin only)
router.put('/:id/status', auth, async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can update product status' });
        }
        
        const { status } = req.body;
        if (!['pending_approval', 'active', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { status },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
