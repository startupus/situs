import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export type Language = 'ru' | 'en'

interface UseLanguageReturn {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: (key: string, options?: any) => string
  isRussian: boolean
  isEnglish: boolean
}

const LANGUAGE_STORAGE_KEY = 'redaktus-language'

/**
 * Хук для управления языком интерфейса
 * Поддерживает переключение между русским и английским языками
 * Сохраняет выбор пользователя в localStorage
 */
export const useLanguage = (): UseLanguageReturn => {
  const { i18n, t } = useTranslation()
  
  // Получаем язык из localStorage или используем русский по умолчанию
  const getInitialLanguage = useCallback((): Language => {
    if (typeof window === 'undefined') return 'ru'
    
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language
    if (saved === 'ru' || saved === 'en') {
      return saved
    }
    
    // Определяем язык браузера
    const browserLang = navigator.language.toLowerCase()
    if (browserLang.startsWith('ru')) {
      return 'ru'
    }
    
    return 'en' // По умолчанию английский для международной аудитории
  }, [])
  
  const [language, setLanguageState] = useState<Language>(getInitialLanguage)
  
  // Синхронизируем с i18next при инициализации
  useEffect(() => {
    const initialLang = getInitialLanguage()
    setLanguageState(initialLang)
    i18n.changeLanguage(initialLang)
  }, [i18n, getInitialLanguage])
  
  // Функция для изменения языка
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    i18n.changeLanguage(lang)
    
    // Сохраняем в localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
    }
    
    console.log(`🌍 Language changed to: ${lang}`)
  }, [i18n])
  
  // Функция для переключения языка
  const toggleLanguage = useCallback(() => {
    const newLang: Language = language === 'ru' ? 'en' : 'ru'
    setLanguage(newLang)
  }, [language, setLanguage])
  
  return {
    language,
    setLanguage,
    toggleLanguage,
    t,
    isRussian: language === 'ru',
    isEnglish: language === 'en'
  }
} 