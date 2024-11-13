// backend/models/Following.js
const mongoose = require('mongoose');

const FollowingSchema = new mongoose.Schema({
    followed: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User being followed
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who follows
}, { timestamps: true });

// Ensure uniqueness: One user can only follow another user once
FollowingSchema.index({ followed: 1, by: 1 }, { unique: true });

module.exports = mongoose.model('Following', FollowingSchema);
