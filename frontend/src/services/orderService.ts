import { apiClient } from "../utils/apiUtils";
import type { Order } from "../types";

export const orderService = {
  /**
   * Get all paid orders for the current user
   */
  getMyOrders: async (status: string = 'paid'): Promise<Order[]> => {
    const response = await apiClient.get(`/my-orders?status=${status}`);
    return response.data;
  },

  payOrder: async (orderId: number): Promise<{ checkout_url: string }> => {
    const response = await apiClient.post(`/orders/${orderId}/pay`);
    return response.data;
  },

  cancelOrder: async (orderId: number): Promise<void> => {
    await apiClient.post(`/orders/${orderId}/cancel`);
  },
};
