// In-memory cart store - keyed by userId
// Replace with DB-backed session/cart collection later
const carts = {};

function getCart(userId) {
  if (!carts[userId]) carts[userId] = [];
  return carts[userId];
}

function addItem(userId, productId, quantity) {
  const cart = getCart(userId);
  const existing = cart.find(item => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  return cart;
}

function removeItem(userId, productId) {
  if (!carts[userId]) return [];
  carts[userId] = carts[userId].filter(item => item.productId !== productId);
  return carts[userId];
}

function clearCart(userId) {
  carts[userId] = [];
}

module.exports = { getCart, addItem, removeItem, clearCart };
