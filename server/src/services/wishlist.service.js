const wishlistData = require('../data/wishlist');
const { getById } = require('./product.service');

function getWishlist(userId) {
  const ids = wishlistData.getWishlist(userId);
  // Enrich with product details
  return ids.map(id => {
    try {
      return getById(id);
    } catch (_) {
      return null;
    }
  }).filter(Boolean);
}

function addToWishlist(userId, productId) {
  getById(productId); // validate product exists
  wishlistData.addToWishlist(userId, productId);
  return getWishlist(userId);
}

function removeFromWishlist(userId, productId) {
  wishlistData.removeFromWishlist(userId, productId);
  return getWishlist(userId);
}

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
