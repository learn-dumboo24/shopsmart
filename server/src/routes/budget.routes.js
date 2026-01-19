const express = require('express');
const { body } = require('express-validator');
const { authMiddleware } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const budgetService = require('../services/budget.service');

const router = express.Router();

router.use(authMiddleware);

// GET /api/budget
router.get('/', (req, res, next) => {
  try {
    const budgetInfo = budgetService.checkBudget(req.user.id);
    const budget = budgetService.getBudget(req.user.id);
    res.json({ budget, ...budgetInfo });
  } catch (err) {
    next(err);
  }
});

// POST /api/budget - set or update budget
router.post(
  '/',
  [
    body('amount')
      .isFloat({ min: 0.01 })
      .withMessage('Amount must be a number greater than 0'),
  ],
  validate,
  (req, res, next) => {
    try {
      const budget = budgetService.setBudget(req.user.id, parseFloat(req.body.amount));
      res.json({ message: 'Budget set successfully', budget });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
