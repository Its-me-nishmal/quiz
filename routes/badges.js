const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badgeController');
const auth = require('../middlewares/auth');

// Get all badges
router.get('/', auth, badgeController.getAllBadges);

// Award badge to user
router.post('/award', auth, badgeController.awardBadge);

module.exports = router;
