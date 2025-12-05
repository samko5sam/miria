import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  total: number;
  created_at: string;
}

export interface Cart {
  cart_id: number;
  user_id: number;
  items: CartItem[];
  total_items: number;
  total_price: number;
  created_at: string;
  updated_at: string;
}

export const cartService = {
  /**
   * Get the current user's cart
   */
  getCart: async (): Promise<Cart> => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * Add an item to the cart
   */
  addToCart: async (
    productId: number,
    quantity: number = 1
  ): Promise<{ message: string; cart_item_id: number }> => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/cart/items`,
      { product_id: productId, quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  /**
   * Update cart item quantity
   */
  updateCartItem: async (
    itemId: number,
    quantity: number
  ): Promise<{ message: string; item_id: number; new_quantity: number }> => {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/cart/items/${itemId}`,
      { quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  /**
   * Remove an item from the cart
   */
  removeFromCart: async (itemId: number): Promise<{ message: string }> => {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/cart/items/${itemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * Clear the entire cart
   */
  clearCart: async (): Promise<{ message: string }> => {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/cart/clear`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
