import { api } from './apiClient';

export const budgetService = {
  getBudget: () => api.get('/api/budget'),
  setBudget: (amount) => api.post('/api/budget', { amount }),
};
