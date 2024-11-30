require('dotenv').config();
const mongoose = require('mongoose');
const Env = require('../utils/env');

const uri = process.env.REACT_APP_MONGODB_URI;
// const uri = Env.MONGODB_URI;

async function connectDB() {
    try {
        await mongoose.connect(uri); // No options needed for v4+
        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
}

module.exports = { connectDB };
