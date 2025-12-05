import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartIcon: React.FC = () => {
  const { cart } = useCart();

  const itemCount = cart?.total_items || 0;

  return (
    <Link to="/cart" className="relative">
      <button className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden hover:bg-gray-100 dark:hover:bg-white/10 transition-colors focus:outline-none">
        <span className="material-symbols-outlined text-2xl">shopping_cart</span>
      </button>
      {/* Cart item count badge */}
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
