import { api } from './apiClient';

export const orderService = {
  placeOrder: (items) => api.post('/api/orders', { items }),
  getOrders: () => api.get('/api/orders'),
  getOrder: (id) => api.get(`/api/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/api/orders/${id}/status`, { status }),
};
