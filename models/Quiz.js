const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, auto: true },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: String, required: true },
});

const QuizSchema = new mongoose.Schema({
  category: { type: String, required: true },
  level: { type: String, required: true, enum: ['easy', 'medium', 'hard'] },
  questions: { type: [QuestionSchema], required: true },
});

module.exports = mongoose.model('Quiz', QuizSchema);
