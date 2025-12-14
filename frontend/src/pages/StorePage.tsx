/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { storeService, type Store } from '../services/storeService';
import type { Product } from '../types';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

const StorePage: React.FC = () => {
    const { storeId } = useParams<{ storeId: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { addToCart, isInCart } = useCart();
    const [store, setStore] = useState<Store | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchStoreData = async () => {
            if (!storeId) return;

            try {
                const [storeData, productsData] = await Promise.all([
                    storeService.getStore(parseInt(storeId)),
                    storeService.getStoreProducts(parseInt(storeId)),
                ]);
                setStore(storeData);
                setProducts(productsData);
            } catch (error: any) {
                toast.error(error.response?.data?.message || t('store.failedToLoad'));
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchStoreData();
    }, [storeId, navigate]);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const handleAddToCart = async (product: Product) => {
        try {
            await addToCart(product);
            toast.success(t('store.addedToCart', { name: product.name }));
        } catch (error: any) {
            const message = error.response?.data?.message;
            if (message) {
                toast.error(message);
            } else {
                toast.error(t('store.addToCartError'));
            }
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

    if (!store) return null;

    return (
        <div className="px-4 py-8 max-w-7xl mx-auto">
            {/* Store Header */}
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">{store.name}</h1>
                {store.description && (
                    <p className="text-lg text-gray-600 dark:text-white/70 max-w-3xl mx-auto">{store.description}</p>
                )}
            </div>

            {/* Search Bar */}
            <div className="mb-8">
                <div className="relative max-w-md mx-auto">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 material-symbols-outlined">
                        search
                    </span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('store.searchPlaceholder')}
                        className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-white/5 border-0 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                    <span className="material-symbols-outlined text-gray-300 dark:text-white/20 text-6xl mb-4 block">
                        inventory_2
                    </span>
                    <p className="text-gray-500 dark:text-white/50 text-lg">
                        {searchQuery ? t('store.noProductsFound') : t('store.noProductsAvailable')}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden hover:border-gray-300 dark:hover:border-white/10 transition-all duration-300 shadow-sm dark:shadow-none group"
                        >
                            {/* Product Image */}
                            <Link to={`/products/${product.id}`} className="block aspect-video w-full overflow-hidden bg-gray-100 dark:bg-white/5 cursor-pointer">
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/10 dark:to-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                        <span className="material-symbols-outlined text-6xl text-primary/30 dark:text-primary/20">
                                            image
                                        </span>
                                    </div>
                                )}
                            </Link>

                            {/* Product Info */}
                            <div className="p-6 space-y-4">
                                <div>
                                    <Link to={`/products/${product.id}`} className="block">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 hover:text-primary transition-colors">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <p className="text-2xl font-bold text-primary">{formatPrice(product.price)}</p>
                                </div>

                                {product.description && (
                                    <p className="text-gray-700 dark:text-white/70 text-sm line-clamp-3">
                                        {product.description}
                                    </p>
                                )}

                                {/* Files Count */}
                                {product.files_count !== undefined && product.files_count > 0 && (
                                    <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-white/60">
                                        <span className="material-symbols-outlined text-base">attach_file</span>
                                        <span>{product.files_count} {t('store.filesIncluded')}</span>
                                    </div>
                                )}

                                {/* Add to Cart Button */}
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    disabled={isInCart(product.id)}
                                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 font-bold rounded-lg transition-all ${isInCart(product.id)
                                            ? 'bg-gray-400 cursor-not-allowed text-white'
                                            : 'bg-primary hover:bg-primary/90 text-white'
                                        }`}
                                >
                                    <span className="material-symbols-outlined">
                                        {isInCart(product.id) ? 'shopping_cart_checkout' : 'shopping_cart'}
                                    </span>
                                    {isInCart(product.id) ? t('store.inCart') : t('store.addToCart')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StorePage;
