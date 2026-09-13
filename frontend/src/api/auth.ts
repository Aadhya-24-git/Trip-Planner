import { apiClient } from './client';
import { User } from '../types';

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const register = async (email: string, password: string, fullName: string, homeCity: string): Promise<AuthResponse> => {
  const res = await apiClient.post<AuthResponse>('/api/auth/register', {
    email,
    password,
    full_name: fullName,
    home_city: homeCity
  });
  return res.data;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await apiClient.post<AuthResponse>('/api/auth/login', { email, password });
  return res.data;
};

export const getMe = async (): Promise<User> => {
  const res = await apiClient.get<User>('/api/auth/me');
  return res.data;
};

export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const res = await apiClient.put<User>('/api/auth/profile', data);
  return res.data;
};
