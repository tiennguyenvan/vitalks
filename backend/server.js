// /backend/server.js
const express = require('express');
const { connectDB } = require('./config/db'); // Import MongoDB connection

const app = express();
const PORT = process.env.PORT || 5001;

connectDB(); // Connect to MongoDB when the server starts

// Middleware to parse JSON requests
app.use(express.json());

// Root route handler
app.get('/', (req, res) => {
  res.send('Welcome to the VITALKS API!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


const User = require('./models/User'); // Import the User model

// Test route to create a user
app.post('/test-create-user', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
