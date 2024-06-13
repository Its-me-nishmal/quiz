const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const auth = require('../middlewares/auth');

// Get leaderboard by category and level
router.get('/:category/:level', auth, leaderboardController.getCategoryLeaderboard);

// Get overall leaderboard
router.get('/', auth, leaderboardController.getOverallLeaderboard);

module.exports = router;
