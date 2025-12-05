/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import type { User } from "../types";
import ImageCropModal from "../components/ImageCropModal";
import { compressImage, formatFileSize } from "../utils/imageCompression";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userNotFound, setUserNotFound] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [fileToCrop, setFileToCrop] = useState<File | null>(null);

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    const fetchProfileWithRetry = async () => {
      if (!username) {
        navigate("/");
        return;
      }

      setLoading(true);
      let success = false;
      for (let i = 0; i < 3; i++) {
        try {
          const data = await authService.getUserProfile(username);
          setProfileUser(data);
          setUserNotFound(false);
          success = true;
          break; // exit loop on success
        } catch {
          if (i < 2) {
            await new Promise(res => setTimeout(res, 1000));
          }
        }
      }

      if (!success) {
        toast.error(t('toast.userNotFound'));
        setUserNotFound(true);
      }

      setLoading(false);
    };

    fetchProfileWithRetry();
  }, [username, navigate]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB for original file)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('toast.imageTooLarge'));
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(t('toast.onlyImagesAllowed'));
        return;
      }

      // Show crop modal
      setFileToCrop(file);
      setShowCropModal(true);
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    try {
      setShowCropModal(false);
      setLoading(true);

      const originalSize = croppedBlob.size;

      // Compress the cropped image
      const compressedFile = await compressImage(croppedBlob, 800, 800, 0.85);

      const compressedSize = compressedFile.size;
      const savedPercentage = Math.round(((originalSize - compressedSize) / originalSize) * 100);

      toast.success(
        t('toast.imageCompressed', {
          original: formatFileSize(originalSize),
          compressed: formatFileSize(compressedSize),
          percent: savedPercentage
        }),
        { duration: 4000 }
      );

      // Upload to MinIO
      const imageUrl = await authService.uploadProfilePicture(compressedFile);

      // Update local state
      setProfileUser(prev => prev ? { ...prev, profilePicture: imageUrl } : null);
      setSelectedImage(imageUrl);
      setIsEditing(false);
      setFileToCrop(null);
      toast.success(t('toast.profilePictureUpdated'));
    } catch {
      toast.error(t('toast.uploadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setFileToCrop(null);
  };


  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "seller":
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
      case "buyer":
        return "bg-gradient-to-r from-green-500 to-emerald-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRoleTranslation = (role: string) => {
    switch (role) {
      case "admin":
        return t('admin');
      case "seller":
        return t('role-seller');
      case "buyer":
        return t('role-buyer');
      default:
        return role;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profileUser) {
    if (userNotFound) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{t('profilePage.userNotFound')}</h1>
          <p className="text-lg mb-8 text-gray-600 dark:text-white/70">{t('profilePage.userNotFoundMessage')}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300"
          >
            {t('profilePage.backToHome')}
          </button>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Image Crop Modal */}
      {showCropModal && fileToCrop && (
        <ImageCropModal
          imageFile={fileToCrop}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Header Background */}
          <div className="h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative">
            <div className="absolute inset-0 bg-black opacity-20"></div>
          </div>

          {/* Profile Content */}
          <div className="relative px-8 pb-8">
            {/* Profile Picture */}
            <div className="flex justify-center -mt-24 mb-6">
              <div className="relative">
                <div className="w-48 h-48 rounded-full border-8 border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 shadow-2xl">
                  {(selectedImage || profileUser.profilePicture) ? (
                    <img
                      src={selectedImage || profileUser.profilePicture}
                      alt={profileUser.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700">
                      {profileUser.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Edit Button */}
                {isOwnProfile && (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full p-3 shadow-lg transition-all duration-300 transform hover:scale-110"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Edit Mode */}
            {isEditing && isOwnProfile && (
              <div className="mb-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  {t('profilePage.edit.updateProfilePicture')}
                </h3>
                <div className="flex flex-col gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={loading}
                    className="block w-full text-sm text-gray-500 dark:text-gray-400
                      file:mr-4 file:py-3 file:px-6
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-gradient-to-r file:from-blue-500 file:to-purple-500
                      file:text-white
                      hover:file:from-blue-600 hover:file:to-purple-600
                      file:cursor-pointer file:transition-all file:duration-300
                      file:disabled:opacity-50 file:disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedImage(null);
                    }}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-full transition-all duration-300"
                  >
                    {t('profilePage.edit.cancel')}
                  </button>
                </div>
              </div>
            )}

            {/* User Info */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {profileUser.username}
              </h1>
              <div className="flex items-center justify-center gap-3 mb-4">
                <span
                  className={`${getRoleBadgeColor(profileUser.role)} text-white px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wider shadow-lg`}
                >
                  {getRoleTranslation(profileUser.role)}
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Member Since */}
              <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-4 rounded-xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-white/60 text-sm font-medium">
                      {t('profilePage.memberSince')}
                    </p>
                    <p className="text-gray-900 dark:text-white text-xl font-bold">
                      {formatDate(profileUser.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Type */}
              <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-white/60 text-sm font-medium">
                      {t('profilePage.accountType')}
                    </p>
                    <p className="text-gray-900 dark:text-white text-xl font-bold capitalize">
                      {getRoleTranslation(profileUser.role)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
