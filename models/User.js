const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: Stirng },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  scores: [{ category: String, score: Number }],
  badges: [String],
  apiKey: { type: String, unique: true },
  isAdmin: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', UserSchema);
