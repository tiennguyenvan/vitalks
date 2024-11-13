const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Following = require('../models/Following');
const { sendValidationEmail } = require('../utils/email');
const { generateValidationCode, saveValidationCode, getValidationCode } = require('../services/validation');

const activeSessions = new Map(); // Store sessions in memory
const authenticateUser = async (req, res, next) => {
	next();
	return;
	const { email, code } = req.body;

	// Check if email and code are provided
	if (!email || !code) {
		return res.status(400).json({ message: 'Email and code are required.' });
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
		// console.log(`Sent validation code : ${code}`);
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

		// console.log(user);

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
	const { email } = req.body; //used if id is missing

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
router.patch('/update', authenticateUser, async (req, res) => {
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

router.post('/follow', authenticateUser, async (req, res) => {
	const { email, followedId } = req.body; // `email` is the current user's email, `followed` is the email of the user to follow

	try {
		// Retrieve the current user's ID using their email
		const currentUser = await User.findOne({ email });
		if (!currentUser) {
			return res.status(404).json({ message: 'Current user not found.' });
		}
		const currentId = currentUser._id;

		// Retrieve the ID of the user to follow using their email
		const userToFollow = await User.findById(followedId);
		if (!userToFollow) {
			return res.status(404).json({ message: 'User to follow not found.' });
		}		

		if (String(currentId) === String(followedId)) {
			return res.status(400).json({ message: 'You cannot follow yourself.' });
		}

		// Create the follow relationship
		const follow = new Following({ followed: followedId, by: currentId });
		await follow.save();

		// Update follow counts
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
		// Retrieve the current user's ID using their email
		const currentUser = await User.findOne({ email });
		if (!currentUser) {
			return res.status(404).json({ message: 'Current user not found.' });
		}
		const currentId = currentUser._id;

		// Retrieve the ID of the user to unfollow
		const userToUnfollow = await User.findById(followedId);
		if (!userToUnfollow) {
			return res.status(404).json({ message: 'User to unfollow not found.' });
		}

		if (String(currentId) === String(followedId)) {
			return res.status(400).json({ message: 'You cannot unfollow yourself.' });
		}

		// Delete the follow relationship
		const unfollowResult = await Following.findOneAndDelete({ by: currentId, followed: followedId });
		if (!unfollowResult) {
			return res.status(400).json({ message: 'You are not following this user.' });
		}

		// Update follow counts
		await User.findByIdAndUpdate(currentId, { $inc: { followingsCount: -1 } });
		await User.findByIdAndUpdate(followedId, { $inc: { listenersCount: -1 } });

		res.status(200).json({ message: 'Unfollowed successfully.' });
	} catch (error) {
		console.error("Error in unfollow:", error);
		res.status(500).json({ message: 'Failed to unfollow user.', error: error.message });
	}
});


module.exports = router;
