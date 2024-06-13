const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  category: { type: String, required: true },
  level: { type: String, required: true, enum: ['easy', 'medium', 'hard'] },
  questions: [{ question: String, options: [String], answer: String }],
});

module.exports = mongoose.model('Quiz', QuizSchema);
