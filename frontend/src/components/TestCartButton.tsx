import React, { useState } from 'react';

import { useCart } from '../context/CartContext';
import { productService } from '../services/productService';
import toast from 'react-hot-toast';

interface TestCartButtonProps {
  productId?: number;
}

const TestCartButton: React.FC<TestCartButtonProps> = ({ productId = 3 }) => {
  const { addToCart } = useCart();
  const [currentId, setCurrentId] = useState(productId.toString());

  const handleTestAddToCart = async () => {
    const id = parseInt(currentId, 10);
    if (isNaN(id)) {
      toast.error('Invalid Product ID');
      return;
    }

    try {
      // Fetch a real product
      const product = await productService.getProduct(id);
      await addToCart(product, 1);
      toast.success(`Test product ${id} added to cart!`);
    } catch {
      toast.error('Failed to add test product to cart');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={currentId}
        onChange={(e) => setCurrentId(e.target.value)}
        className="w-20 px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-zinc-800 dark:text-white"
        placeholder="ID"
      />
      <button
        onClick={handleTestAddToCart}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors whitespace-nowrap"
      >
        Test Add (ID: {currentId})
      </button>
    </div>
  );
};

export default TestCartButton;
