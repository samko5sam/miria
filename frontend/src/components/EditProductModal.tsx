/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { productService } from '../services/productService';
import type { Product } from '../types';
import toast from 'react-hot-toast';
import { compressImage, formatFileSize } from '../utils/imageCompression';

interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProductUpdated: () => void;
    product: Product;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, onClose, onProductUpdated, product }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadingFile, setUploadingFile] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        if (product && isOpen) {
            setName(product.name);
            setDescription(product.description || '');
            setPrice(product.price.toString());
            setImagePreview(product.image_url || null);
            setIsActive(product.is_active);
        }
    }, [product, isOpen]);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                toast.error(t('seller.products.invalidFileType'));
                return;
            }

            // Validate file size (5MB before compression)
            if (file.size > 5 * 1024 * 1024) {
                toast.error(t('seller.products.imageTooLarge'));
                return;
            }

            try {
                // Compress image before upload (max 1200x1200, 85% quality)
                const originalSize = file.size;
                const compressedFile = await compressImage(file, 1200, 1200, 0.85);
                const compressedSize = compressedFile.size;
                const percentSmaller = Math.round((1 - compressedSize / originalSize) * 100);

                // Show compression info if size was reduced
                if (percentSmaller > 5) {
                    toast.success(
                        t('toast.imageCompressed', { original: formatFileSize(originalSize), compressed: formatFileSize(compressedSize), percent: percentSmaller })
                    );
                }

                setImage(compressedFile);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result as string);
                };
                reader.readAsDataURL(compressedFile);
            } catch (error) {
                console.error('Image compression failed:', error);
                toast.error(t('seller.products.compressionFailed'));
            }
        }
    };

    const handleRemoveImage = async () => {
        if (product.image_url) {
            try {
                await productService.deleteProductImage(product.id);
                toast.success(t('seller.products.imageRemoved'));
                setImagePreview(null);
                setImage(null);
                onProductUpdated();
            } catch (error: any) {
                toast.error(error.response?.data?.message || t('seller.products.removeImageFailed'));
            }
        } else {
            setImagePreview(null);
            setImage(null);
        }
    };

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
            // Update product info
            await productService.updateProduct(product.id, name.trim(), description.trim(), priceNum);

            // Upload image if a new one was selected
            if (image) {
                await productService.uploadProductImage(product.id, image);
            }

            toast.success(t('seller.products.updateSuccess'));
            onProductUpdated();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || t('seller.products.updateError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingFile(true);
        try {
            await productService.uploadProductFile(product.id, file);
            toast.success(t('seller.products.fileUploaded'));
            onProductUpdated();
        } catch (error: any) {
            toast.error(error.response?.data?.message || t('seller.products.uploadFileFailed'));
        } finally {
            setUploadingFile(false);
        }
    };

    const handleDeleteFile = async (fileId: number) => {
        if (!window.confirm(t('seller.products.confirmDeleteFile'))) return;

        try {
            await productService.deleteProductFile(product.id, fileId);
            toast.success(t('seller.products.fileDeleted'));
            onProductUpdated();
        } catch (error: any) {
            toast.error(error.response?.data?.message || t('seller.products.deleteFileFailed'));
        }
    };

    const handleToggleStatus = async () => {
        try {
            const response = await productService.toggleProductStatus(product.id);
            setIsActive(response.is_active); // Update local state immediately
            toast.success(response.is_active ? t('seller.products.published') : t('seller.products.unpublished'));
            onProductUpdated();
        } catch (error: any) {
            toast.error(error.response?.data?.message || t('seller.products.statusUpdateFailed'));
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-2xl bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl my-8">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('seller.products.editProduct')}</h2>
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
                    {/* Product Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                            {t('seller.products.productImage')}
                        </label>
                        <div className="flex items-center gap-4">
                            {imagePreview && (
                                <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-white/10">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="flex-1 space-y-2">
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                                    onChange={handleImageChange}
                                    disabled={isLoading}
                                    className="block w-full text-sm text-gray-500 dark:text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 disabled:opacity-50"
                                />
                                {imagePreview && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="text-sm text-red-600 dark:text-red-400 hover:underline"
                                    >
                                        {t('seller.products.removeImage')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Product Name */}
                    <div>
                        <label htmlFor="edit-product-name" className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                            {t('seller.products.productName')} <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="edit-product-name"
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
                        <label htmlFor="edit-product-description" className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                            {t('seller.products.description')}
                        </label>
                        <textarea
                            id="edit-product-description"
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
                        <label htmlFor="edit-product-price" className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                            {t('seller.products.price')} <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/60">$</span>
                            <input
                                id="edit-product-price"
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

                    {/* Files Management */}
                    <div className="border-t border-gray-200 dark:border-white/10 pt-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-white/80">{t('seller.products.productFiles')}</h3>
                            <label className="cursor-pointer text-sm text-primary hover:text-primary/80 font-medium">
                                <input
                                    type="file"
                                    onChange={handleFileUpload}
                                    disabled={uploadingFile}
                                    className="hidden"
                                />
                                {uploadingFile ? t('seller.products.uploading') : t('seller.products.addFile')}
                            </label>
                        </div>
                        <div className="space-y-2">
                            {product.files.map((file) => (
                                <div
                                    key={file.id}
                                    className="flex items-center justify-between bg-gray-100 dark:bg-white/5 rounded-lg px-4 py-2"
                                >
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <span className="material-symbols-outlined text-base text-gray-500 dark:text-white/60">description</span>
                                        <span className="text-sm text-gray-700 dark:text-white/70 truncate">{file.filename}</span>
                                        <span className="text-xs text-gray-500 dark:text-white/50">
                                            {(file.file_size / 1024).toFixed(1)} KB
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteFile(file.id)}
                                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            ))}
                            {product.files.length === 0 && (
                                <p className="text-sm text-gray-500 dark:text-white/50 text-center py-4">{t('seller.products.noFiles')}</p>
                            )}
                        </div>
                    </div>

                    {/* Product Status Toggle */}
                    <div className="border-t border-gray-200 dark:border-white/10 pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 dark:text-white/80">{t('seller.products.productStatus')}</h3>
                                <p className="text-xs text-gray-500 dark:text-white/50">
                                    {isActive ? t('seller.products.statusPublished') : t('seller.products.statusUnpublished')}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleToggleStatus}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${isActive
                                    ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/30'
                                    : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/10'
                                    }`}
                            >
                                {isActive ? t('seller.products.statusPublishedLabel') : t('seller.products.statusUnpublishedLabel')}
                            </button>
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
                            {isLoading ? t('seller.products.updating') : t('seller.products.update')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;
