import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('about')}</h1>
      <p>{t('welcome_about')}</p>
    </div>
  );
};

export default AboutPage;
