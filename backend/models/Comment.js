const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    parentId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Can refer to either Post or Comment
    parentType: { type: String, enum: ['Post', 'Comment'], required: true }, // Specifies whether parentId is a Post or Comment
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
	repliesCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);
