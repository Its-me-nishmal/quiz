const admin = (req, res, next) => {
    if (!req.user.isAdmin) {
      return res.status(403).json({ msg: 'User not authorized' });
    }
    next();
  };
  
  module.exports = admin;
  