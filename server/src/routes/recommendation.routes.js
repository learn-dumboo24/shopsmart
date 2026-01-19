const express = require('express');
const { optionalAuth } = require('../middleware/auth.middleware');
const recommendationService = require('../services/recommendation.service');

const router = express.Router();

// GET /api/recommendations/:productId
router.get('/:productId', optionalAuth, (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    const recommendations = recommendationService.recommend(req.params.productId, limit);
    res.json({ count: recommendations.length, recommendations });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
