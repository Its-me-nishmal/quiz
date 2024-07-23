const mongoose = require('mongoose');
const { Schema } = mongoose;

const AnswerSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, default: new mongoose.Types.ObjectId },
  text: { type: String, required: true },
});

const QuestionSchema = new Schema({
  question: { type: String, required: true },
  options: { type: [AnswerSchema], required: true },
  answerId: { type: Schema.Types.ObjectId, required: true },
});

const QuizSchema = new Schema({
  category: { type: String, required: true },
  level: { type: String, required: true, enum: ['easy', 'medium', 'hard'] },
  questions: { type: [QuestionSchema], required: true },
});

module.exports = mongoose.model('Quiz', QuizSchema);
