const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  scores: [{ category: String, score: Number }],
  badges: [String],
  apiKey: { type: String, unique: true },
});

module.exports = mongoose.model('User', UserSchema);
