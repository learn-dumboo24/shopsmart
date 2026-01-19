import { api } from './apiClient';

export const cartService = {
  getCart: () => api.get('/api/cart'),
  addToCart: (productId, quantity) => api.post('/api/cart/add', { productId, quantity }),
  removeFromCart: (productId) => api.delete(`/api/cart/${productId}`),
};
