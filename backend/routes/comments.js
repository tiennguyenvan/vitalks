const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const User = require('../models/User');
const Post = require('../models/Post'); // Ensure you import the Post model
const { authenticateUser } = require('../utils/validation');

////////////////////////////////////////////////////////////////////////
// CREATE A NEW COMMENT
////////////////////////////////////////////////////////////////////////
/**
 * POST /comments
 * Creates a new comment on a post or another comment
 * 
 * Request Attributes:
 * - parentId (ObjectId): ID of the post or comment this comment is replying to
 * - parentType (String): Type of the parent ('Post' or 'Comment')
 * - author (ObjectId): ID of the comment's author (User)
 * - content (String): Text content of the comment
 * 
 * Response:
 * - message (String): Confirmation message
 * - comment (Object): Created comment data
 */
router.post('/', authenticateUser, async (req, res) => {
	const { parentId, parentType, author, content } = req.body;
	const email = req.body.email;
	try {
		const author = await User.findOne({ email });
        if (!author) {
            return res.status(404).json({ message: 'User not found.' });
        }

		const comment = new Comment({ parentId, parentType, author, content });
		await comment.save();

		if (parentType === 'Post') {
			await Post.findByIdAndUpdate(
				parentId,
				{ $inc: { commentsCount: 1 } },
				{ new: true }
			);
		} else if (parentType === 'Comment') {
			await Comment.findByIdAndUpdate(
				parentId,
				{ $inc: { repliesCount: 1 } },
				{ new: true }
			);
		}
		res.status(201).json({ message: 'Comment created successfully', comment });
	} catch (error) {
		console.error("Error creating comment:", error);
		res.status(500).json({ message: 'Failed to create comment', error: error.message });
	}
});

////////////////////////////////////////////////////////////////////////
// GET ALL COMMENTS FOR A POST OR COMMENT
////////////////////////////////////////////////////////////////////////
/**
 * GET /comments/:parentId
 * Fetches all comments for a specific post or comment
 * 
 * Request Parameters:
 * - parentId (ObjectId): The ID of the parent post or comment
 * - parentType (String): Type of the parent ('Post' or 'Comment')
 * - limit (Number): The number of comments
 * 
 * Response:
 * - comments (Array): List of comments for the specified post or comment
 */
router.get('/:parentId', async (req, res) => {
	const { parentId } = req.params;
	const { parentType, limit } = req.query;

	try {
		const query = { parentId, parentType: parentType || 'Post' };
		const comments = await Comment.find(query)
			.populate('author')
			.limit(limit && !isNaN(limit) ? parseInt(limit) : 0)
			.sort({ createdAt: -1 }); // Sort by newest first
		res.status(200).json(comments);
	} catch (error) {
		console.error("Error fetching comments:", error);
		res.status(500).json({ message: 'Failed to retrieve comments', error: error.message });
	}
});


////////////////////////////////////////////////////////////////////////
// DELETE A COMMENT AND ITS REPLIES
////////////////////////////////////////////////////////////////////////
/**
 * DELETE /comments/:id
 * Deletes a comment and all its nested replies.
 * 
 * Request Parameters:
 * - id (ObjectId): The ID of the comment to delete.
 * 
 * Authorization:
 * - Only the author of the comment or an admin can delete the comment.
 * 
 * Behavior:
 * - If the comment is associated with a Post, decrements the `commentsCount` of the parent Post.
 * - If the comment is a reply to another Comment, decrements the `repliesCount` of the parent Comment.
 * - Recursively deletes all replies to the comment and their replies.
 * 
 * Response:
 * - message (String): Confirmation message.
 * - error (String, optional): Error message if the operation fails.
 */

const deleteCommentAndReplies = async (commentId) => {
	// Find all replies to this comment
	const replies = await Comment.find({ parentId: commentId, parentType: 'Comment' });

	// Recursively delete each reply and its replies
	for (const reply of replies) {
		await deleteCommentAndReplies(reply._id); // Recursive call
	}

	// Delete the comment itself
	await Comment.findByIdAndDelete(commentId);
};

router.delete('/:id', authenticateUser, async (req, res) => {
	const { id } = req.params;	
	const email = req.body.email;	

	try {
		const author = await User.findOne({ email });
        if (!author) {
            return res.status(404).json({ message: 'User not found.' });
        }

		// Find the comment to delete
		const comment = await Comment.findById(id);
		if (!comment) {
			return res.status(404).json({ message: 'Comment not found' });
		}
		
		// Ensure the logged-in user is the author of the comment
		if (author._id.toString() !== comment.author._id.toString()) {
			return res.status(403).json({ message: 'You are not authorized to delete this comment' });
		}		

		// Decrement repliesCount or commentsCount on the parent
		if (comment.parentType === 'Post') {
			await Post.findByIdAndUpdate(
				comment.parentId,
				{ $inc: { commentsCount: -1 } },
				{ new: true }
			);
		} else if (comment.parentType === 'Comment') {
			await Comment.findByIdAndUpdate(
				comment.parentId,
				{ $inc: { repliesCount: -1 } },
				{ new: true }
			);
		}

		// Delete the comment and all its replies recursively
		await deleteCommentAndReplies(id);

		res.status(200).json({ message: 'Comment and all replies deleted successfully' });
	} catch (error) {
		console.error("Error deleting comment:", error);
		res.status(500).json({ message: 'Failed to delete comment', error: error.message });
	}
});

module.exports = router;
