// __tests__/registerUser.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');
const { User } = require('../models/User'); // Adjust the path according to your project structure
const { registerUser } = require('../controllers/userController'); // Adjust the path according to your project structure

const app = express();
app.use(express.json());
app.post('/api/users', registerUser);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    binary: {
      version: '4.4.6', // Specify a version that you know works
    },
  });
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  if (mongoServer) {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
});

describe('POST /api/users', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(201);
    expect(res.body.msg).toBe('User registered successfully');

    const user = await User.findOne({ email: 'test@example.com' });
    expect(user).not.toBeNull();
    expect(user.username).toBe('testuser');
    expect(user.email).toBe('test@example.com');
    const isPasswordValid = await bcrypt.compare('password123', user.password);
    expect(isPasswordValid).toBe(true);
  });
});
