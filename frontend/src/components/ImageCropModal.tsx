import { useState, useRef, useCallback } from 'react';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useTranslation } from 'react-i18next';

interface ImageCropModalProps {
  imageFile: File;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

export default function ImageCropModal({ imageFile, onCropComplete, onCancel }: ImageCropModalProps) {
  const { t } = useTranslation();
  const [imageSrc, setImageSrc] = useState<string>('');
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load image when component mounts
  useState(() => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(imageFile);
  });

  const getCroppedImage = useCallback(async () => {
    if (!completedCrop || !imgRef.current) {
      return;
    }

    setIsProcessing(true);

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    canvas.toBlob(
      (blob) => {
        setIsProcessing(false);
        if (blob) {
          onCropComplete(blob);
        }
      },
      'image/jpeg',
      0.95
    );
  }, [completedCrop, onCropComplete]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">{t('profilePage.cropModal.title')}</h2>
          <p className="text-blue-100 text-sm mt-1">{t('profilePage.cropModal.description')}</p>
        </div>

        {/* Crop Area */}
        <div className="p-6 overflow-auto max-h-[calc(90vh-200px)]">
          {imageSrc && (
            <div className="flex justify-center">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                className="max-w-full"
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Crop preview"
                  className="max-w-full h-auto"
                  style={{ maxHeight: '60vh' }}
                />
              </ReactCrop>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 flex justify-end gap-4">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('profilePage.cropModal.cancel')}
          </button>
          <button
            onClick={getCroppedImage}
            disabled={isProcessing || !completedCrop}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                {t('profilePage.cropModal.processing')}
              </>
            ) : (
              t('profilePage.cropModal.cropAndContinue')
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
