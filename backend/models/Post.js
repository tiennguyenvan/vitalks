const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    imageURL: { type: String, default: '' }, // Optional image URL for the post
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Linking to the Category schema
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
