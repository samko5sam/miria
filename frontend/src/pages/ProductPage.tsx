/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { productService } from '../services/productService';
import type { Product } from '../types';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

const ProductPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { addToCart, isInCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) return;
            try {
                const data = await productService.getProduct(parseInt(productId));
                setProduct(data);
            } catch (error: any) {
                toast.error(error.response?.data?.message || t('product.failedToLoad'));
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId, navigate, t]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const handleAddToCart = async () => {
        if (!product) return;
        try {
            await addToCart(product);
            toast.success(t('store.addedToCart', { name: product.name }));
        } catch (error: any) {
            const message = error.response?.data?.message;
            // If already in cart, show specific toast, otherwise default error
            if (message) {
                toast.error(message);
            } else {
                toast.error(t('store.addToCartError'));
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl">
                    progress_activity
                </span>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="px-4 py-12 max-w-7xl mx-auto min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Product Image */}
                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/5 shadow-2xl relative">
                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/10 dark:to-primary/5 flex items-center justify-center">
                            <span className="material-symbols-outlined text-9xl text-primary/30 dark:text-primary/20">
                                image
                            </span>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-8 lg:py-8 min-w-0">
                    {/* Store Info */}
                    {product.store_name && product.store_id && (
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500 dark:text-white/50">{t('product.soldBy')}</span>
                            <Link
                                to={`/store/${product.store_id}`}
                                className="font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-lg">storefront</span>
                                {product.store_name}
                            </Link>
                        </div>
                    )}

                    {/* Title & Price */}
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{product.name}</h1>
                        <p className="text-4xl font-bold text-primary">{formatPrice(product.price)}</p>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        disabled={isInCart(product.id)}
                        className={`w-full md:w-auto min-w-[300px] flex items-center justify-center gap-3 px-8 py-4 text-lg font-bold rounded-xl shadow-lg transform active:scale-95 transition-all duration-300 ${isInCart(product.id)
                            ? 'bg-gray-400 cursor-not-allowed text-white shadow-none'
                            : 'bg-primary hover:bg-primary/90 text-white shadow-primary/30'
                            }`}
                    >
                        <span className="material-symbols-outlined text-2xl">
                            {isInCart(product.id) ? 'shopping_cart_checkout' : 'shopping_cart'}
                        </span>
                        {isInCart(product.id) ? t('store.inCart') : t('store.addToCart')}
                    </button>

                    {/* Description */}
                    <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined">description</span>
                            {t('product.description')}
                        </h3>
                        {product.description ? (
                            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-white/70 whitespace-pre-line break-words">
                                {product.description}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-white/50 italic">{t('product.noDescription')}</p>
                        )}
                    </div>

                    {/* Files */}
                    <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined">folder_zip</span>
                            {t('product.filesIncluded')}
                            <span className="text-xs font-normal text-gray-500 dark:text-white/50 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-full">
                                {product.files.length}
                            </span>
                        </h3>
                        {product.files.length > 0 ? (
                            <div className="space-y-3">
                                {product.files.map((file) => (
                                    <div
                                        key={file.id}
                                        className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5"
                                    >
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <span className="material-symbols-outlined text-primary">description</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 dark:text-white truncate">{file.filename}</p>
                                            <p className="text-xs text-gray-500 dark:text-white/50">{(file.file_size / 1024).toFixed(1)} KB</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-white/50">{t('product.noFiles')}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
