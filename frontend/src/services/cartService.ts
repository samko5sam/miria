import axios from "axios";
import type { Product } from "./productService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  total: number;
  created_at: string;
  store_name?: string;
  store_id?: number;
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

const LOCAL_CART_KEY = "miria_local_cart";

export const cartService = {
  /**
   * Get the current user's cart (API or Local)
   */
  getCart: async (): Promise<Cart> => {
    const token = localStorage.getItem("token");
    if (token) {
      const response = await axios.get(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } else {
      // Local cart
      const localCartJson = localStorage.getItem(LOCAL_CART_KEY);
      const items: CartItem[] = localCartJson ? JSON.parse(localCartJson) : [];
      const total_items = items.reduce((acc, item) => acc + item.quantity, 0);
      const total_price = items.reduce(
        (acc, item) => acc + item.product_price * item.quantity,
        0
      );

      return {
        cart_id: 0, // Placeholder
        user_id: 0,
        items,
        total_items,
        total_price,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  },

  /**
   * Add an item to the cart
   */
  addToCart: async (
    product: Product,
    quantity: number = 1
  ): Promise<{ message: string; cart_item_id: number }> => {
    const token = localStorage.getItem("token");
    if (token) {
      const response = await axios.post(
        `${API_URL}/cart/items`,
        { product_id: product.id, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } else {
      // Local Storage
      const localCartJson = localStorage.getItem(LOCAL_CART_KEY);
      let items: CartItem[] = localCartJson ? JSON.parse(localCartJson) : [];

      const existingItemIndex = items.findIndex(
        (item) => item.product_id === product.id
      );

      let cart_item_id = 0;

      if (existingItemIndex > -1) {
        items[existingItemIndex].quantity += quantity;
        items[existingItemIndex].total =
          items[existingItemIndex].product_price *
          items[existingItemIndex].quantity;
        cart_item_id = items[existingItemIndex].id;
      } else {
        const newItem: CartItem = {
          id: Date.now(), // Temp ID
          product_id: product.id,
          product_name: product.name,
          product_price: product.price,
          quantity: quantity,
          total: product.price * quantity,
          created_at: new Date().toISOString(),
          // Accessing store info from product (assuming updated backend returns it, or interface has it)
          // We cast to any because Product interface might not strictly have store_name yet in TS definition
          store_name: (product as any).store_name || "Unknown Store",
          store_id: (product as any).store_id,
        };
        items.push(newItem);
        cart_item_id = newItem.id;
      }

      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
      return { message: "Item added to local cart", cart_item_id };
    }
  },

  /**
   * Update cart item quantity
   */
  updateCartItem: async (
    itemId: number,
    quantity: number
  ): Promise<{ message: string; item_id: number; new_quantity: number }> => {
    const token = localStorage.getItem("token");
    if (token) {
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
    } else {
      // Local Storage
      const localCartJson = localStorage.getItem(LOCAL_CART_KEY);
      let items: CartItem[] = localCartJson ? JSON.parse(localCartJson) : [];

      const itemIndex = items.findIndex((item) => item.id === itemId);
      if (itemIndex > -1) {
        items[itemIndex].quantity = quantity;
        items[itemIndex].total =
          items[itemIndex].product_price * quantity;
        localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
        return {
          message: "Local cart updated",
          item_id: itemId,
          new_quantity: quantity,
        };
      }
      throw new Error("Item not found in local cart");
    }
  },

  /**
   * Remove an item from the cart
   */
  removeFromCart: async (itemId: number): Promise<{ message: string }> => {
    const token = localStorage.getItem("token");
    if (token) {
      const response = await axios.delete(
        `${API_URL}/cart/items/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } else {
      // Local Storage
      const localCartJson = localStorage.getItem(LOCAL_CART_KEY);
      let items: CartItem[] = localCartJson ? JSON.parse(localCartJson) : [];
      items = items.filter((item) => item.id !== itemId);
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
      return { message: "Item removed from local cart" };
    }
  },

  /**
   * Clear the entire cart
   */
  clearCart: async (): Promise<{ message: string }> => {
    const token = localStorage.getItem("token");
    if (token) {
      const response = await axios.delete(`${API_URL}/cart/clear`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } else {
      localStorage.removeItem(LOCAL_CART_KEY);
      return { message: "Local cart cleared" };
    }
  },

  /**
   * Merge local cart to server
   */
  mergeCart: async (): Promise<{ message: string; merged_count: number }> => {
    const token = localStorage.getItem("token");
    if (!token) return { message: "Not logged in", merged_count: 0 };

    const localCartJson = localStorage.getItem(LOCAL_CART_KEY);
    const items: CartItem[] = localCartJson ? JSON.parse(localCartJson) : [];

    if (items.length === 0) return { message: "No items to merge", merged_count: 0 };

    const mergeItems = items.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }));

    const response = await axios.post(
      `${API_URL}/cart/merge`,
      { items: mergeItems },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    // Clear local cart after successful merge
    localStorage.removeItem(LOCAL_CART_KEY);
    
    return response.data;
  },
};
