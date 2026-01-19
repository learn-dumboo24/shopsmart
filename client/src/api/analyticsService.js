import { api } from './apiClient';

export const analyticsService = {
  getSummary: () => api.get('/api/analytics/summary'),
  getTopProducts: () => api.get('/api/analytics/top-products'),
  getEcoStats: () => api.get('/api/analytics/eco-stats'),
};
