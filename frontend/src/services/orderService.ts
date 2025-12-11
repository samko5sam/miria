import { apiClient } from "../utils/apiUtils";
import type { Order } from "../types";

export const orderService = {
  /**
   * Get all paid orders for the current user
   */
  getMyOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get(`/my-orders`);
    return response.data;
  },
};
