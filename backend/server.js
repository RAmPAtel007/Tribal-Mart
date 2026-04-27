require('dotenv').config();
require('dns').setServers(['8.8.8.8', '8.8.4.4']); // Fix for querySrv ECONNREFUSED
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const agentRoutes = require('./routes/agent');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notifications');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' } // Ensure frontend matches this in prod
});

// Configure Socket.IO
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // Clients join room based on their database User ID
    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their notification room`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Attach io to req for use in route controllers
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Rate limiting (global)
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 500, // limit each IP to 500 requests per windowMs
    message: 'Too many requests from this IP, please try again after 5 minutes'
});
app.use(limiter);

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Global Error Handler
app.use(errorHandler);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully');
        const PORT = process.env.PORT || 5000;
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error.message);
    });
