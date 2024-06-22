const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

// User registration
router.post('/register', userController.registerUser);

// User login
router.post('/login', userController.loginUser);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/dashboard');
});

// Forgot password
router.post('/forgot-password', userController.forgotPassword);

router.get('/getUser', auth, userController.getUserProfile);
module.exports = router;
