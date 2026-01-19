const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findByEmail, createUser } = require('../data/users');

const JWT_SECRET = process.env.JWT_SECRET || 'devSecret123';

async function register(name, email, password) {
  // Check if user already exists
  if (findByEmail(email)) {
    const err = new Error('Email already registered');
    err.status = 409;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: crypto.randomUUID(),
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  createUser(newUser);

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    token,
  };
}

async function login(email, password) {
  const user = findByEmail(email);
  if (!user) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token,
  };
}

module.exports = { register, login };
