const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { authenticateUser } = require('../utils/validation');
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
    const email = req.body.email;
	
	
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
        const posts = await Post.find().populate('author').populate('categoryId');
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

module.exports = router;
