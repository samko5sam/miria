import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import type { Order } from '../types';
import toast from 'react-hot-toast';

const OrdersPage: React.FC = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
      toast.error(t('orders.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (productId: number, fileId: number) => {
    try {
      const { download_url } = await productService.getProductFileDownloadUrl(productId, fileId);
      window.open(download_url, '_blank');
    } catch (error) {
      console.error('Failed to get download URL', error);
      toast.error(t('orders.failedToDownload'));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{t('orders.title')}</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900/50 rounded-xl border border-gray-200 dark:border-white/10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('orders.noOrders')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{t('orders.noOrdersDescription')}</p>
          <Link
            to="/"
            className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors inline-block"
          >
            {t('orders.browseProducts')}
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-zinc-900/50 rounded-xl p-6 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      {order.product.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <Link
                        to={`/products/${order.product.id}`}
                        className="text-xl font-bold text-gray-900 dark:text-white hover:underline block mb-1"
                      >
                        {order.product.name}
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('orders.orderId')}: {order.order_id || `M-${order.id}`}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('orders.date')}: {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 min-w-[150px]">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    ${order.amount_paid.toFixed(2)}
                  </p>
                  <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold uppercase">
                    {t('orders.paid')}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                  {t('orders.downloads')}
                </h3>

                {order.product.files.length > 0 ? (
                  <div className="grid gap-3">
                    {order.product.files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-200 dark:border-white/5"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span className="material-symbols-outlined text-gray-400">description</span>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate" title={file.filename}>
                              {file.filename.split('/').pop()?.split('_').slice(1).join('_') || file.filename}
                            </span>
                            <span className="text-xs text-gray-500">
                              {(file.file_size / (1024 * 1024)).toFixed(2)} MB • {file.content_type}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownload(order.product.id, file.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors flex-shrink-0"
                        >
                          <span className="material-symbols-outlined text-[18px]">download</span>
                          {t('orders.download')}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">{t('orders.noFiles')}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
