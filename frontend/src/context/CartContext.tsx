/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { cartService } from '../services/cartService';
import type { Cart } from '../services/cartService';
import toast from 'react-hot-toast';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) {
      setCart(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch {
      setError('Failed to fetch cart');
      setCart(null);
      toast.error('Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await cartService.addToCart(productId, quantity);
      await fetchCart();
      toast.success('Item added to cart');
    } catch {
      toast.error('Failed to add item to cart');
    }
  };

  const updateCartItem = async (itemId: number, quantity: number) => {
    if (!user) {
      toast.error('Please login to update cart');
      return;
    }

    try {
      await cartService.updateCartItem(itemId, quantity);
      await fetchCart();
      toast.success('Cart updated');
    } catch {
      toast.error('Failed to update cart');
    }
  };

  const removeFromCart = async (itemId: number) => {
    if (!user) {
      toast.error('Please login to remove items from cart');
      return;
    }

    try {
      await cartService.removeFromCart(itemId);
      await fetchCart();
      toast.success('Item removed from cart');
    } catch {
      toast.error('Failed to remove item from cart');
    }
  };

  const clearCart = async () => {
    if (!user) {
      toast.error('Please login to clear cart');
      return;
    }

    try {
      await cartService.clearCart();
      await fetchCart();
      toast.success('Cart cleared');
    } catch {
      toast.error('Failed to clear cart');
    }
  };

  const refreshCart = async () => {
    await fetchCart();
  };

  // Fetch cart when user changes
  useEffect(() => {
    fetchCart();
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
