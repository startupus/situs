import React, { useState } from 'react';
import { FiUser, FiLogOut, FiSettings, FiBell, FiSearch, FiPlus, FiCreditCard } from 'react-icons/fi';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../hooks/useTheme';

interface HeaderProps {
  title?: string;
  showBalance?: boolean;
  showUserMenu?: boolean;
  onNewProject?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title = 'Situs Platform',
  showBalance = true,
  showUserMenu = true,
  onNewProject,
}) => {
  const { user, logout } = useUser();
  const { theme, toggleTheme, resolvedTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <header
      className={`border-b transition-colors duration-200 ${
        resolvedTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}
    >
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Левая часть - Логотип и название */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
          </div>
        </div>

        {/* Центральная часть - Поиск */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-body-color w-4 h-4" />
            <input
              type="text"
              placeholder="Поиск проектов, страниц, компонентов..."
              className="w-full pl-10 pr-4 py-2 border border-stroke dark:border-gray-600 rounded-lg bg-surface dark:bg-gray-800 text-dark dark:text-white placeholder-body-color dark:placeholder-gray-400 focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Правая часть - Действия и пользователь */}
        <div className="flex items-center space-x-4">
          {/* Баланс монетус с кнопкой пополнения */}
          {showBalance && (
            <div className="flex items-center space-x-3">
              <div
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                  resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-yellow-800 font-bold text-xs">₿</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {user.balance.monetus.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{user.balance.currency}</span>
              </div>
              <button
                onClick={() => {
                  // Здесь будет логика перехода к пополнению баланса
                  console.log('Redirect to top-up balance');
                }}
                className="flex items-center space-x-1 px-3 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="Пополнить баланс"
              >
                <FiCreditCard className="w-4 h-4" />
                <span className="text-sm font-medium">Пополнить</span>
              </button>
            </div>
          )}

          {/* Кнопка нового проекта */}
          {onNewProject && (
            <button
              onClick={onNewProject}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span className="text-sm font-medium">Новый проект</span>
            </button>
          )}

          {/* Уведомления */}
          <button
            className={`p-2 rounded-lg transition-colors ${
              resolvedTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <FiBell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Меню пользователя */}
          {showUserMenu && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <img
                  src={user.avatar || 'https://via.placeholder.com/32'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{user.subscription.plan}</div>
                </div>
                <FiUser className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>

              {/* Выпадающее меню */}
              {showDropdown && (
                <div
                  className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg border ${
                    resolvedTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                    </div>

                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2">
                      <FiSettings className="w-4 h-4" />
                      <span>Настройки</span>
                    </button>

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Выйти</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
