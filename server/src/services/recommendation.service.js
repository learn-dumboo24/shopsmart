const products = require('../data/products');
const { getById } = require('./product.service');

// Simple logic-based recommendation:
// Returns products from the same category as the given product
// Excludes the product itself, sorted by rating desc
// TODO: replace with ML model or collaborative filtering API in production
function recommend(productId, limit = 4) {
  const product = getById(productId); // throws 404 if not found

  const recommendations = products
    .filter(p => p.category === product.category && p.id !== productId)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);

  return recommendations;
}

module.exports = { recommend };
