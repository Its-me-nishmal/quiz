const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const User = require('../models/User');

const auth = async (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, keys.jwtSecret);
    req.user = decoded.user;

    // Fetch user from database
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    // Attach user and isAdmin to request object
    req.user = user;
    req.user.isAdmin = user.isAdmin;

    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;
