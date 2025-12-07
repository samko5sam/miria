import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const { cart, loading, error, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState(user?.email || '');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cart || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    try {
      // In a real app, this would call a payment API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear cart after successful payment
      await clearCart();

      toast.success('Payment successful! Your order is being processed.');
      navigate('/');
    } catch {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('checkout.title')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{t('loginPage.title')}</p>
          <Link
            to="/login"
            className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
          >
            {t('login')}
          </Link>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('checkout.title')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Your cart is empty</p>
          <Link
            to="/"
            className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
          >
            {t('cart.browseProducts')}
          </Link>
        </div>
      </div>
    );
  }

  // Calculate totals
  const subtotal = cart.total_price;
  const taxes = subtotal * 0.07; // 7% tax
  const total = subtotal + taxes;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl pb-32">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('checkout.title')}</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Information Section */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            {t('checkout.contactInfo')}
          </h2>
          <div className="mt-4">
            <label className="flex w-full flex-col">
              <p className="pb-2 text-base font-medium text-gray-700 dark:text-gray-200">
                {t('checkout.emailLabel')}
              </p>
              <input
                className="form-input h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-white p-4 text-base font-normal leading-normal text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-primary"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <p className="px-1 pt-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              {t('checkout.emailDescription')}
            </p>
          </div>
        </section>

        {/* Payment Method Section */}
        <section className="pt-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            {t('checkout.paymentMethod')}
          </h2>
          <div className="mt-4 flex flex-col space-y-3">
            {/* Credit Card Option */}
            <div className="rounded-lg border-2 border-primary bg-primary/10 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex size-5 items-center justify-center rounded-full border-2 border-primary">
                    <div className="size-2.5 rounded-full bg-primary"></div>
                  </div>
                  <label className="ml-3 font-medium text-gray-900 dark:text-white" htmlFor="card">
                    {t('checkout.creditCard')}
                  </label>
                </div>
                <div className="flex items-center space-x-1">
                  <img className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyQevac8NTYZuqtD7Q3kV467n4lWlIDDTUF6Waq0iIol6CnHYBdqkfvRD8jOdWia1ravvJET-_5Tn8ai5ovGuJlPeG50CIEvtF0NLMsqLe9Xmlz0YsqILzUdoe7IJD098_JWwnpn7tI7edm1eAIhrncHVr_VsJjVW5mZ4pNY7IJE8Iz8nzc2NSxdTod_nDfcidktrty5_2JokngDqRwYJk7A9VrN3OPRwdhsHPtyiae3Z5_d8aL0AwGwnGbtGmiGw3NvCg_Lo7VLQQ" alt="Visa" />
                  <img className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5WN1yDKjuvC8CgfMUz7jSRkdG8GYFWrBuq3QK4S1g1Zpd-ISr_ay2EBkXGNFO9i7it-s64XWYNNIGRmQdIhRad6f4EQYNQ8LxsSK9Ai-6JCwyqOSy_X35E1WYpJlPzBzbEOcAd6qK8-DPZ2cSVEpO17kEvaPLp6OPkaD8zCls77eqz4oXZ-fXSnrjCnO839Q-2Pd9S3ODp02SrIwYuakj_k5PHVp2yEtLN0wMxqDZCn1JaslCwBrn59Fz9qcP0kmNKu7ILif1R-Vx" alt="Mastercard" />
                  <img className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz7PtrMnm8liHWS69Fo1wcbMSNfDG3rInKWXFSmZQBFY0sw5434jwbRQIkoWkEaaPTlrt1sXGBMhaViNx0luNfHq6QJqEYLlWCxlShKfFukmFVT9vHAiW7AkZEDW-j4651tt_pwIF09zzDRxZ85BcUPPAFmet_VpBhoJj-VPEsMBvBuTbMDgfVFO-KkIStYQC2aiH8Qbc0Qo-5Qa4GsEsmiQIKZkiOj7MMilcUcdupWMFBKxc5BSxI7M3-VvfoBEKJrDf_jcIyyY8g" alt="American Express" />
                </div>
              </div>
              <div className="mt-4 space-y-4">
                <div className="relative">
                  <input
                    className="form-input h-14 w-full rounded-lg border border-gray-300 bg-white p-4 pr-12 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                  />
                  <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">credit_card</span>
                </div>
                <div className="flex space-x-4">
                  <input
                    className="form-input h-14 w-full rounded-lg border border-gray-300 bg-white p-4 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="MM / YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    required
                  />
                  <div className="relative flex-1">
                    <input
                      className="form-input h-14 w-full rounded-lg border border-gray-300 bg-white p-4 pr-12 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-500"
                      placeholder="CVC"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      required
                    />
                    <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">lock</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PayPal Option */}
            <button
              type="button"
              onClick={() => setPaymentMethod('paypal')}
              className="flex h-14 w-full items-center justify-between rounded-lg border border-gray-300 bg-white p-4 text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              <div className="flex items-center">
                <div className="flex size-5 items-center justify-center rounded-full border border-gray-400 dark:border-gray-500">
                  {paymentMethod === 'paypal' && <div className="size-2.5 rounded-full bg-primary"></div>}
                </div>
                <span className="ml-3 font-medium">{t('checkout.paypal')}</span>
              </div>
              <img className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0tVdF6yUsTYVjqGm_cDo0NaU3cefKgcsumbRwicZHhjmxP-MqTujkR7SVBsW1A7SYDdxCYOUhDiWZaP7rY5RQvIKsc7PvP6xAbN8XK_DFoBJdxk9he5J1C9mAtnyCHA0YZ2NpdTGFW5EkaZyAOVhNS7jrP2mRwLjZvIY0fFg7Lb_z_qry-A5k0oG8iUa4otzi6pYY8tJmVpx70B8_X5MhBqyq1VsK3XBpckkBeWH1GUileFy02Ri_OnIKhwLLcb2abYa8GGhux9OD" alt="PayPal" />
            </button>
          </div>
        </section>

        {/* Order Summary Section */}
        <section className="pt-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            {t('checkout.orderSummary')}
          </h2>
          <div className="mt-4 rounded-xl border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                  {item.product_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{item.product_name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('checkout.digitalProduct')}</p>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">${(item.product_price * item.quantity).toFixed(2)}</p>
              </div>
            ))}

            <div className="my-4 border-t border-dashed border-gray-300 dark:border-gray-700"></div>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>{t('cart.subtotal')}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>{t('checkout.taxes')}</span>
                <span>${taxes.toFixed(2)}</span>
              </div>
            </div>
            {/* <div className="my-4 border-t border-dashed border-gray-300 dark:border-gray-700"></div>
            <div className="flex items-end space-x-2">
              <label className="flex-grow">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('checkout.discountCode')}</span>
                <input
                  className="form-input mt-1 h-12 w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder={t('cart.promoCodePlaceholder')}
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                />
              </label>
              <button className="h-12 flex-shrink-0 rounded-lg bg-gray-200 px-4 font-semibold text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                {t('cart.apply')}
              </button>
            </div> */}
          </div>
        </section>

        {/* Fixed Footer / CTA */}
        <footer className="fixed bottom-0 left-0 right-0 z-10 w-full border-t border-white/10 bg-background-light/80 p-4 backdrop-blur-sm dark:bg-background-dark/80">
          <div className="flex items-center justify-between pb-3">
            <span className="font-semibold text-gray-600 dark:text-gray-300">{t('cart.total')}</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">${total.toFixed(2)}</span>
          </div>
          <button
            type="submit"
            disabled={isProcessing}
            className="flex h-14 w-full items-center justify-center rounded-xl bg-primary font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-70"
          >
            {isProcessing ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
                {t('profilePage.cropModal.processing')}...
              </>
            ) : (
              t('checkout.payButton', { amount: total.toFixed(2) })
            )}
          </button>
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span>{t('checkout.securePayment')}</span>
          </div>
          <div className="mt-2 flex justify-center gap-4 text-center text-xs text-gray-500 underline dark:text-gray-400">
            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">{t('checkout.terms')}</a>
            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">{t('checkout.privacy')}</a>
          </div>
        </footer>
      </form>
    </div>
  );
};

export default CheckoutPage;
