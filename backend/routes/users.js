const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Following = require('../models/Following');
const { sendValidationEmail } = require('../utils/email');
const { generateValidationCode, saveValidationCode, getValidationCode } = require('../services/validation');

const activeSessions = new Map(); // Store sessions in memory

// Request a validation code for email login
router.post('/request-code', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    const code = generateValidationCode();
    saveValidationCode(email, code);

    try {
        await sendValidationEmail(email, 'Your Validation Code', `Your code is: ${code}`);
        res.status(200).json({ message: 'Validation code sent successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send validation code.' });
    }
});

// Verify the code and create the user if not exists
router.post('/verify-code', async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ message: 'Email and code are required.' });
    }

    const storedCode = getValidationCode(email);

    if (storedCode && storedCode === code) {
        activeSessions.set(email, code);

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email });
            await user.save();
        }

        return res.status(200).json({ message: 'Login successful.', user });
    } else {
        return res.status(401).json({ message: 'Invalid validation code.' });
    }
});

// Get user data with optional fields filtering
router.get('/get-data', async (req, res) => {
    const { email, code, fields } = req.query;

    const sessionCode = activeSessions.get(email);
    if (!sessionCode || sessionCode !== code) {
        return res.status(401).json({ message: 'Session expired. Please login again.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    if (!fields) {
        return res.status(200).json(user);
    }

    const responseData = {};
    fields.split(',').forEach(field => {
        switch (field.trim().toLowerCase()) {
            case 'userid':
                responseData.userID = user._id;
                break;
            case 'email':
                responseData.email = user.email;
                break;
            case 'profilepicture':
                responseData.profilePicture = user.profilePicture;
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

// Update user profile
router.patch('/update', async (req, res) => {
    const { email, code } = req.query;
    const userUpdates = req.body;

    const sessionCode = activeSessions.get(email);
    if (!sessionCode || sessionCode !== code) {
        return res.status(401).json({ message: 'Session expired. Please login again.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    if (userUpdates.profilePicture) user.profilePicture = userUpdates.profilePicture;
    if (userUpdates.bio) user.bio = userUpdates.bio;
    if (userUpdates.thoughtsCount !== undefined) user.thoughtsCount = userUpdates.thoughtsCount;

    await user.save();
    res.status(200).json({ message: 'User profile updated successfully.' });
});

// Follow a user
router.post('/follow', async (req, res) => {
    const { by, followed } = req.body;

    try {
        if (by === followed) {
            return res.status(400).json({ message: 'You cannot follow yourself.' });
        }

        const follow = new Following({ by, followed });
        await follow.save();

        // Update follow counts
        await User.findByIdAndUpdate(by, { $inc: { followingsCount: 1 } });
        await User.findByIdAndUpdate(followed, { $inc: { listenersCount: 1 } });

        res.status(200).json({ message: 'Followed successfully.' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'You are already following this user.' });
        }
        res.status(500).json({ message: 'Failed to follow user.', error: error.message });
    }
});

// Unfollow a user
router.delete('/unfollow', async (req, res) => {
    const { by, followed } = req.body;

    try {
        await Following.findOneAndDelete({ by, followed });

        // Update follow counts
        await User.findByIdAndUpdate(by, { $inc: { followingsCount: -1 } });
        await User.findByIdAndUpdate(followed, { $inc: { listenersCount: -1 } });

        res.status(200).json({ message: 'Unfollowed successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to unfollow user.', error: error.message });
    }
});

// Get followers of a user
router.get('/:userId/followers', async (req, res) => {
    try {
        const followers = await Following.find({ followed: req.params.userId })
            .populate('by', 'email profilePicture bio');

        res.status(200).json(followers);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get followers.', error: error.message });
    }
});

// Get users a user is following
router.get('/:userId/following', async (req, res) => {
    try {
        const following = await Following.find({ by: req.params.userId })
            .populate('followed', 'email profilePicture bio');

        res.status(200).json(following);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get following.', error: error.message });
    }
});

module.exports = router;
