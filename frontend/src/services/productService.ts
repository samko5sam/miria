import { apiClient } from "../utils/apiUtils";
import type { Product, ProductFile } from "../types";

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

  /**
   * Update a product
   */
  updateProduct: async (
    productId: number,
    name: string,
    description: string,
    price: number
  ): Promise<{ message: string; product: Product }> => {
    const response = await apiClient.put(
      `/products/${productId}`,
      { name, description, price }
    );
    return response.data;
  },

  /**
   * Upload a product image
   */
  uploadProductImage: async (
    productId: number,
    image: File
  ): Promise<{ message: string; image_url: string }> => {
    const formData = new FormData();
    formData.append("image", image);

    const response = await apiClient.post(
      `/products/${productId}/image`,
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
   * Delete a product image
   */
  deleteProductImage: async (
    productId: number
  ): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/products/${productId}/image`);
    return response.data;
  },

  /**
   * Toggle product active status
   */
  toggleProductStatus: async (
    productId: number
  ): Promise<{ message: string; is_active: boolean }> => {
    const response = await apiClient.patch(
      `/products/${productId}/toggle-status`
    );
    return response.data;
  },
};
