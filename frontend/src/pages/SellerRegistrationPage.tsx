import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { storeService } from '../services/storeService';
import toast from 'react-hot-toast';

const SellerRegistrationPage: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await storeService.registerStore(name, description);
      toast.success(t('seller.registration.success'));
      // Force a reload or update context to reflect role change
      // For now, we rely on the next fetch of user profile or just redirect
      window.location.href = '/dashboard';
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('seller.registration.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-8 bg-black/20 p-8 rounded-xl">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-white">
            {t('seller.registration.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-white/70">
            {t('seller.registration.subtitle')}
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white/80">
              {t('seller.registration.storeName')}
            </label>
            <div className="mt-1">
              <input
                id="name"
                name="name"
                type="text"
                required
                maxLength={50}
                disabled={isLoading}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full appearance-none rounded-md border-0 bg-white/5 px-3 py-2 text-white placeholder-white/40 shadow-sm focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-white/50 text-right">{name.length}/50</p>
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-white/80">
              {t('seller.registration.description')}
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                name="description"
                rows={3}
                maxLength={500}
                disabled={isLoading}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full appearance-none rounded-md border-0 bg-white/5 px-3 py-2 text-white placeholder-white/40 shadow-sm focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-white/50 text-right">{description.length}/500</p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center items-center gap-2 rounded-lg bg-primary py-2 px-4 text-base font-bold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading && (
                <span className="material-symbols-outlined animate-spin">
                  progress_activity
                </span>
              )}
              {isLoading ? t('seller.registration.submitting') : t('seller.registration.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerRegistrationPage;
