import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface ProductFile {
  id: number;
  filename: string;
  file_size: number;
  content_type: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  user_id: number;
  created_at: string;
  files: ProductFile[];
}

export const productService = {
  /**
   * Create a new product
   */
  createProduct: async (
    name: string,
    description: string,
    price: number
  ): Promise<{ message: string; product_id: number }> => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/products`,
      { name, description, price },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  /**
   * Get all products for the current seller
   */
  getMyProducts: async (): Promise<Product[]> => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/products/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * Get all products (public)
   */
  getAllProducts: async (): Promise<Product[]> => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  },

  /**
   * Get a specific product by ID
   */
  getProduct: async (productId: number): Promise<Product> => {
    const response = await axios.get(`${API_URL}/products/${productId}`);
    return response.data;
  },

  /**
   * Delete a product
   */
  deleteProduct: async (productId: number): Promise<{ message: string }> => {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * Upload a file for a product
   */
  uploadProductFile: async (
    productId: number,
    file: File
  ): Promise<{ message: string; file: ProductFile }> => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${API_URL}/products/${productId}/files`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  /**
   * Delete a product file
   */
  deleteProductFile: async (
    productId: number,
    fileId: number
  ): Promise<{ message: string }> => {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${API_URL}/products/${productId}/files/${fileId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  /**
   * Get download URL for a product file
   */
  getProductFileDownloadUrl: async (
    productId: number,
    fileId: number
  ): Promise<{ download_url: string }> => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_URL}/products/${productId}/files/${fileId}/download`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};
