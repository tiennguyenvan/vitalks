const express = require('express');
const router = express.Router();
const { sendValidationEmail } = require('../utils/email');
const { generateValidationCode, saveValidationCode } = require('../utils/validation');
const User = require('../models/User');
const Following = require('../models/Following');
const Category = require('../models/Category');

router.delete('/delete-all-users', async (req, res) => {
    try {
        await User.collection.drop(); // Drop the entire `users` collection along with its indexes
		await Following.collection.drop(); 
        res.status(200).json({ message: 'Users collection dropped successfully.' });
    } catch (error) {
        if (error.code === 26) {
            // Code 26 means the collection does not exist
            res.status(404).json({ message: 'Users collection does not exist.' });
        } else {
            res.status(500).json({ message: 'Failed to drop users collection.', error: error.message });
        }
    }
});

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

router.get('/get-all-users', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users
        // console.log('All Users:', users); // Print users to the console
        res.status(200).json(users); // Send users as response to confirm
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error retrieving users.' });
    }
});

router.post('/get-user-data', async (req, res) => {	
    const { fields, email } = req.body; // `fields` is an optional parameter in the request body

    // The authenticated user ID is now available from the middleware
	const user = await User.findOne({ email });
	if (!user) {
		return res.status(404).json({ message: 'User not Found.' });
	}            

    // If no specific fields are requested, return the entire user object
    if (!fields) {
        return res.status(200).json(user);
    }

    // Otherwise, create a filtered response based on the requested fields
    const responseData = {};
    fields.split(',').forEach(field => {
        switch (field.trim().toLowerCase()) {
            case 'userid':
                responseData.userID = user._id;
                break;
            case 'email':
                responseData.email = user.email;
                break;
            case 'avatar':
                responseData.avatar = user.avatar;
                break;
            case 'bio':
                responseData.bio = user.bio;
                break;
            case 'thoughtscount':
                responseData.thoughtsCount = user.thoughtsCount;
                break;
            case 'listenerscount':
                responseData.listenersCount = user.listenersCount;
                break;
            case 'followingscount':
                responseData.followingsCount = user.followingsCount;
                break;
            case 'createdat':
                responseData.createdAt = user.createdAt;
                break;
            case 'updatedat':
                responseData.updatedAt = user.updatedAt;
                break;
            default:
                responseData[field] = 'Field not found';
        }
    });

    return res.status(200).json(responseData);
});




////////////////////////////////////////////////////////////////////////
// CREATE DEMO CATEGORIES
////////////////////////////////////////////////////////////////////////
/**
 * POST /test/create-demo-categories
 * Creates demo categories for testing purposes
 * 
 * Response:
 * - message (String): Confirmation message
 * - categories (Array): List of created demo categories
 * 
curl -X POST http://localhost:5000/test/create-demo-categories \
-H "Content-Type: application/json"
 * 
 */
router.post('/create-demo-categories', async (req, res) => {
    const demoCategories = [
        { name: 'Mental Health' },
        { name: 'Physical Fitness' },
        { name: 'Nutrition' },
        { name: 'Sleep Health' },
        { name: 'Chronic Illness' }
    ];

    try {
        // Insert demo categories if they don't already exist
        const categories = await Category.insertMany(demoCategories, { ordered: false });
        res.status(201).json({ message: 'Demo categories created successfully', categories });
    } catch (error) {
        // If categories already exist, they will be skipped due to the unique constraint
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Some categories already exist' });
        }
        console.error("Error creating demo categories:", error);
        res.status(500).json({ message: 'Failed to create demo categories', error: error.message });
    }
});

module.exports = router;
