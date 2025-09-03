import React, { useState } from 'react';
import { useSite } from '../../contexts/SiteContext';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';

export function SitusPlatform() {
  const { state, actions } = useSite();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme, resolvedTheme } = useTheme();
  const [selectedTab, setSelectedTab] = useState<'projects' | 'users' | 'domains' | 'analytics'>('projects');

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Загрузка Situs Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        resolvedTheme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      {/* Верхняя панель */}
      <header
        className={`border-b transition-colors duration-200 ${
          resolvedTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">🏢 Situs Platform</h1>
            <nav className="flex space-x-1">
              <button
                onClick={() => setSelectedTab('projects')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTab === 'projects'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Проекты
              </button>
              <button
                onClick={() => setSelectedTab('users')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTab === 'users'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Пользователи
              </button>
              <button
                onClick={() => setSelectedTab('domains')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTab === 'domains'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Домены
              </button>
              <button
                onClick={() => setSelectedTab('analytics')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTab === 'analytics'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Аналитика
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Переключатель языка */}
            <button
              onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
              className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span>{language === 'ru' ? '🇷🇺' : '🇺🇸'}</span>
              <span className="text-sm font-medium">{language.toUpperCase()}</span>
            </button>

            {/* Переключатель темы */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Переключить тему"
            >
              {resolvedTheme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* Ссылка на редактор */}
            <a
              href="/redaktus"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              🎨 Redaktus Studio
            </a>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="p-6">
        {selectedTab === 'projects' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Проекты сайтов</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">+ Создать проект</button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.sites.map((site) => (
                <div
                  key={site.id}
                  className={`p-6 rounded-lg border transition-colors ${
                    resolvedTheme === 'dark'
                      ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{site.name}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        site.status === 'published'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : site.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {site.status === 'published' ? 'Опубликован' : site.status === 'draft' ? 'Черновик' : 'Архив'}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4">{site.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Домен:</span>
                      <span className="ml-2 font-mono">{site.domain || 'Не настроен'}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Страниц:</span>
                      <span className="ml-2">{site.pages.length}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Создан:</span>
                      <span className="ml-2">{new Date(site.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <a
                      href={`/studio?site=${site.id}`}
                      className="flex-1 px-3 py-2 bg-purple-600 text-white text-center rounded hover:bg-purple-700 transition-colors"
                    >
                      🎨 Редактировать
                    </a>
                    <button className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      ⚙️ Настройки
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'users' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Пользователи</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <p className="text-gray-600 dark:text-gray-400">
                Управление пользователями будет доступно в следующих версиях.
              </p>
            </div>
          </div>
        )}

        {selectedTab === 'domains' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Домены</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <p className="text-gray-600 dark:text-gray-400">
                Управление доменами будет доступно в следующих версиях.
              </p>
            </div>
          </div>
        )}

        {selectedTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Аналитика</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <p className="text-gray-600 dark:text-gray-400">Аналитика будет доступна в следующих версиях.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
