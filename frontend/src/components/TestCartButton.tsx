import React from 'react';

import { useCart } from '../context/CartContext';
import { productService } from '../services/productService';
import toast from 'react-hot-toast';

const TestCartButton: React.FC = () => {
  const { addToCart } = useCart();

  const handleTestAddToCart = async () => {


    try {
      // Fetch a real product (ID 1 for testing)
      // You might want to ensure product ID 1 exists in your DB or change this ID
      const product = await productService.getProduct(3);
      await addToCart(product, 1);
      toast.success('Test product added to cart!');
    } catch {
      toast.error('Failed to add test product to cart');
    }
  };

  return (
    <button
      onClick={handleTestAddToCart}
      className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors"
    >
      Test Add to Cart
    </button>
  );
};

export default TestCartButton;
