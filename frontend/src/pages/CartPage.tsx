import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import TestCartButton from '../components/TestCartButton';

const CartPage: React.FC = () => {
  const { t } = useTranslation();
  const { cart, loading, error, removeFromCart, clearCart } = useCart();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const discount = 0;

  // Calculate totals
  const subtotal = cart?.total_price || 0;
  const total = subtotal - discount;

  const handleRemoveItem = async (itemId: number) => {
    await removeFromCart(itemId);
  };

  const handleClearCart = async () => {
    await clearCart();
    setShowClearConfirm(false);
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }



  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('cart.title')}</h1>

      <div className="hidden flex gap-4 pb-4">
        <TestCartButton />
      </div>

      {cart && cart.items.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">{t('cart.emptyCart')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{t('cart.emptyCartDescription')}</p>
          <Link
            to="/"
            className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
          >
            {t('cart.browseProducts')}
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Cart Items */}
          {/* Cart Items Grouped by Store */}
          <div className="space-y-6">
            {Object.entries(
              cart?.items.reduce((acc, item) => {
                const storeName = item.store_name || t('cart.unknownStore');
                if (!acc[storeName]) acc[storeName] = [];
                acc[storeName].push(item);
                return acc;
              }, {} as Record<string, typeof cart.items>) || {}
            ).map(([storeName, items]) => (
              <div key={storeName} className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white px-2 border-l-4 border-primary">
                  {storeName}
                </h3>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row gap-4 rounded-xl bg-white dark:bg-zinc-900/50 p-4 justify-between items-center border border-gray-200 dark:border-white/10"
                  >
                    <div className="flex flex-col md:flex-row items-start gap-4 flex-1">
                      <div className="w-20 h-20 rounded-lg flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-white/5">
                        {item.product_image_url ? (
                          <img
                            src={item.product_image_url}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <span className="text-3xl font-bold text-primary/30">
                              {item.product_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center gap-1 flex-1">
                        <Link to={`/products/${item.product_id}`} className="text-gray-900 dark:text-white text-base font-medium leading-normal hover:underline">
                          {item.product_name}
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">
                          ${item.product_price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                          <span className="text-base font-medium leading-normal">
                            {t('cart.quantity')}: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-900 dark:text-white text-base font-bold leading-normal w-24 text-right">
                        ${(item.product_price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-600 transition-colors p-2"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Promo Code Field */}
          {/* <div className="flex max-w-full flex-wrap items-end gap-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-14">
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl bg-white dark:bg-zinc-900/50 text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-200 dark:border-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-[15px] rounded-r-none border-r-0 text-base font-normal leading-normal"
                  placeholder={t('cart.promoCodePlaceholder')}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button
                  onClick={handleApplyPromo}
                  className="text-white bg-gray-900 dark:bg-white dark:text-gray-900 font-bold flex items-center justify-center px-6 rounded-r-xl border-l-0"
                >
                  {t('cart.apply')}
                </button>
              </div>
            </label>
          </div> */}

          {/* Order Summary */}
          <div className="p-4 bg-white dark:bg-zinc-900/50 rounded-xl border border-gray-200 dark:border-white/10">
            <div className="flex justify-between gap-x-6 py-2">
              <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
                {t('cart.subtotal')}
              </p>
              <p className="text-gray-900 dark:text-white text-base font-medium leading-normal text-right">
                ${subtotal.toFixed(2)}
              </p>
            </div>
            {discount > 0 && (
              <div className="flex justify-between gap-x-6 py-2">
                <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
                  {t('cart.discount')}
                </p>
                <p className="text-green-600 dark:text-green-400 text-base font-medium leading-normal text-right">
                  -${discount.toFixed(2)}
                </p>
              </div>
            )}
            <div className="my-2 border-t border-dashed border-gray-200 dark:border-white/10"></div>
            <div className="flex justify-between gap-x-6 py-2">
              <p className="text-gray-500 dark:text-gray-400 text-lg font-normal leading-normal">
                {t('cart.total')}
              </p>
              <p className="text-gray-900 dark:text-white text-lg font-bold leading-normal text-right">
                ${total.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex-1 bg-gray-200 dark:bg-zinc-800 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors"
            >
              {t('cart.clearCart')}
            </button>
            <Link
              to="/checkout"
              className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors text-center"
            >
              {t('cart.checkout')}{` `}${total.toFixed(2)}
            </Link>
          </div>
        </div>
      )}

      {/* Clear Cart Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-4">{t('cart.confirmClear')}</h3>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-zinc-800 rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors"
              >
                {t('profilePage.edit.cancel')}
              </button>
              <button
                onClick={handleClearCart}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                {t('cart.clearCart')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
