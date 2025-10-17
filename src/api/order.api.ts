import { apiClient } from './client';
import { Order, OrderStatus } from '@/types';

export const orderApi = {
  createOrder: async () => {
    const headers = {
      Accept: "application/json",
    };
    const response = await apiClient.post('/v1/create_order', {}, { headers });
    return response.data;
  },

  getSingleOrder: async (orderId: string) => {
    const response = await apiClient.get<Order>(`/v1/get_single_order/${orderId}`);
    return response.data;
  },

  // getUserOrders: async () => {
  //   const response = await apiClient.get<Order[]>('/v1/get_user_orders');
  //   return response.data;
  // },

  getAllOrders: async () => {
    const response = await apiClient.get('/v1/get_all_orders');
    const orders = response.data["orders"];
    return orders.map((order: any): Order => ({
      id: order.id,
      user_id: order.user_id,
      username: order.username,
      user_email: order.user_email,
      cart_id: order.cart_id,
      total_items: order.total_items,
      total_price: order.total_price,
      status: order.status as OrderStatus,
    }));
  },

  confirmOrder: async () => {
    const response = await apiClient.post('/v1/confirm_order');
    console.log(response.data);
    return response.data;
  },

  shippedOrder: async (user_id: number, cart_id: number) => {
    const response = await apiClient.post('/v1/shipped_order', { user_id, cart_id });
    return response.data;
  },

  deliveredOrder: async (user_id: number, cart_id: number) => {
    const response = await apiClient.post('/v1/delivered_order', { user_id, cart_id });
    return response.data;
  },
};
