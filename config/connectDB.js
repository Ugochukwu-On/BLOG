require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            // useUnifiedTopology: true,
            // useNewUrlParser: true
        });

        // Listen for connection events (optional)
        mongoose.connection.on('connected', () => {
            console.log('Connected to MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
    } catch (err) {
        console.error(err);
    }
};

module.exports = connectDB;
