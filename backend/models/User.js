const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({    
    email: { type: String, required: true, unique: true },
    profilePicture: { type: String, default: '' },
    bio: { type: String, default: '' },
    thoughtsCount: { type: Number, default: 0 },
    listenersCount: { type: Number, default: 0 },
    followingsCount: { type: Number, default: 0 },
	name: { type: String, default: null }, // Add name field
    avatar: { type: String, default: null }, // Add avatar URL
    profileBanner: { type: String, default: null }, // Add profileBanner URL
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
