import { api } from './apiClient';

export const wishlistService = {
  getWishlist: () => api.get('/api/wishlist'),
  addToWishlist: (productId) => api.post('/api/wishlist', { productId }),
  removeFromWishlist: (productId) => api.delete(`/api/wishlist/${productId}`),
};
