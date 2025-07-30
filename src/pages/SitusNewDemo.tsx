import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiUsers, FiFolder, FiBarChart3, FiHome, FiSettings, FiCheckCircle } from 'react-icons/fi';

/**
 * SitusNewDemo - Демонстрационная страница нового интерфейса Situs
 */
const SitusNewDemo: React.FC = () => {
  const features = [
    {
      icon: FiHome,
      title: 'Информативный дашборд',
      description: 'Статистика, графики, последняя активность и ключевые показатели в одном месте',
      status: 'completed'
    },
    {
      icon: FiFolder,
      title: 'Управление проектами',
      description: 'Полный CRUD функционал с фильтрацией, поиском и модальными окнами',
      status: 'completed'
    },
    {
      icon: FiUsers,
      title: 'Управление пользователями',
      description: 'Система ролей, статусы, расширенные профили и права доступа',
      status: 'completed'
    },
    {
      icon: FiBarChart3,
      title: 'Детальная аналитика',
      description: 'Графики роста, распределение по типам, динамика доходов, KPI',
      status: 'completed'
    }
  ];

  const apiFeatures = [
    'RESTful API с OpenAPI совместимостью',
    'JWT аутентификация и авторизация',
    'Валидация данных с Zod схемами',
    'Централизованная обработка ошибок',
    'Middleware для безопасности и логирования',
    'Интеграция с Prisma ORM',
    'Аналитические эндпоинты',
    'Система прав доступа'
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Заголовок */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="h-16 w-16 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Situs - Новый интерфейс
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Полноценная административная панель с современным дизайном, интеграцией с API 
            и расширенными возможностями управления
          </p>
        </div>

        {/* Кнопка доступа */}
        <div className="text-center mb-16">
          <Link
            to="/situs-new"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg"
          >
            Открыть новый интерфейс
            <FiArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Интерфейс полностью готов и интегрирован с бэкенд API
          </p>
        </div>

        {/* Возможности интерфейса */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Возможности интерфейса
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <FiCheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API интеграция */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Интеграция с API
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  API возможности
                </h3>
                <ul className="space-y-3">
                  {apiFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <FiCheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Эндпоинты
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm font-mono text-gray-800 dark:text-gray-200">
                      GET /api/users/statistics
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Статистика пользователей
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm font-mono text-gray-800 dark:text-gray-200">
                      GET /api/projects
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Список проектов с фильтрацией
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm font-mono text-gray-800 dark:text-gray-200">
                      GET /api/analytics/*
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Аналитические данные для графиков
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Технические детали */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Архитектура решения
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FiSettings className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Фронтенд
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                React + TypeScript, Tailwind CSS, React Router, полная типизация
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FiBarChart3 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Бэкенд API
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Node.js + Express, Prisma ORM, JWT Auth, Zod валидация
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FiFolder className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                База данных
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                PostgreSQL с Prisma схемой, миграции, сидинг
              </p>
            </div>
          </div>
        </div>

        {/* Подвал */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            Интерфейс готов к продакшену с полной интеграцией API и современными практиками разработки
          </p>
        </div>
      </div>
    </div>
  );
};

export default SitusNewDemo;