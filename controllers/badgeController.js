const Badge = require('../models/Badge');
const User = require('../models/User');

exports.getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.find();
    res.json(badges);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.awardBadge = async (req, res) => {
  const { userId, badgeId } = req.body;
  try {
    const user = await User.findById(userId);
    const badge = await Badge.findById(badgeId);

    if (!user || !badge) {
      return res.status(404).json({ msg: 'User or Badge not found' });
    }

    if (!user.badges.includes(badgeId)) {
      user.badges.push(badgeId);
      await user.save();
    }

    res.json({ msg: 'Badge awarded' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
