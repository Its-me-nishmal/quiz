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
  const { answers } = req.body; // Extract answers from the request body
  const user = req.user; // Get the user from the request

  try {
    // Find all quizzes that contain questions with the given IDs
    const quizzes = await Quiz.find({ "questions.options._id": { $in: answers.map(a => a.id) } });
    if (!quizzes.length) {
      return res.status(404).json({ msg: 'Quizzes not found' });
    }

    let totalScore = 0;
    const answeredQuestionIds = new Set(user.answeredQuestions.map(aq => aq.questionId.toString())); // Set of already answered question IDs

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
          totalScore++; // Increment total score for correct answer
          
          const key = `${quiz.category}-${quiz.level}`;
          const currentScore = scoreMap.get(key) || 0;
          scoreMap.set(key, currentScore + 1); // Update the score for the category and level

          answeredQuestionIds.add(answer.id); // Add the question ID to the set
          user.answeredQuestions.push({
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
        existingScore.score = Math.max(existingScore.score, score); // Ensure we keep the highest score
      } else {
        user.scores.push({ category, level, score }); // Add new score entry if it doesn't exist
      }
    });

    user.totalScore = (user.totalScore || 0) + totalScore; // Update total score

    await user.save(); // Save user data
    res.json({ currentQuizScore: totalScore, grandTotalScore: user.totalScore }); // Respond with the total score for the current quiz submission and the grand total score
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error'); // Handle server error
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
