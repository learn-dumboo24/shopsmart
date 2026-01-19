const express = require('express');
const { authMiddleware } = require('../middleware/auth.middleware');
const analyticsService = require('../services/analytics.service');

const router = express.Router();

// GET /api/analytics/summary - protected
router.get('/summary', authMiddleware, (req, res, next) => {
  try {
    const summary = analyticsService.getSummary();
    res.json(summary);
  } catch (err) {
    next(err);
  }
});

// GET /api/analytics/top-products - protected
router.get('/top-products', authMiddleware, (req, res, next) => {
  try {
    const topProducts = analyticsService.getTopProducts();
    res.json({ topProducts });
  } catch (err) {
    next(err);
  }
});

// GET /api/analytics/eco-stats - protected
router.get('/eco-stats', authMiddleware, (req, res, next) => {
  try {
    const ecoStats = analyticsService.getEcoStats();
    res.json(ecoStats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
