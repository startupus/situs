import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import './i18n' // Инициализация i18n
import { SiteProvider } from './contexts/SiteContext'
import { StudioInterface } from './components/StudioInterface'
import { SitusPlatform } from './components/SitusPlatform'
import { useTheme } from './hooks/useTheme'

function App() {
  const { resolvedTheme } = useTheme()

  return (
    <HelmetProvider>
      <Router>
        <div 
          className={`min-h-screen w-screen max-w-none overflow-x-hidden transition-colors duration-200 ${
            resolvedTheme === 'dark' ? 'bg-dark text-gray-1' : 'bg-gray text-black'
          }`}
          style={{ width: '100vw', maxWidth: 'none' }}
        >
          <Routes>
            {/* Главная страница с выбором приложения */}
            <Route path="/" element={<AppSelector />} />
            
            {/* Situs Platform - управление сайтами */}
            <Route path="/situs/*" element={
              <SiteProvider>
                <SitusPlatform />
              </SiteProvider>
            } />
            
            {/* Redaktus Studio - редактор */}
            <Route path="/redaktus/*" element={
              <SiteProvider>
                <StudioInterface />
              </SiteProvider>
            } />
            
            {/* Редирект по умолчанию */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  )
}

// Компонент выбора приложения
function AppSelector() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Situs Platform
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Выберите приложение для работы
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Situs Platform */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="text-6xl mb-4">🏢</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Situs Platform
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Управление сайтами, проектами и пользователями. 
                Основная платформа для создания и управления веб-сайтами.
              </p>
              <a 
                href="/situs"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Открыть Situs Platform
              </a>
            </div>
          </div>
          
          {/* Redaktus Studio */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="text-6xl mb-4">🎨</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Redaktus Studio
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Визуальный редактор сайтов с drag & drop. 
                Создание и редактирование контента страниц.
              </p>
              <a 
                href="/redaktus"
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Открыть Redaktus Studio
              </a>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400">
          <p>Параллельная разработка • Тестирование по отдельности</p>
          <div className="mt-4 space-x-4">
            <span>🚀 Situs: http://localhost:5177/situs</span>
            <span>🎨 Redaktus: http://localhost:5177/redaktus</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App 