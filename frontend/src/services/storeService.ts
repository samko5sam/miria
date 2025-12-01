import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface Store {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export const storeService = {
  registerStore: async (name: string, description: string): Promise<{ message: string; store: Store; user_role: string }> => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/stores/`,
      { name, description },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  getMyStore: async (): Promise<Store> => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/stores/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
