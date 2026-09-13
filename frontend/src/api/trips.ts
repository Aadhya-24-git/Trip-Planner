import { apiClient } from './client';
import { SavedTrip } from '../types';

export const saveTrip = async (tripData: Partial<SavedTrip>): Promise<SavedTrip> => {
  const res = await apiClient.post<SavedTrip>('/api/trips', tripData);
  return res.data;
};

export const getSavedTrips = async (): Promise<SavedTrip[]> => {
  const res = await apiClient.get<SavedTrip[]>('/api/trips');
  return res.data;
};

export const getTripById = async (id: number): Promise<SavedTrip> => {
  const res = await apiClient.get<SavedTrip>(`/api/trips/${id}`);
  return res.data;
};

export const updateTrip = async (id: number, data: Partial<SavedTrip>): Promise<SavedTrip> => {
  const res = await apiClient.put<SavedTrip>(`/api/trips/${id}`, data);
  return res.data;
};

export const duplicateTrip = async (id: number): Promise<SavedTrip> => {
  const res = await apiClient.post<SavedTrip>(`/api/trips/${id}/duplicate`);
  return res.data;
};

export const deleteTrip = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/trips/${id}`);
};
