import { api } from './apiClient';

export const recommendationService = {
  getRecommendations: (productId, limit = 4) =>
    api.get(`/api/recommendations/${productId}?limit=${limit}`),
};
