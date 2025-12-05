import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const TestCartButton: React.FC = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleTestAddToCart = async () => {
    if (!user) {
      toast.error('Please login to test cart functionality');
      return;
    }

    try {
      // Add a test product to cart (product ID 1)
      await addToCart(3, 1);
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
