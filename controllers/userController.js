const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult, check } = require('express-validator');
const User = require('../models/User');
const { sendPasswordResetEmail, sendApiKeyEmail } = require('../services/mailer');
const generateApiKey = require('../services/apiKeyGenerator');
const keys = require('../config/keys');

exports.registerUser = [
  // Validation and sanitization
  check('name', 'Name is required').not().isEmpty(),
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  async (req, res) => {
    // Validate and handle errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, username, email, password } = req.body;
    try {
      // Check if email already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'Email already exists' });
      }

      // Check if username already exists
      user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({ msg: 'Username already exists' });
      }

      user = new User({ name, username, email, password, apiKey: generateApiKey() });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      sendApiKeyEmail(email, user.apiKey);
      res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
];

exports.loginUser = [
  // Validation and sanitization
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  async (req, res) => {
    // Validate and handle errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const payload = { user: { id: user.id } };
      jwt.sign(payload, keys.jwtSecret, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
];

exports.forgotPassword = [
  // Validation and sanitization
  check('email', 'Please include a valid email').isEmail(),
  async (req, res) => {
    // Validate and handle errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'User not found' });
      }

      const payload = { user: { id: user.id } };
      const token = jwt.sign(payload, keys.jwtSecret, { expiresIn: '1h' });

      const resetLink = `http://localhost:3000/reset-password?token=${token}`;
      sendPasswordResetEmail(email, resetLink);

      res.json({ msg: 'Password reset email sent' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
];
