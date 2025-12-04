import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { productService } from '../services/productService';
import toast from 'react-hot-toast';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProductAdded: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onProductAdded }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!name.trim()) {
            toast.error(t('seller.products.errors.nameRequired'));
            return;
        }

        const priceNum = parseFloat(price);
        if (isNaN(priceNum) || priceNum < 0) {
            toast.error(t('seller.products.errors.invalidPrice'));
            return;
        }

        setIsLoading(true);
        try {
            await productService.createProduct(name.trim(), description.trim(), priceNum);
            toast.success(t('seller.products.createSuccess'));

            // Reset form
            setName('');
            setDescription('');
            setPrice('');

            // Notify parent and close modal
            onProductAdded();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || t('seller.products.createError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setName('');
            setDescription('');
            setPrice('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('seller.products.addProduct')}</h2>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Product Name */}
                    <div>
                        <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                            {t('seller.products.productName')} <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="product-name"
                            type="text"
                            required
                            maxLength={100}
                            disabled={isLoading}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('seller.products.productNamePlaceholder')}
                            className="block w-full appearance-none rounded-lg border-0 bg-gray-100 dark:bg-white/5 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 shadow-sm focus:bg-gray-50 dark:focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-white/50 text-right">{name.length}/100</p>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="product-description" className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                            {t('seller.products.description')}
                        </label>
                        <textarea
                            id="product-description"
                            rows={4}
                            maxLength={500}
                            disabled={isLoading}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t('seller.products.descriptionPlaceholder')}
                            className="block w-full appearance-none rounded-lg border-0 bg-gray-100 dark:bg-white/5 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 shadow-sm focus:bg-gray-50 dark:focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all resize-none"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-white/50 text-right">{description.length}/500</p>
                    </div>

                    {/* Price */}
                    <div>
                        <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                            {t('seller.products.price')} <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/60">$</span>
                            <input
                                id="product-price"
                                type="number"
                                step="0.01"
                                min="0"
                                required
                                disabled={isLoading}
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="0.00"
                                className="block w-full appearance-none rounded-lg border-0 bg-gray-100 dark:bg-white/5 pl-8 pr-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 shadow-sm focus:bg-gray-50 dark:focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t('seller.products.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading && (
                                <span className="material-symbols-outlined animate-spin text-lg">
                                    progress_activity
                                </span>
                            )}
                            {isLoading ? t('seller.products.creating') : t('seller.products.create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;
