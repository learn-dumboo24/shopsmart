const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate.middleware');
const authService = require('../services/auth.service');

const router = express.Router();

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const result = await authService.register(name, email, password);
      res.status(201).json({ message: 'Registered successfully', ...result });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json({ message: 'Login successful', ...result });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
