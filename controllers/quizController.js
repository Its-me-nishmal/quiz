const Quiz = require('../models/Quiz');

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getQuizByCategory = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ category: req.params.category, level: req.params.level });
    res.json(quizzes);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.submitQuiz = async (req, res) => {
  const { answers } = req.body;
  const user = req.user;

  try {
    const quizzes = await Quiz.find({ "questions._id": { $in: answers.map(a => a.id) } });
    if (!quizzes.length) {
      return res.status(404).json({ msg: 'Quizzes not found' });
    }

    let score = 0;
    const answeredQuestionIds = new Set();

    answers.forEach(answerId => {
      if (answeredQuestionIds.has(answerId)) {
        return; // Skip if the question has already been answered
      }
      answeredQuestionIds.add(answerId);

      quizzes.forEach(quiz => {
        const question = quiz.questions.find(q => q._id.toString() === answerId);
        if (question) {
          score++;
          const existingScore = user.scores.find(
            s => s.category === quiz.category && s.level === quiz.level
          );
          if (existingScore) {
            existingScore.score = Math.max(existingScore.score, score);
          } else {
            user.scores.push({ category: quiz.category, level: quiz.level, score });
          }
        }
      });
    });

    user.totalScore = (user.totalScore || 0) + score;

    await user.save();
    res.json({ score });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.addQuiz = async (req, res) => {
  try {
    const newQuiz = new Quiz(req.body);
    await newQuiz.save();
    res.json(newQuiz);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
