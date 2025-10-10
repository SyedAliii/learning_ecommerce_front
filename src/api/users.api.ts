import { apiClient } from './client';
import { User } from '@/types';

export const usersApi = {
  login: async (email: string, password: string) => {
    const data = {
      "username": email,
      "password": password,
      "grant_type": "password"
    }
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json"
    };

    const response = await apiClient.post('/v1/login', data, { headers });
    const user: User= { ...response.data };
    const access_token: string = response.data.access_token;
    return { user, access_token };
  },

  register: async (name: string, email: string, password: string, address: string, city: string, country: string) => {
    const response = await apiClient.post('/v1/create_user', {
      name,
      email,
      password,
      address,
      city,
      country
    });
    const user: User= { ...response.data };
    const access_token: string = response.data.access_token;
    return { user, access_token };
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
