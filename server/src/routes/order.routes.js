const express = require('express');
const { body, param } = require('express-validator');
const { authMiddleware } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const orderService = require('../services/order.service');
const { ORDER_STATUSES } = require('../data/orders');

const router = express.Router();

// All order routes require auth
router.use(authMiddleware);

// POST /api/orders - place a new order
router.post(
  '/',
  [
    body('items').isArray({ min: 1 }).withMessage('items must be a non-empty array'),
    body('items.*.productId').notEmpty().withMessage('Each item must have a productId'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Each item quantity must be >= 1'),
  ],
  validate,
  (req, res, next) => {
    try {
      const order = orderService.placeOrder(req.user.id, req.body.items);
      res.status(201).json({ message: 'Order placed successfully', order });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/orders - get all orders for logged-in user
router.get('/', (req, res, next) => {
  try {
    const orders = orderService.getByUser(req.user.id);
    res.json({ count: orders.length, orders });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:id - get single order
router.get('/:id', (req, res, next) => {
  try {
    const order = orderService.getOrderById(req.params.id, req.user.id);
    res.json(order);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/orders/:id/status - update order status (admin or system use)
router.patch(
  '/:id/status',
  [
    body('status').isIn(ORDER_STATUSES).withMessage(`Status must be one of: ${ORDER_STATUSES.join(', ')}`),
  ],
  validate,
  (req, res, next) => {
    try {
      const updated = orderService.updateStatus(req.params.id, req.body.status);
      res.json({ message: 'Order status updated', order: updated });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
