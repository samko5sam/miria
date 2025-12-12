import React, { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { storeService } from '../services/storeService';
import { productService } from '../services/productService';
import type { Store } from '../services/storeService';
import type { Product } from '../types';
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const SellerDashboardPage: React.FC = () => {
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { t } = useTranslation();

  const fetchData = async () => {
    try {
      const [storeData, productsData] = await Promise.all([
        storeService.getMyStore(),
        productService.getMyProducts(),
      ]);
      setStore(storeData);
      setProducts(productsData);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProductAdded = () => {
    // Refresh products list
    fetchData();
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm(t('seller.products.confirmDelete'))) {
      return;
    }

    try {
      await productService.deleteProduct(productId);
      toast.success(t('seller.products.deleteSuccess'));
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('seller.products.deleteError'));
    }
  };

  const handleEditProduct = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setIsEditModalOpen(true);
    }
  };

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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('seller.dashboard.title')}</h1>
          {store && (
            <p className="text-gray-600 dark:text-white/70 mt-2">
              <Trans
                i18nKey="seller.dashboard.welcome"
                values={{ storeName: store.name }}
                components={{ 1: <span className="text-primary font-semibold" /> }}
              />
            </p>
          )}
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          {t('seller.dashboard.addNewProduct')}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-black/20 p-6 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
          <h3 className="text-gray-500 dark:text-white/60 text-sm font-medium uppercase tracking-wider mb-2">
            {t('seller.dashboard.stats.totalSales')}
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">$0.00</p>
        </div>
        <div className="bg-white dark:bg-black/20 p-6 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
          <h3 className="text-gray-500 dark:text-white/60 text-sm font-medium uppercase tracking-wider mb-2">
            {t('seller.dashboard.stats.totalOrders')}
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
        </div>
        <div className="bg-white dark:bg-black/20 p-6 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
          <h3 className="text-gray-500 dark:text-white/60 text-sm font-medium uppercase tracking-wider mb-2">
            {t('seller.dashboard.stats.products')}
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{products.length}</p>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden mb-8 shadow-sm dark:shadow-none">
        <div className="p-6 border-b border-gray-200 dark:border-white/5">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('seller.products.myProducts')}</h3>
        </div>

        {products.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-gray-300 dark:text-white/20 text-6xl mb-4 block">
              inventory_2
            </span>
            <p className="text-gray-500 dark:text-white/50 text-lg mb-4">{t('seller.products.noProducts')}</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-bold transition-colors inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined">add</span>
              {t('seller.products.addFirstProduct')}
            </button>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDeleteProduct}
                onEdit={handleEditProduct}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm dark:shadow-none">
        <div className="p-6 border-b border-gray-200 dark:border-white/5">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('seller.dashboard.recentOrders.title')}</h3>
        </div>
        <div className="p-6 text-center text-gray-500 dark:text-white/50">
          {t('seller.dashboard.recentOrders.empty')}
        </div>
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={handleProductAdded}
      />

      {/* Edit Product Modal */}
      {selectedProduct && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onProductUpdated={fetchData}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default SellerDashboardPage;

