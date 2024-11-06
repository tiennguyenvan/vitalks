// /backend/server.js
const app = require('./app'); // Import the Express app from app.js
const { connectDB } = require('./config/db'); // Import MongoDB connection
const Env = require('./utils/env'); // Load environment variables

const PORT = Env.BACKEND_PORT; // Set default port if not provided

// Connect to MongoDB
connectDB();

// Start the server
app.listen(Env.BACKEND_PORT, () => {
    console.log(`Server is running on http://localhost:${Env.BACKEND_PORT}`);
    console.log(`SendGrid From Email: ${Env.SENDGRID_FROM_EMAIL}`);
	console.log(`Skip sending emails: ${Env.SKIP_SENDING_EMAIL}`);
});
