import { apiClient } from './client';
import { WeatherInfo } from '../types';

export const getWeather = async (destination: string): Promise<WeatherInfo> => {
  const res = await apiClient.get<WeatherInfo>(`/api/weather/${destination}`);
  return res.data;
};
