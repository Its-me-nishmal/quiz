const mongoose = require('mongoose');

const AnsweredQuestionSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  category: { type: String, required: true },
  level: { type: String, required: true }
});

const UserSchema = new mongoose.Schema({
  name: { type: String },
  username: { type: String, sparse: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  scores: [{ category: String, score: Number, level: String }],
  badges: [String],
  apiKey: { type: String, unique: true },
  isAdmin: { type: Boolean, default: false },
  answeredQuestions: [AnsweredQuestionSchema],
  totalScore: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', UserSchema);
