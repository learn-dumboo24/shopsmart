const express = require('express');
const { body } = require('express-validator');
const { authMiddleware } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const wishlistService = require('../services/wishlist.service');

const router = express.Router();

router.use(authMiddleware);

// GET /api/wishlist
router.get('/', (req, res, next) => {
  try {
    const wishlist = wishlistService.getWishlist(req.user.id);
    res.json({ count: wishlist.length, wishlist });
  } catch (err) {
    next(err);
  }
});

// POST /api/wishlist
router.post(
  '/',
  [body('productId').notEmpty().withMessage('productId is required')],
  validate,
  (req, res, next) => {
    try {
      const wishlist = wishlistService.addToWishlist(req.user.id, req.body.productId);
      res.json({ message: 'Added to wishlist', wishlist });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/wishlist/:productId
router.delete('/:productId', (req, res, next) => {
  try {
    const wishlist = wishlistService.removeFromWishlist(req.user.id, req.params.productId);
    res.json({ message: 'Removed from wishlist', wishlist });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
