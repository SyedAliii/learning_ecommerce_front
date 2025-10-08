import { apiClient } from './client';
import { Product } from '@/types';

export const productsApi = {
  getAll: async () => {
    const response = await apiClient.get<Product[]>('/v1/get_all_products');
    return response.data;
  },

  getSingle: async (productId: string) => {
    const response = await apiClient.get<Product>(`/v1/get_single_product/${productId}`);
    return response.data;
  },

  search: async (query: string) => {
    const response = await apiClient.get<Product[]>('/v1/search', {
      params: { query },
    });
    return response.data;
  },
};
