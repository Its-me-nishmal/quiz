const User = require('../models/User');

exports.getCategoryLeaderboard = async (req, res) => {
  const { category, level } = req.params;
  try {
    const users = await User.find();
    const leaderboard = users
      .map(user => ({
        username: user.username,
        score: user.scores
          .filter(score => score.category === category && score.level === level)
          .reduce((total, score) => total + score.score, 0),
      }))
      .sort((a, b) => b.score - a.score);
    res.json(leaderboard);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getOverallLeaderboard = async (req, res) => {
  try {
    const users = await User.find();
    const leaderboard = users
      .map(user => ({
        username: user.username,
        totalScore: user.totalScore, // Use totalScore directly
      }))
      .sort((a, b) => b.totalScore - a.totalScore); // Sort by totalScore
    res.json(leaderboard);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

