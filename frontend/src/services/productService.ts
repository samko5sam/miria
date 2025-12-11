import { apiClient } from "../utils/apiUtils";

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
  store_name?: string;
  store_id?: string;
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
    const response = await apiClient.post(
      `/products`,
      { name, description, price }
    );
    return response.data;
  },

  /**
   * Get all products for the current seller
   */

  getMyProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get(`/products/my`);
    return response.data;
  },

  /**
   * Get all products (public) with optional filtering and sorting
   */
  getAllProducts: async (search?: string, sort?: string): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (sort) params.append('sort', sort);
    
    const response = await apiClient.get(`/products?${params.toString()}`);
    return response.data;
  },

  /**
   * Get a specific product by ID
   */
  getProduct: async (productId: number): Promise<Product> => {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
  },

  /**
   * Delete a product
   */

  deleteProduct: async (productId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/products/${productId}`);
    return response.data;
  },

  /**
   * Upload a file for a product
   */
  uploadProductFile: async (
    productId: number,
    file: File
  ): Promise<{ message: string; file: ProductFile }> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post(
      `/products/${productId}/files`,
      formData,
      {
        headers: {
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
    const response = await apiClient.delete(
      `/products/${productId}/files/${fileId}`
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
    const response = await apiClient.get(
      `/products/${productId}/files/${fileId}/download`
    );
    return response.data;
  },
};
