const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();
const getIP = require('./utility/getIP');

const connectDB = require('./config/db');
const keys = require('./config/keys');

// Connect to database
connectDB(keys.mongoURI);

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
require('./config/passport')(passport);

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/leaderboards', require('./routes/leaderboards'));
app.use('/api/badges', require('./routes/badges'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://${getIP()}:${PORT}`);
  });
