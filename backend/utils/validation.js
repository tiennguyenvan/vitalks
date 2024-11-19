const crypto = require('crypto');
const User = require('../models/User');
const Env = require('./env');

function generateValidationCode() {
	if (Env.SKIP_SENDING_EMAIL) {
		return '123456'; // For simplicity, using a hardcoded code for demonstration purposes
	}

	return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code at this time
}

// Store the code temporarily (can switch to Redis or DB if needed)
const validationCodes = new Map(); // Store email-code pairs temporarily

function saveValidationCode(email, code) {
	validationCodes.set(email, code);
	// Optionally set a timeout to expire the code after 10 mins
	setTimeout(() => validationCodes.delete(email), 10 * 60 * 1000);
}

function getValidationCode(email) {
	return validationCodes.get(email);
}

// In-memory storage for active sessions
const activeSessions = new Map();

// Middleware to authenticate user sessions
const authenticateUser = async (req, res, next) => {
	const email = req.body.email || req.params.email || req.headers['x-user-email'];
    const code = req.body.code || req.params.code || req.headers['x-user-code'];
	
	// console.log(req.body, req.params, req.headers, req.headers['x-user-email'],req.headers['x-user-code'])
	// console.log({email, code})
	// Check if email and code are provided
	if (!email || !code) {
		return res.status(400).json({ message: 'Email and code are required.' });
	}
	
	if (Env.SKIP_SENDING_EMAIL) {
		next();
		return;
	}

	// Validate session
	const sessionCode = activeSessions.get(email);
	if (!sessionCode || sessionCode !== code) {
		return res.status(401).json({ message: 'Session expired. Please login again.' });
	}

	// Retrieve user
	const user = await User.findOne({ email });
	if (!user) {
		return res.status(404).json({ message: 'User not found.' });
	}

	// Attach user ID to request
	req.userId = user._id;
	next();
};

const activateUser = async (email, code) => {
	const storedCode = getValidationCode(email);
	if (storedCode && storedCode === code) {
		activeSessions.set(email, code);

		let user = await User.findOne({ email });
		if (!user) {
			user = new User({ email });
			await user.save();
		}
		return true;
	}
	return false;	
}

module.exports = {
	generateValidationCode,
	saveValidationCode,
	getValidationCode,
	activeSessions,
	authenticateUser,
	activateUser
};