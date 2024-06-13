const nodemailer = require('nodemailer');
const keys = require('../config/keys');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: keys.emailUser,
    pass: keys.emailPass,
  },
});

const sendPasswordResetEmail = (email, resetLink) => {
  const mailOptions = {
    from: keys.emailUser,
    to: email,
    subject: 'Password Reset Request',
    text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error sending email:', err);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

const sendApiKeyEmail = (email, apiKey) => {
  const mailOptions = {
    from: keys.emailUser,
    to: email,
    subject: 'Your API Key',
    text: `Here is your API key: ${apiKey}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error sending email:', err);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

module.exports = { sendPasswordResetEmail, sendApiKeyEmail };
