const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, auto: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    profilePicture: { type: String, default: '' },
    bio: { type: String, default: '' },
    thoughtsCount: { type: Number, default: 0 },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
