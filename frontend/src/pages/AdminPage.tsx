import React from 'react';
import { useTranslation } from 'react-i18next';

const AdminPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('admin')}</h1>
      <p>{t('welcome_admin')}</p>
    </div>
  );
};

export default AdminPage;
