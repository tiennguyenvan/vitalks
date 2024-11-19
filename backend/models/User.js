const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({    
    email: { type: String, required: true, unique: true },
	name: { type: String, default: null }, // Add name field    
    avatar: { type: String, default: '' },
    cover: { type: String, default: null },
    bio: { type: String, default: '' },
    thoughtsCount: { type: Number, default: 0 },
    listenersCount: { type: Number, default: 0 },
    followingsCount: { type: Number, default: 0 },
    // profileBanner: { type: String, default: null }, // Add profileBanner URL
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
