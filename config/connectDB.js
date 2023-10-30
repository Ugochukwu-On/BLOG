require('dotenv').config()
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connection = mongoose.createConnection(process.env.DATABASE_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });

        // Listen for connection events (optional)
        connection.on('connected', () => {
            console.log('Connected to MongoDB');
        });

        connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        return connection;
    } catch (err) {
        console.error(err);
    }
};

module.exports = connectDB;
