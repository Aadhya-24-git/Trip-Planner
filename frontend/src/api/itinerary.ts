import { apiClient } from './client';
import { ItineraryResponse } from '../types';

export interface GenerateItineraryPayload {
  destination_name: string;
  starting_city: string;
  duration_days: number;
  travelers_count: number;
  travel_style: string;
  interests: string[];
  trip_pace: string;
  accommodation_type: string;
  transportation: string;
  budget?: number;
}

export const generateItinerary = async (payload: GenerateItineraryPayload): Promise<ItineraryResponse> => {
  const res = await apiClient.post<ItineraryResponse>('/api/itinerary/generate', payload);
  return res.data;
};
