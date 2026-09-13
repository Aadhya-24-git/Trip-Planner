import { apiClient } from './client';
import { Destination } from '../types';

export interface DestinationFilterParams {
  state?: string;
  search?: string;
  style?: string;
  mood?: string;
  max_budget?: number;
}

export const getDestinations = async (params?: DestinationFilterParams): Promise<Destination[]> => {
  const res = await apiClient.get<Destination[]>('/api/destinations', { params });
  return res.data;
};

export const getDestinationById = async (id: number): Promise<Destination> => {
  const res = await apiClient.get<Destination>(`/api/destinations/${id}`);
  return res.data;
};

export const getStates = async (): Promise<string[]> => {
  const res = await apiClient.get<string[]>('/api/destinations/states');
  return res.data;
};
