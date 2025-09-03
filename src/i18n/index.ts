import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en/translation.json';
import ruTranslation from './locales/ru/translation.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  ru: {
    translation: ruTranslation,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ru', // язык по умолчанию
  fallbackLng: 'en',

  interpolation: {
    escapeValue: false, // react уже делает это
  },
});

export default i18n;
