import { apiClient } from "../utils/apiUtils";

export interface Store {
  id: number;
  name: string;
  description: string;
  user_id?: number;
  created_at: string;
}

export const storeService = {
  registerStore: async (name: string, description: string): Promise<{ message: string; store: Store; user_role: string }> => {
    const response = await apiClient.post(
      `/stores/`,
      { name, description }
    );
    return response.data;
  },

  getMyStore: async (): Promise<Store> => {
    const response = await apiClient.get(`/stores/my`);
    return response.data;
  },

  getStore: async (storeId: number): Promise<Store> => {
    const response = await apiClient.get(`/stores/${storeId}`);
    return response.data;
  },

  getStoreProducts: async (storeId: number): Promise<any[]> => {
    const response = await apiClient.get(`/stores/${storeId}/products`);
    return response.data;
  },

  updateMyStore: async (name: string, description: string): Promise<{ message: string; store: Store }> => {
    const response = await apiClient.put(
      `/stores/my`,
      { name, description }
    );
    return response.data;
  },
};
