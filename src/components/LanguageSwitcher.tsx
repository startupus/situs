import React from 'react'
import { FaLanguage, FaGlobe } from 'react-icons/fa'
import { useLanguage } from '../hooks/useLanguage'

interface LanguageSwitcherProps {
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Компонент переключателя языка интерфейса
 * Поддерживает переключение между русским и английским языками
 */
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  showLabel = true,
  size = 'md'
}) => {
  const { language, toggleLanguage, t, isRussian, isEnglish } = useLanguage()
  
  // Размеры в зависимости от size
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2', 
    lg: 'text-base px-4 py-3'
  }
  
  const iconSize = {
    sm: 12,
    md: 16,
    lg: 20
  }
  
  const handleClick = () => {
    toggleLanguage()
  }
  
  return (
    <div className={`language-switcher ${className}`}>
      {showLabel && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
          {t('editor.sidebar.language.title')}
        </div>
      )}
      
      <button
        onClick={handleClick}
        className={`
          ${sizeClasses[size]}
          w-full flex items-center justify-between
          bg-white dark:bg-gray-800 
          border border-gray-200 dark:border-gray-700
          rounded-lg
          hover:bg-gray-50 dark:hover:bg-gray-700
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
          transition-all duration-200
          group
        `}
        title={t('editor.sidebar.language.switch')}
      >
        {/* Левая часть - текущий язык */}
        <div className="flex items-center space-x-2">
          <FaGlobe 
            size={iconSize[size]} 
            className="text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors duration-200" 
          />
          
          <div className="flex flex-col items-start">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {isRussian ? 'Русский' : 'English'}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {language.toUpperCase()}
            </span>
          </div>
        </div>
        
        {/* Правая часть - индикатор переключения */}
        <div className="flex items-center space-x-1">
          {/* Флаги языков */}
          <div className="flex items-center space-x-1">
            <span 
              className={`text-sm transition-opacity duration-200 ${
                isRussian ? 'opacity-100' : 'opacity-30'
              }`}
              title="Русский"
            >
              🇷🇺
            </span>
            <span 
              className={`text-sm transition-opacity duration-200 ${
                isEnglish ? 'opacity-100' : 'opacity-30'
              }`}
              title="English"
            >
              🇺🇸
            </span>
          </div>
          
          {/* Стрелка переключения */}
          <FaLanguage 
            size={iconSize[size] - 2} 
            className="text-gray-400 group-hover:text-blue-500 transition-all duration-200 group-hover:scale-110" 
          />
        </div>
      </button>
      
      {/* Подсказка о следующем языке */}
      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-center">
        {t('editor.sidebar.language.switch')} → {isRussian ? 'English' : 'Русский'}
      </div>
    </div>
  )
}

export default LanguageSwitcher 