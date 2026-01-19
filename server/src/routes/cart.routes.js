const express = require('express');
const { body } = require('express-validator');
const { authMiddleware } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const cartService = require('../services/cart.service');

const router = express.Router();

// All cart routes require auth
router.use(authMiddleware);

// GET /api/cart
router.get('/', (req, res, next) => {
  try {
    const cart = cartService.getCart(req.user.id);
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

// POST /api/cart/add
router.post(
  '/add',
  [
    body('productId').notEmpty().withMessage('productId is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  ],
  validate,
  (req, res, next) => {
    try {
      const { productId, quantity } = req.body;
      const cart = cartService.addItem(req.user.id, productId, parseInt(quantity));
      res.json({ message: 'Item added to cart', cart });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/cart/:productId
router.delete('/:productId', (req, res, next) => {
  try {
    const cart = cartService.removeItem(req.user.id, req.params.productId);
    res.json({ message: 'Item removed from cart', cart });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
