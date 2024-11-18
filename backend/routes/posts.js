const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { authenticateUser } = require('../utils/validation');
const Comment = require('../models/Comment');
const User = require('../models/User');
const upload = require('../utils/upload'); // Import the upload utility


////////////////////////////////////////////////////////////////////////
// CREATE A NEW POST
////////////////////////////////////////////////////////////////////////
/**
 * POST /posts
 * Creates a new post
 * 
 * Request Attributes:
 * - content (String): Text content of the post
 * - imageURL (String, optional): URL of an image associated with the post
 * - categoryId (ObjectId): ID of the category to which the post belongs
 * 	
 * Response:
 * - message (String): Confirmation message
 * - post (Object): Created post data
 */

router.post('/', authenticateUser, upload.single('image'), async (req, res) => {
    const { content, categoryId } = req.body;
    const email = req.body.email || req.params.email || req.headers['x-user-email'];;	
	
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const imageURL = req.file ? `/uploads/${req.file.filename}` : null;

        const post = new Post({
            author: user._id,
            content,
            imageURL,
            categoryId
        });

        await post.save();
        res.status(201).json({ message: 'Post created successfully', post });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: 'Failed to create post', error: error.message });
    }
});


////////////////////////////////////////////////////////////////////////
// GET ALL POSTS
////////////////////////////////////////////////////////////////////////
/**
 * GET /posts
 * Fetches all posts
 * 
 * Response:
 * - posts (Array): List of all posts
 */
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('author').populate('categoryId').sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: 'Failed to retrieve posts', error: error.message });
    }
});

////////////////////////////////////////////////////////////////////////
// GET A SPECIFIC POST BY ID
////////////////////////////////////////////////////////////////////////
/**
 * GET /posts/:id
 * Fetches a single post by ID
 * 
 * Request Parameters:
 * - id (ObjectId): The ID of the post to retrieve
 * 
 * Response:
 * - post (Object): The requested post data
 */
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author').populate('categoryId');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.status(200).json(post);
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ message: 'Failed to retrieve post', error: error.message });
    }
});


const deleteCommentAndReplies = async (commentId) => {
    const replies = await Comment.find({ parentId: commentId, parentType: 'Comment' });

    for (const reply of replies) {
        await deleteCommentAndReplies(reply._id); // Recursive call
    }

    await Comment.findByIdAndDelete(commentId);
};

const deletePostCommentsAndReplies = async (postId) => {
    const comments = await Comment.find({ parentId: postId, parentType: 'Post' });
    for (const comment of comments) {
        await deleteCommentAndReplies(comment._id); // Recursive call for each top-level comment
    }
};

////////////////////////////////////////////////////////////////////////
// DELETE A POST AND ITS COMMENTS
////////////////////////////////////////////////////////////////////////
/**
 * DELETE /posts/:id
 * Deletes a post by its ID and all associated comments, including nested replies.
 * 
 * Request Parameters:
 * - id (ObjectId): The ID of the post to delete.
 * 
 * Authorization:
 * - The user must be the author of the post or an admin to delete it.
 * 
 * Behavior:
 * - Deletes the post.
 * - Deletes all comments associated with the post, including nested replies.
 * 
 * Response:
 * - message (String): Confirmation message upon successful deletion.
 * - error (String, optional): Error message if the operation fails.
 */
router.delete('/:id', authenticateUser, async (req, res) => {
    const { id } = req.params; // ID of the post to delete
    const { email } = req.body; // Email of the user attempting to delete the post

    try {
        // Fetch the user making the request
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Find the post to delete
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // Check if the user is the author or an admin
        if (String(post.author) !== String(user._id)) {
            return res.status(403).json({ message: 'You are not authorized to delete this post.' });
        }

        // Delete all comments and their replies associated with this post
        await deletePostCommentsAndReplies(id);

        // Delete the post itself
        await Post.findByIdAndDelete(id);

        res.status(200).json({ message: 'Post and all associated comments (including replies) deleted successfully.' });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: 'Failed to delete post.', error: error.message });
    }
});

////////////////////////////////////////////////////////////////////////
// UPDATE A POST
////////////////////////////////////////////////////////////////////////
/**
 * PATCH /posts/:id
 * Updates a post by its ID.
 * 
 * Request Parameters:
 * - id (ObjectId): The ID of the post to update.
 * 
 * Request Body:
 * - content (String, optional): Updated content of the post.
 * - imageURL (String, optional): Updated image URL for the post.
 * - categoryId (ObjectId, optional): Updated category ID for the post.
 * 
 * Authorization:
 * - The user must be the author of the post to update it.
 * 
 * Response:
 * - message (String): Confirmation message upon successful update.
 * - post (Object): Updated post data.
 */
router.patch('/:id', authenticateUser, upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { email, content, categoryId } = req.body;

    try {
        // Fetch the user making the request
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Find the post to update
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // Check if the user is the author of the post
        if (String(post.author) !== String(user._id)) {
            return res.status(403).json({ message: 'You are not authorized to update this post.' });
        }

        // Update the post fields
        if (content) post.content = content;
        if (categoryId) post.categoryId = categoryId;

        // Update the image if provided
        if (req.file) {
            post.imageURL = `/uploads/${req.file.filename}`;
        }

        // Save the updated post
        await post.save();

        res.status(200).json({ message: 'Post updated successfully.', post });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ message: 'Failed to update post.', error: error.message });
    }
});



module.exports = router;
