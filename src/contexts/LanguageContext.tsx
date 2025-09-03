import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export type Language = 'ru' | 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, options?: any) => string;
  isRussian: boolean;
  isEnglish: boolean;
  isGerman: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'redaktus-editor-language';

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n, t } = useTranslation();

  // Получаем язык из localStorage или используем русский по умолчанию
  const getInitialLanguage = (): Language => {
    if (typeof window === 'undefined') return 'ru';

    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
    if (saved === 'ru' || saved === 'en' || saved === 'de') {
      return saved;
    }

    // Определяем язык браузера
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('ru')) {
      return 'ru';
    } else if (browserLang.startsWith('de')) {
      return 'de';
    }

    return 'en'; // По умолчанию английский для международной аудитории
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  // Синхронизируем с i18next при инициализации
  useEffect(() => {
    const initialLang = getInitialLanguage();
    setLanguageState(initialLang);
    i18n.changeLanguage(initialLang);
  }, [i18n]);

  // Функция для изменения языка
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);

    // Сохраняем в localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }

    console.log(`🌍 Editor Language changed to: ${lang}`);
  };

  // Функция для переключения языка
  const toggleLanguage = () => {
    const languages: Language[] = ['ru', 'en', 'de'];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    const newLang = languages[nextIndex];
    setLanguage(newLang);
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    isRussian: language === 'ru',
    isEnglish: language === 'en',
    isGerman: language === 'de',
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
