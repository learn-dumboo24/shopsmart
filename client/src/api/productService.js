import { api } from './apiClient';

export const productService = {
  getProducts: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.eco) params.set('eco', filters.eco);
    if (filters.search) params.set('search', filters.search);
    const query = params.toString();
    return api.get(`/api/products${query ? `?${query}` : ''}`);
  },

  getProduct: (id) => api.get(`/api/products/${id}`),

  compareByCategory: (id) => api.get(`/api/products/${id}/compare`),
};
