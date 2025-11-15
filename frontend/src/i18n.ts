import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enUS from './locales/en-US/translation.json';
import zhTW from './locales/zh-TW/translation.json';

const resources = {
  'en-US': {
    translation: enUS,
  },
  'zh-TW': {
    translation: zhTW,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
