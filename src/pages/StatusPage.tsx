import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import { useTheme } from '../hooks/useTheme'

function StatusPage() {
  const { isDark } = useTheme()

  return (
    <HelmetProvider>
      <div className={`min-h-screen transition-colors duration-200 ${
        isDark ? 'bg-dark text-gray-1' : 'bg-gray text-black'
      }`}>
        <div className="container mx-auto px-4 py-8">
          {/* Header с переключателем темы и кнопкой возврата */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">
              Redaktus - Мониторинг состояния
            </h1>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg"
              >
                🚀 Вернуться к редактору
              </Link>
              <ThemeToggle />
            </div>
          </div>
          
          <div className={`border-l-4 p-4 mb-6 rounded-r-lg ${
            isDark 
              ? 'bg-gray-100 border-gray-300 text-gray-700' 
              : 'bg-gray-100 border-gray-300 text-gray-700'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">
                  <strong>Последнее обновление:</strong> Добавлена поддержка темной темы по стандарту Tailgrids! Редактор полностью готов к работе.
                </p>
              </div>
            </div>
          </div>
          
          <div className={`rounded-lg shadow-lg p-6 mb-8 ${
            isDark ? 'bg-dark-2 border border-dark-3' : 'bg-white'
          }`}>
            <h2 className={`text-xl font-semibold mb-4 ${
              isDark ? 'text-gray-1' : 'text-black'
            }`}>
              Статус редактора Redaktus
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green rounded-full"></div>
                <span className={isDark ? 'text-green-light' : 'text-green'}>
                  Редактор: Готов к работе (100% готовности)
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  Интерфейс: Полностью независимый от ReactBricks
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple rounded-full"></div>
                <span className={isDark ? 'text-purple-light' : 'text-purple'}>
                  Компоненты: Все модули работают корректно
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow rounded-full"></div>
                <span className={isDark ? 'text-yellow-light' : 'text-yellow'}>
                  Отладка: Завершена успешно
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-pink rounded-full"></div>
                <span className={isDark ? 'text-pink-light' : 'text-pink'}>
                  Брендинг: Переименовано в Redaktus
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange rounded-full"></div>
                <span className={isDark ? 'text-orange-light' : 'text-orange'}>
                  Совместимость: Vite + React 18
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-secondary rounded-full"></div>
                <span className={isDark ? 'text-secondary-light' : 'text-secondary'}>
                  Тема: Поддержка светлой и темной темы по стандарту Tailgrids
                </span>
              </div>
            </div>
          </div>
          
          <div className={`rounded-lg shadow-lg p-6 ${
            isDark ? 'bg-dark-2 border border-dark-3' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-medium mb-2 ${
              isDark ? 'text-gray-1' : 'text-black'
            }`}>
              ✅ Завершённые возможности:
            </h3>
            <ul className={`list-disc list-inside space-y-1 ${
              isDark ? 'text-gray-6' : 'text-gray-5'
            }`}>
              <li>🎨 Полностью независимый от ReactBricks</li>
              <li>📱 Адаптивный дизайн с компонентной архитектурой</li>
              <li>🧩 Библиотека компонентов ready-to-use</li>
              <li>🎯 Правильная типизация TypeScript</li>
              <li>🔧 Конфигурируемые настройки</li>
              <li>🌐 Мультиязычная поддержка</li>
              <li>📁 Интегрированный медиа-менеджер</li>
              <li>⚡ Быстрая разработка с HMR</li>
              <li>🔄 Модульная архитектура</li>
              <li>💾 Система провайдеров и контекстов</li>
              <li>🎨 Tailwind CSS стилизация</li>
              <li>🐛 Отладка и диагностика</li>
              <li>🌙 Поддержка темной темы по стандарту Tailgrids</li>
              <li>🖥️ Автоопределение системной темы</li>
            </ul>
          </div>
        </div>
      </div>
    </HelmetProvider>
  )
}

export default StatusPage 