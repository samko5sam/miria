import React, { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { storeService } from '../services/storeService';
import type { Store } from '../services/storeService';

const SellerDashboardPage: React.FC = () => {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const data = await storeService.getMyStore();
        setStore(data);
      } catch (error) {
        console.error('Failed to fetch store', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('seller.dashboard.title')}</h1>
          {store && (
            <p className="text-white/70 mt-2">
              <Trans
                i18nKey="seller.dashboard.welcome"
                values={{ storeName: store.name }}
                components={{ 1: <span className="text-primary font-semibold" /> }}
              />
            </p>
          )}
        </div>
        <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-bold transition-colors">
          {t('seller.dashboard.addNewProduct')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="bg-black/20 p-6 rounded-xl border border-white/5">
          <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-2">{t('seller.dashboard.stats.totalSales')}</h3>
          <p className="text-3xl font-bold text-white">$0.00</p>
        </div>
        <div className="bg-black/20 p-6 rounded-xl border border-white/5">
          <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-2">{t('seller.dashboard.stats.totalOrders')}</h3>
          <p className="text-3xl font-bold text-white">0</p>
        </div>
        <div className="bg-black/20 p-6 rounded-xl border border-white/5">
          <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-2">{t('seller.dashboard.stats.products')}</h3>
          <p className="text-3xl font-bold text-white">0</p>
        </div>
      </div>

      <div className="bg-black/20 rounded-xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-xl font-bold text-white">{t('seller.dashboard.recentOrders.title')}</h3>
        </div>
        <div className="p-6 text-center text-white/50">
          {t('seller.dashboard.recentOrders.empty')}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;
