import { apiClient } from './client';
import { Order } from '@/types';

export const orderApi = {
  createOrder: async (orderData: any) => {
    const response = await apiClient.post<Order>('/v1/create_order', orderData);
    return response.data;
  },

  getSingleOrder: async (orderId: string) => {
    const response = await apiClient.get<Order>(`/v1/get_single_order/${orderId}`);
    return response.data;
  },

  getUserOrders: async () => {
    const response = await apiClient.get<Order[]>('/v1/get_user_orders');
    return response.data;
  },
};
