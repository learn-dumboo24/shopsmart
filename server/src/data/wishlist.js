// In-memory wishlist store - keyed by userId
const wishlists = {};

function getWishlist(userId) {
  if (!wishlists[userId]) wishlists[userId] = [];
  return wishlists[userId];
}

function addToWishlist(userId, productId) {
  const list = getWishlist(userId);
  if (!list.includes(productId)) {
    list.push(productId);
  }
  return list;
}

function removeFromWishlist(userId, productId) {
  if (!wishlists[userId]) return [];
  wishlists[userId] = wishlists[userId].filter(id => id !== productId);
  return wishlists[userId];
}

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
