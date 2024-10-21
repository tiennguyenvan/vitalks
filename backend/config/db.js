// /backend/config/db.js
require('dotenv').config(); // Load environment variables
const { MongoClient, ServerApiVersion } = require('mongodb');

// Use MongoDB URI from .env
const uri = process.env.MONGODB_URI;

// Create MongoClient with options
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectDB() {
  try {
    await client.connect(); // Connect to MongoDB
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1); // Exit if connection fails
  }
}

module.exports = { client, connectDB };
