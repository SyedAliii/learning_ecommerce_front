import { apiClient } from './client';
import { User } from '@/types';

export const usersApi = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post<{ access_token: string; user: User }>('/v1/login', {
      email,
      password,
    });
    return response.data;
  },

  register: async (email: string, password: string, fullName: string) => {
    const response = await apiClient.post<{ access_token: string; user: User }>('/v1/register', {
      email,
      password,
      full_name: fullName,
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get<User>('/v1/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await apiClient.put<User>('/v1/profile', data);
    return response.data;
  },
};
