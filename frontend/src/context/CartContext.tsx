/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';
import { cartService } from '../services/cartService';
import type { Cart } from '../services/cartService';
import type { Product } from '../types';
import toast from 'react-hot-toast';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  isInCart: (productId: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { t } = useTranslation();

  const fetchCart = async (silent: boolean = false) => {
    // If no user, fetch from local storage
    if (!user) {
      try {
        if (!silent) setLoading(true);
        const cartData = await cartService.getCart();
        setCart(cartData);
      } catch (e) {
        console.error("Failed to load local cart", e);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      if (!silent) setLoading(true);
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

  const addToCart = async (product: Product, quantity: number = 1) => {
    try {
      await cartService.addToCart(product, quantity);
      await fetchCart(true);
      // Toast is handled by the calling component to avoid duplicates
    } catch (error) {
      // Re-throw to let calling component handle specific errors
      throw error;
    }
  };

  const isInCart = (productId: number): boolean => {
    if (!cart) return false;
    return cart.items.some(item => item.product_id === productId);
  };

  const updateCartItem = async (itemId: number, quantity: number) => {
    if (!user) {
      // Allow updating local cart
    }

    try {
      await cartService.updateCartItem(itemId, quantity);
      await fetchCart(true);
      toast.success(t('toast.cartUpdated'));
    } catch {
      toast.error(t('toast.updateCartFailed'));
    }
  };

  const removeFromCart = async (itemId: number) => {
    if (!user) {
      // Allow removing from local cart
    }

    try {
      await cartService.removeFromCart(itemId);
      await fetchCart(true);
      toast.success(t('toast.itemRemoved'));
    } catch {
      toast.error(t('toast.removeItemFailed'));
    }
  };

  const clearCart = async () => {
    if (!user) {
      // Allow clearing local cart
    }

    try {
      await cartService.clearCart();
      await fetchCart();
      toast.success(t('toast.cartCleared'));
    } catch {
      toast.error(t('toast.clearCartFailed'));
    }
  };

  const refreshCart = async () => {
    await fetchCart();
  };

  // Fetch cart when user changes and handle merge
  useEffect(() => {
    const initCart = async () => {
      if (user) {
        // Attempt to merge local cart if exists
        try {
          await cartService.mergeCart();
        } catch (e) {
          console.error("Merge cart failed", e);
        }
      }
      await fetchCart();
    };
    initCart();
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
        clearCart,
        refreshCart,
        isInCart,
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
