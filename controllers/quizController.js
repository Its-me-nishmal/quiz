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
    // Find all quizzes that contain questions with the given IDs
    const quizzes = await Quiz.find({ "questions.options._id": { $in: answers.map(a => a.id) } });
    if (!quizzes.length) {
      return res.status(404).json({ msg: 'Quizzes not found' });
    }

    let totalScore = 0;
    const answeredQuestionIds = new Set(user.answeredQuestions.map(aq => aq.questionId.toString()));
    const newAnsweredQuestions = [];

    // Create a map to store the highest scores for each category and level
    const scoreMap = new Map();

    // Iterate through each answer
    answers.forEach(answer => {
      if (answeredQuestionIds.has(answer.id)) {
        return; // Skip if the question has already been answered
      }

      quizzes.forEach(quiz => {
        const question = quiz.questions.find(q => q.options.some(o => o._id.toString() === answer.id));
        if (question && question.answerId.toString() === answer.id) {
          totalScore++;
          
          const key = `${quiz.category}-${quiz.level}`;
          const currentScore = scoreMap.get(key) || 0;
          scoreMap.set(key, currentScore + 1);

          newAnsweredQuestions.push({
            questionId: question._id,
            category: quiz.category,
            level: quiz.level
          });
        }
      });
    });

    // Update user's scores based on the scoreMap
    scoreMap.forEach((score, key) => {
      const [category, level] = key.split('-');
      const existingScore = user.scores.find(s => s.category === category && s.level === level);
      if (existingScore) {
        existingScore.score = Math.max(existingScore.score, score);
      } else {
        user.scores.push({ category, level, score });
      }
    });

    user.totalScore = (user.totalScore || 0) + totalScore;
    user.answeredQuestions.push(...newAnsweredQuestions);

    await user.save();
    res.json({ score: totalScore });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};



exports.addQuiz = async (req, res) => {
  try {
    const quizzes = req.body; // Expecting an array of quiz objects
    const newQuizzes = await Quiz.insertMany(quizzes);
    res.json(newQuizzes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
