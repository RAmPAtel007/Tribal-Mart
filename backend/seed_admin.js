require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        let admin = await User.findOne({ role: 'admin' });
        
        if (admin) {
            console.log("Admin already exists:", admin.username);
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            
            admin = new User({
                username: 'superadmin',
                email: 'admin@marketplace.com',
                password: hashedPassword,
                role: 'admin',
                isVerified: true
            });
            
            await admin.save();
            console.log("Admin user 'superadmin' created with password 'admin123'");
        }
    } catch (err) {
        console.error("Error seeding admin:", err);
    } finally {
        mongoose.connection.close();
    }
};

seedAdmin();
