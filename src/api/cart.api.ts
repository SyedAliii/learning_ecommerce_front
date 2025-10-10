import { apiClient } from './client';
import { CartProduct } from '@/types';
import { useAuthStore } from '@/stores/authStore';

export const cartApi = {
  viewCart: async () => {
    const response = await apiClient.post<{ items: CartProduct[] }>('/v1/view_cart');
    return response.data.items;
  },

  addToCart: async (productId: string, quantity: number) => {
    const data = {
      "product_id": productId,
      "quantity": quantity,
    };
    const headers = {
      "Authorization": "Bearer " + useAuthStore.getState().token,
      "Accept": "application/json"
    };
    const response = await apiClient.post('/v1/add_to_cart', data, { headers });
    return response.data;
  },

  removeFromCart: async (productId: string, quantity: number) => {
    let body = undefined;
    if (quantity <= 0) {
      body = { "product_id": productId };
    } else {
      body = { "product_id": productId, "quantity": quantity };
    }
    const headers = {
      "Authorization": "Bearer " + useAuthStore.getState().token,
      "Accept": "application/json"
    };
    const response = await apiClient.post('/v1/remove_from_cart', body, { headers });
    return response.data;
  },
  clearCart: async () => {
    const headers = {
      "Authorization": "Bearer " + useAuthStore.getState().token,
      "Accept": "application/json"
    };
    const response = await apiClient.post('/v1/delete_cart', {}, { headers });
    return response.data;
  },
};
