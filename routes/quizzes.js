const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const auth = require('../middlewares/auth');

// Get all quizzes
router.get('/', quizController.getAllQuizzes);

// Get quiz by category and level
router.get('/:category/:level', quizController.getQuizByCategory);

// Submit quiz answers
router.post('/submit', auth, quizController.submitQuiz);

module.exports = router;
