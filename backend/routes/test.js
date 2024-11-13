const express = require('express');
const router = express.Router();
const { sendValidationEmail } = require('../utils/email');
const { generateValidationCode, saveValidationCode } = require('../services/validation');
const User = require('../models/User');

// Test route to create a user
router.post('/create-user', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Test route to send an email
router.post('/send-email', async (req, res) => {
    const { email, code } = req.body;
    try {
        await sendValidationEmail(email, code);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
});

// Route to generate and send a validation code
router.post('/generate-code', async (req, res) => {
    const { email } = req.body;

    try {
        const code = generateValidationCode();  // Generate the code
        saveValidationCode(email, code);        // Save code for future verification

        await sendValidationEmail(email, code); // Send code via email
        res.status(200).json({ message: 'Validation code sent successfully!' });
    } catch (error) {
        console.error('Error sending validation code:', error);
        res.status(500).json({ message: 'Failed to send validation code', error: error.message });
    }
});

module.exports = router;
