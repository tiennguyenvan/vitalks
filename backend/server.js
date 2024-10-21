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
