const Quiz = require('../models/Quiz');

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getQuizByCategory = async (req, res) => {
  const { category, level } = req.params;
  try {
    const quizzes = await Quiz.find({ category, level });
    res.json(quizzes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.submitQuiz = async (req, res) => {
  const { userId, category, level, answers } = req.body;
  try {
    const quiz = await Quiz.findOne({ category, level });
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    const score = answers.reduce((total, answer, index) => {
      return total + (answer === quiz.questions[index].answer ? 1 : 0);
    }, 0);

    // Assuming User model is already imported
    const user = await User.findById(userId);
    const existingScore = user.scores.find(
      (score) => score.category === category && score.level === level
    );

    if (existingScore) {
      existingScore.score = Math.max(existingScore.score, score);
    } else {
      user.scores.push({ category, level, score });
    }

    await user.save();
    res.json({ score });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.addQuiz = async (req, res) => {
  const { category, level, questions } = req.body;

  try {
    // Create new quiz
    const newQuiz = new Quiz({
      category,
      level,
      questions,
    });

    await newQuiz.save();
    res.json(newQuiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};