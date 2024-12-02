const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { authenticateUser } = require('../utils/validation');

////////////////////////////////////////////////////////////////////////
// CREATE A NEW CATEGORY
////////////////////////////////////////////////////////////////////////
/**
 * POST /categories
 * Creates a new category
 * 
 * Request Attributes:
 * - name (String): The name of the category
 * 
 * Response:
 * - message (String): Confirmation message
 * - category (Object): Created category data
 */
router.post('/', authenticateUser, async (req, res) => {
	const { name } = req.body;

	try {
		const category = new Category({ name });
		await category.save();
		res.status(201).json({ message: 'Category created successfully', category });
	} catch (error) {
		console.error("Error creating category:", error);
		res.status(500).json({ message: 'Failed to create category', error: error.message });
	}
});

////////////////////////////////////////////////////////////////////////
// GET ALL CATEGORIES
////////////////////////////////////////////////////////////////////////
/**
 * GET /categories
 * Fetches all categories
 * 
 * Response:
 * - categories (Array): List of all categories
 */
router.get('/', async (req, res) => {
	try {
		const categories = await Category.find();
		res.status(200).json(categories);
	} catch (error) {
		console.error("Error fetching categories:", error);
		res.status(500).json({ message: 'Failed to retrieve categories', error: error.message });
	}
});

module.exports = router;
