import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { productService, type Product } from '../services/productService';

const DiscoverPage: React.FC = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const fetchProducts = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await productService.getAllProducts(searchQuery, sortBy);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error(t('discover.errorFetching'));
    } finally {
      setLoading(false);
    }
  }, [searchQuery, sortBy, t]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timer);
  }, [fetchProducts]);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden pt-6 pb-24">
      <div className="flex-1 pb-24">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 flex flex-col bg-background-light dark:bg-background-dark pt-4 max-w-7xl mx-auto px-4 w-full">
          <div className="flex items-center gap-4 pb-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('discover.title')}</h1>
            <div className="flex-1"></div>

            {/* Search Bar */}
            <div className="relative hidden md:block w-64">
              <input
                type="text"
                placeholder={t('discover.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <span className="material-symbols-outlined absolute left-3 top-2 text-slate-400 text-lg">search</span>
            </div>

            {/* Mobile Search Button (toggles input - simplified for now just always show input on mobile or separate row) */}

            <button className="flex md:hidden h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-slate-200/50 dark:bg-white/10 text-slate-900 dark:text-white">
              <span className="material-symbols-outlined">search</span>
            </button>
            <div className="relative group">
              <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-slate-200/50 dark:bg-white/10 text-slate-900 dark:text-white">
                <span className="material-symbols-outlined">sort</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl py-2 hidden group-hover:block z-20">
                <button onClick={() => setSortBy('newest')} className={`w-full text-left px-4 py-2 text-sm ${sortBy === 'newest' ? 'text-primary font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'}`}>
                  {t('discover.sort.newest')}
                </button>
                <button onClick={() => setSortBy('price_low')} className={`w-full text-left px-4 py-2 text-sm ${sortBy === 'price_low' ? 'text-primary font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'}`}>
                  {t('discover.sort.priceLow')}
                </button>
                <button onClick={() => setSortBy('price_high')} className={`w-full text-left px-4 py-2 text-sm ${sortBy === 'price_high' ? 'text-primary font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'}`}>
                  {t('discover.sort.priceHigh')}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Search Input (Visible only on small screens) */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder={t('discover.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <span className="material-symbols-outlined absolute left-3 top-2 text-slate-400 text-lg">search</span>
            </div>
          </div>

          {/* Category Tags (Removed as per request, keeping layout structure just in case) */}
          {/* <div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-2 hide-scrollbar">
            <button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white">All</button>
             ...
          </div> */}
        </div>

        {/* Product Grid */}
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">inventory_2</span>
              <p className="text-slate-500 dark:text-slate-400 font-medium">{t('discover.noProducts')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`} className="group block">
                  <div className="flex flex-col gap-3">
                    <div className="relative w-full overflow-hidden rounded-2xl bg-slate-200 dark:bg-white/5 aspect-[3/4] group-hover:shadow-lg transition-all duration-300">
                      {/* Placeholder for product image since we don't have a main image field yet, using first file if image or generic */}
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-primary">
                        <span className="material-symbols-outlined text-6xl">image</span>
                      </div>

                      {/* Favorite Button (Visual only for now) */}
                      <button className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 opacity-0 group-hover:opacity-100">
                        <span className="material-symbols-outlined text-sm">favorite</span>
                      </button>
                    </div>
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-slate-900 dark:text-white text-base font-medium leading-normal truncate flex-1">{product.name}</p>
                        <p className="text-primary font-bold text-sm">${product.price}</p>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal truncate">by {product.store_name}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
