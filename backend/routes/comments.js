const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
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

    try {
        const comment = new Comment({ parentId, parentType, author, content });
        await comment.save();
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
 * 
 * Response:
 * - comments (Array): List of comments for the specified post or comment
 */
router.get('/:parentId', async (req, res) => {
    const { parentId } = req.params;
    const { parentType } = req.query;

    try {
        const comments = await Comment.find({ parentId, parentType }).populate('author');
        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: 'Failed to retrieve comments', error: error.message });
    }
});

module.exports = router;
