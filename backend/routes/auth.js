const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register Route
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, phone, address, role } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'Username is taken' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Determine verification status: customers are true, others false initially
        const isVerified = (role === 'seller' || role === 'agent') ? false : true;

        // Create new user
        user = new User({
            username,
            email,
            password: hashedPassword,
            phone,
            address,
            role: role || 'customer',
            isVerified
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const payload = {
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                isVerified: user.isVerified
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: payload.user });
            }
        );
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Apply for Role (Seller/Agent) Route
router.put('/apply-role', auth, async (req, res) => {
    try {
        const { requestedRole, govtIdUrl, category } = req.body;

        if (!['seller', 'agent'].includes(requestedRole)) {
            return res.status(400).json({ message: 'Invalid role requested' });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { 
                role: requestedRole,
                isVerified: false, // Must be verified by admin
                verificationDetails: {
                    govtIdUrl,
                    category
                }
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate updated JWT
        const payload = {
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                isVerified: user.isVerified
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ message: `Successfully applied for ${requestedRole} role. Awaiting admin approval.`, token, user: payload.user });
            }
        );

    } catch (error) {
        console.error('Role apply error:', error);
        res.status(500).json({ message: 'Server error during role application' });
    }
});

module.exports = router;
