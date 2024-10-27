// /backend/server.js
const express = require('express');
const { connectDB } = require('./config/db'); // Import MongoDB connection
const { sendValidationEmail } = require('./utils/email'); // Import SendGrid function
const User = require('./models/User'); // Import the User model
const Env = require('./utils/env');

const app = express();
const PORT = Env.BACKEND_PORT;;

connectDB(); // Connect to MongoDB when the server starts

// Middleware to parse JSON requests
app.use(express.json());

// Root route handler
app.get('/', (req, res) => {
	res.send('Welcome to the VITALKS API!');
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
	console.log(Env.SENDGRID_FROM_EMAIL);
});



// Test route to create a user
app.post('/test-create-user', async (req, res) => {
	try {
		const user = await User.create(req.body);
		res.status(201).json(user);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Test route to send an email
app.post('/test-send-email', async (req, res) => {
	const { email, code } = req.body;
	try {
		await sendValidationEmail(email, code);
		res.status(200).json({ message: 'Email sent successfully!' });
	} catch (error) {
		res.status(500).json({ message: 'Failed to send email', error: error.message });
	}
});