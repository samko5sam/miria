import React from 'react';
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('home')}</h1>
      <p>{t('welcome_home')}</p>
    </div>
  );
};

export default HomePage;
