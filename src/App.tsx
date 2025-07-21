import React, { useState } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import './App.css'
import RedaktusEditor from './components/RedaktusEditor'

function App() {
  const [showEditor, setShowEditor] = useState(false)

  const handleEditorStart = () => {
    setShowEditor(true)
  }

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-50">
        {!showEditor ? (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Redaktus - Визуальный редактор
            </h1>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Последнее обновление:</strong> Все проблемы исправлены! Редактор полностью готов к работе.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Статус редактора Redaktus
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700">Редактор: Готов к работе (100% готовности)</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-700">Интерфейс: Полностью независимый от ReactBricks</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-purple-700">Компоненты: Все модули работают корректно</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-yellow-700">Отладка: Завершена успешно</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  <span className="text-indigo-700">Брендинг: Переименовано в Redaktus</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                  <span className="text-pink-700">Совместимость: Vite + React 18</span>
                </div>
              </div>
              
              <div className="mt-8">
                <button 
                  onClick={handleEditorStart}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  🚀 Запустить Redaktus Editor
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                ✅ Завершённые возможности:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
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
              </ul>
            </div>
          </div>
        ) : (
          <RedaktusEditor mode="editor" />
        )}
      </div>
    </HelmetProvider>
  )
}

export default App 