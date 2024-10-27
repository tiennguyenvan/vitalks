// /backend/server.js
const app = require('./app'); // Import the Express app from app.js
const { connectDB } = require('./config/db'); // Import MongoDB connection
const Env = require('./utils/env'); // Load environment variables

const PORT = Env.BACKEND_PORT || 5001; // Set default port if not provided

// Connect to MongoDB
connectDB();

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`SendGrid From Email: ${Env.SENDGRID_FROM_EMAIL}`);
});
