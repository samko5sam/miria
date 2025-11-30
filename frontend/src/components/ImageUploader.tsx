import React, { useState } from "react";

interface ImageUploaderProps {
  onUpload: (file: File) => Promise<void>;
  currentImage?: string;
  loading?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUpload,
  currentImage,
  loading = false,
}) => {
  const [preview, setPreview] = useState<string | undefined>(currentImage);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      await onUpload(file);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      await onUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="image-uploader">
      <div
        className={`upload-area ${isDragging ? "dragging" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="preview-image" />
            <label htmlFor="file-input" className="change-button">
              {loading ? "Uploading..." : "Change Image"}
            </label>
          </div>
        ) : (
          <label htmlFor="file-input" className="upload-label">
            <div className="upload-content">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p>{loading ? "Uploading..." : "Click or drag to upload"}</p>
            </div>
          </label>
        )}
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
          style={{ display: "none" }}
        />
      </div>

      <style>{`
        .image-uploader {
          width: 100%;
          max-width: 400px;
        }

        .upload-area {
          border: 2px dashed #cbd5e0;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          background: #f7fafc;
        }

        .upload-area.dragging {
          border-color: #4299e1;
          background: #ebf8ff;
        }

        .upload-label {
          cursor: pointer;
          display: block;
        }

        .upload-content {
          color: #718096;
        }

        .upload-content svg {
          margin: 0 auto 1rem;
          color: #4299e1;
        }

        .upload-content p {
          margin: 0;
          font-size: 0.875rem;
        }

        .preview-container {
          position: relative;
        }

        .preview-image {
          width: 200px;
          height: 200px;
          object-fit: cover;
          border-radius: 50%;
          margin: 0 auto 1rem;
          display: block;
        }

        .change-button {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: #4299e1;
          color: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background 0.2s;
        }

        .change-button:hover {
          background: #3182ce;
        }
      `}</style>
    </div>
  );
};

export default ImageUploader;
