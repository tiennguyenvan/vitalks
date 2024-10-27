const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, auto: true },    
    email: { type: String, required: true, unique: true },
    profilePicture: { type: String, default: '' },
    bio: { type: String, default: '' },
    thoughtsCount: { type: Number, default: 0 },
    listenersCount: { type: Number, default: 0 },
    followingsCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
