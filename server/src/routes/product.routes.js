const express = require('express');
const { query } = require('express-validator');
const validate = require('../middleware/validate.middleware');
const productService = require('../services/product.service');

const router = express.Router();

// GET /api/products?category=electronics&eco=true&search=keyword
router.get(
  '/',
  [
    query('eco').optional().isIn(['true', 'false']).withMessage('eco must be true or false'),
  ],
  validate,
  (req, res, next) => {
    try {
      const { category, eco, search } = req.query;
      const products = productService.filter({ category, eco, search });
      res.json({ count: products.length, products });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/products/:id
router.get('/:id', (req, res, next) => {
  try {
    const product = productService.getById(req.params.id);
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id/compare
router.get('/:id/compare', (req, res, next) => {
  try {
    const similar = productService.compareByCategory(req.params.id);
    res.json({ similar });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
