const crypto = require('crypto');

// let Diego refines this function to generate a more secure validation code
function generateValidationCode() {
	// return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code at this tim
	return '123456'; // For simplicity, using a hardcoded code for demonstration purposes
}

// Store the code temporarily (can switch to Redis or DB if needed)
const codes = new Map(); // Store email-code pairs temporarily

function saveValidationCode(email, code) {
	codes.set(email, code);
	// Optionally set a timeout to expire the code after 10 mins
	setTimeout(() => codes.delete(email), 10 * 60 * 1000);
}

function getValidationCode(email) {
	return codes.get(email);
}

module.exports = { generateValidationCode, saveValidationCode, getValidationCode };
