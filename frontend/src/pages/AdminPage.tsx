import React from 'react';
import { useTranslation } from 'react-i18next';

const AdminPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{t('admin')}</h1>
      <p className="text-white/80">{t('welcome_admin')}</p>
    </div>
  );
};

export default AdminPage;
