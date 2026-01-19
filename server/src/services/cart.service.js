const cartData = require('../data/cart');
const { getById } = require('./product.service');

function getCart(userId) {
  const items = cartData.getCart(userId);

  // Enrich cart with product details
  const enriched = items.map(item => {
    try {
      const product = getById(item.productId);
      return { ...item, product };
    } catch (_) {
      return { ...item, product: null }; // product may have been removed
    }
  });

  const total = enriched.reduce((sum, item) => {
    if (item.product) {
      return sum + item.product.price * item.quantity;
    }
    return sum;
  }, 0);

  return { items: enriched, total: parseFloat(total.toFixed(2)) };
}

function addItem(userId, productId, quantity) {
  // Validate product exists
  getById(productId);
  return cartData.addItem(userId, productId, quantity);
}

function removeItem(userId, productId) {
  return cartData.removeItem(userId, productId);
}

function clearCart(userId) {
  cartData.clearCart(userId);
}

module.exports = { getCart, addItem, removeItem, clearCart };
