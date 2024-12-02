const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Following = require('../models/Following');
const { sendValidationEmail } = require('../utils/email');
const { generateValidationCode, saveValidationCode, getValidationCode, activeSessions, authenticateUser, activateUser } = require('../utils/validation');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const upload = multer({ dest: 'uploads/' });


////////////////////////////////////////////////////////////////////////
// LOGIN PART
////////////////////////////////////////////////////////////////////////
// Request a validation code for email login
router.post('/request-code', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    const code = generateValidationCode();
    saveValidationCode(email, code);

    try {
        await sendValidationEmail(email, code);
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

    const isActivated = await activateUser(email, code);
    if (isActivated) {
        const user = await User.findOne({ email });
        return res.status(200).json({ message: 'Login successful.', user });
    } else {
        return res.status(401).json({ message: 'Invalid validation code.' });
    }
});

////////////////////////////////////////////////////////////////////////
// GET USER DATA
////////////////////////////////////////////////////////////////////////
router.post('/get-user/:id?', authenticateUser, async (req, res) => {
    const { id } = req.params; // optional
    const { email } = req.body; // used if id is missing

    try {
        let user;
        if (id) { user = await User.findById(id); }
        else if (email) { user = await User.findOne({ email }); }
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ message: 'Failed to retrieve user data.', error: error.message });
    }
});

router.post('/is-following/:id', authenticateUser, async (req, res) => {
    const { id } = req.params; // ID of the user being checked
    const { email } = req.body; // Email of the current logged-in user

    try {
        const currentUser = await User.findOne({ email });
        const userToFollow = await User.findById(id);

        if (!currentUser || !userToFollow) {
            return res.status(404).json({ message: 'Users not found.' });
        }

        const following = await Following.findOne({ followed: userToFollow._id, by: currentUser._id });

        return res.status(200).json({ following: !!following });
    } catch (error) {
        console.error("Error checking following status:", error);
        return res.status(500).json({ message: 'Failed to check following status.', error: error.message });
    }
});

////////////////////////////////////////////////////////////////////////
// UPDATE USER DATA
////////////////////////////////////////////////////////////////////////
// Update user profile
router.patch('/update', authenticateUser, upload.single('value'), async (req, res) => {
    const { email, field, value } = req.body; // Get field and email from the request body
    const sessionCode = activeSessions.get(email);

    if (!sessionCode || sessionCode !== req.body.code) {
        return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    try {
        // Handle text updates (e.g., name, bio)
        if (field === 'name' || field === 'bio') {
            user[field] = value;
        }

        // Handle file uploads (e.g., avatar, cover)
        else if (field === 'avatar' || field === 'cover') {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded.' });
            }

            const oldFilePath = user[field];
            // Remove old file if it exists
            if (oldFilePath) {
                try {
                    fs.unlinkSync(path.resolve(__dirname, '..', oldFilePath));
                } catch (error) {
                    console.error('Error deleting old file:', error);
                }
            }

            // Save the new file path
            user[field] = req.file.path;
        }

        await user.save();
        res.status(200).json({
            message: `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully.`,
            [field]: user[field],
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Failed to update user profile.', error: error.message });
    }
});


router.post('/follow', authenticateUser, async (req, res) => {
    const { email, followedId } = req.body; // `email` is the current user's email, `followed` is the email of the user to follow

    try {
        const currentUser = await User.findOne({ email });
        if (!currentUser) {
            return res.status(404).json({ message: 'Current user not found.' });
        }
        const currentId = currentUser._id;

        const userToFollow = await User.findById(followedId);
        if (!userToFollow) {
            return res.status(404).json({ message: 'User to follow not found.' });
        }

        if (String(currentId) === String(followedId)) {
            return res.status(400).json({ message: 'You cannot follow yourself.' });
        }

        const follow = new Following({ followed: followedId, by: currentId });
        await follow.save();

        await User.findByIdAndUpdate(currentId, { $inc: { followingsCount: 1 } });
        await User.findByIdAndUpdate(followedId, { $inc: { listenersCount: 1 } });

        res.status(200).json({ message: 'Followed successfully.' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'You are already following this user.' });
        }
        res.status(500).json({ message: 'Failed to follow user.', error: error.message });
    }
});

router.post('/unfollow', authenticateUser, async (req, res) => {
    const { email, followedId } = req.body;

    try {
        const currentUser = await User.findOne({ email });
        if (!currentUser) {
            return res.status(404).json({ message: 'Current user not found.' });
        }
        const currentId = currentUser._id;

        const userToUnfollow = await User.findById(followedId);
        if (!userToUnfollow) {
            return res.status(404).json({ message: 'User to unfollow not found.' });
        }

        if (String(currentId) === String(followedId)) {
            return res.status(400).json({ message: 'You cannot unfollow yourself.' });
        }

        const unfollowResult = await Following.findOneAndDelete({ by: currentId, followed: followedId });
        if (!unfollowResult) {
            return res.status(400).json({ message: 'You are not following this user.' });
        }

        await User.findByIdAndUpdate(currentId, { $inc: { followingsCount: -1 } });
        await User.findByIdAndUpdate(followedId, { $inc: { listenersCount: -1 } });

        res.status(200).json({ message: 'Unfollowed successfully.' });
    } catch (error) {
        console.error("Error in unfollow:", error);
        res.status(500).json({ message: 'Failed to unfollow user.', error: error.message });
    }
});

module.exports = router;
