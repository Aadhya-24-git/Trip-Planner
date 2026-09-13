import { apiClient } from './client';
import { TripPreferences, RecommendationResponse } from '../types';

export const getRecommendations = async (preferences: TripPreferences): Promise<RecommendationResponse> => {
  const res = await apiClient.post<RecommendationResponse>('/api/recommendations', preferences);
  return res.data;
};
