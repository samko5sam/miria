import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Product } from '../types';

interface ProductCardProps {
    product: Product;
    onDelete?: (productId: number) => void;
    onEdit?: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete, onEdit }) => {
    const { t } = useTranslation();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    return (
        <div className="bg-white dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden hover:border-gray-300 dark:hover:border-white/10 transition-all duration-300 group shadow-sm dark:shadow-none">
            {/* Card Header */}
            <div className="p-6 border-b border-gray-200 dark:border-white/5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate mb-1">{product.name}</h3>
                        <p className="text-2xl font-bold text-primary">{formatPrice(product.price)}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(product.id)}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-all"
                                title={t('seller.products.edit')}
                            >
                                <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => onDelete(product.id)}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-500/20 text-gray-700 dark:text-white/70 hover:text-red-600 dark:hover:text-red-400 transition-all"
                                title={t('seller.products.delete')}
                            >
                                <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-4">
                {/* Description */}
                {product.description && (
                    <div>
                        <p className="text-gray-700 dark:text-white/70 text-sm line-clamp-3">{product.description}</p>
                    </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                    {/* Files Count */}
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-white/60">
                        <span className="material-symbols-outlined text-base">attach_file</span>
                        <span>
                            {product.files.length} {t('seller.products.files', { count: product.files.length })}
                        </span>
                    </div>

                    {/* Created Date */}
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-white/60">
                        <span className="material-symbols-outlined text-base">calendar_today</span>
                        <span>{formatDate(product.created_at)}</span>
                    </div>
                </div>

                {/* Files List */}
                {product.files.length > 0 && (
                    <div className="pt-3 border-t border-gray-200 dark:border-white/5">
                        <p className="text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider mb-2">
                            {t('seller.products.attachedFiles')}
                        </p>
                        <div className="space-y-1.5">
                            {product.files.slice(0, 3).map((file) => (
                                <div
                                    key={file.id}
                                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-white/70 bg-gray-100 dark:bg-white/5 rounded-lg px-3 py-2"
                                >
                                    <span className="material-symbols-outlined text-base">description</span>
                                    <span className="flex-1 truncate">{file.filename}</span>
                                    <span className="text-xs text-gray-500 dark:text-white/50">
                                        {(file.file_size / 1024).toFixed(1)} KB
                                    </span>
                                </div>
                            ))}
                            {product.files.length > 3 && (
                                <p className="text-xs text-gray-500 dark:text-white/50 text-center pt-1">
                                    +{product.files.length - 3} {t('seller.products.moreFiles')}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* No Files Message */}
                {product.files.length === 0 && (
                    <div className="pt-3 border-t border-gray-200 dark:border-white/5">
                        <div className="flex items-center justify-center gap-2 text-gray-400 dark:text-white/40 text-sm py-3">
                            <span className="material-symbols-outlined text-base">cloud_upload</span>
                            <span>{t('seller.products.noFiles')}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
