import { apiClient } from "../utils/apiUtils";

export interface Store {
  id: number;
  name: string;
  description: string;
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
};
