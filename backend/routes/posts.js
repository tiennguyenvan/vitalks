const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { authenticateUser } = require('../utils/validation');

////////////////////////////////////////////////////////////////////////
// CREATE A NEW POST
////////////////////////////////////////////////////////////////////////
/**
 * POST /posts
 * Creates a new post
 * 
 * Request Attributes:
 * - author (ObjectId): ID of the post's author (User)
 * - content (String): Text content of the post
 * - imageURL (String, optional): URL of an image associated with the post
 * - categoryId (ObjectId): ID of the category to which the post belongs
 * 
 * Response:
 * - message (String): Confirmation message
 * - post (Object): Created post data
 */
router.post('/', authenticateUser, async (req, res) => {
    const { author, content, imageURL, categoryId } = req.body;

    try {
        const post = new Post({ author, content, imageURL, categoryId });
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
