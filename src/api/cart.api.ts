import { apiClient } from './client';
import { CartItem } from '@/types';

export const cartApi = {
  viewCart: async () => {
    const response = await apiClient.post<{ items: CartItem[] }>('/v1/view_cart');
    return response.data.items;
  },

  addToCart: async (productId: string, quantity: number) => {
    const response = await apiClient.post('/v1/add_to_cart', {
      product_id: productId,
      quantity,
    });
    return response.data;
  },

  removeFromCart: async (productId: string) => {
    const response = await apiClient.post('/v1/remove_from_cart', {
      product_id: productId,
    });
    return response.data;
  },

  updateQuantity: async (productId: string, quantity: number) => {
    const response = await apiClient.post('/v1/update_cart_item', {
      product_id: productId,
      quantity,
    });
    return response.data;
  },

  clearCart: async () => {
    const response = await apiClient.post('/v1/clear_cart');
    return response.data;
  },
};
