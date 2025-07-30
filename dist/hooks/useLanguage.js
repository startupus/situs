import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
const LANGUAGE_STORAGE_KEY = 'redaktus-language';
/**
 * Хук для управления языком интерфейса
 * Поддерживает переключение между русским и английским языками
 * Сохраняет выбор пользователя в localStorage
 */
export const useLanguage = () => {
    const { i18n, t } = useTranslation();
    // Получаем язык из localStorage или используем русский по умолчанию
    const getInitialLanguage = useCallback(() => {
        if (typeof window === 'undefined')
            return 'ru';
        const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (saved === 'ru' || saved === 'en') {
            return saved;
        }
        // Определяем язык браузера
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('ru')) {
            return 'ru';
        }
        return 'en'; // По умолчанию английский для международной аудитории
    }, []);
    const [language, setLanguageState] = useState(getInitialLanguage);
    // Синхронизируем с i18next при инициализации
    useEffect(() => {
        const initialLang = getInitialLanguage();
        setLanguageState(initialLang);
        i18n.changeLanguage(initialLang);
    }, [i18n, getInitialLanguage]);
    // Функция для изменения языка
    const setLanguage = useCallback((lang) => {
        setLanguageState(lang);
        i18n.changeLanguage(lang);
        // Сохраняем в localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
        }
        console.log(`🌍 Language changed to: ${lang}`);
    }, [i18n]);
    // Функция для переключения языка
    const toggleLanguage = useCallback(() => {
        const newLang = language === 'ru' ? 'en' : 'ru';
        setLanguage(newLang);
    }, [language, setLanguage]);
    return {
        language,
        setLanguage,
        toggleLanguage,
        t,
        isRussian: language === 'ru',
        isEnglish: language === 'en'
    };
};
//# sourceMappingURL=useLanguage.js.map