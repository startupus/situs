import React, { useEffect, useRef } from 'react';
import { FiX, FiUser, FiFolder, FiFileText, FiClock } from 'react-icons/fi';

/**
 * Интерфейс пропсов для уведомлений
 */
interface SitusNotificationsProps {
  onClose: () => void;
}

/**
 * Интерфейс уведомления
 */
interface Notification {
  id: string;
  type: 'user' | 'project' | 'page' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

/**
 * SitusNotifications - Выпадающий список уведомлений
 */
const SitusNotifications: React.FC<SitusNotificationsProps> = ({ onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие при клике вне области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Моковые уведомления
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'user',
      title: 'Новый пользователь',
      message: 'Зарегистрирован новый пользователь john.doe@example.com',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false
    },
    {
      id: '2',
      type: 'project',
      title: 'Проект опубликован',
      message: 'Проект "Интернет-магазин" успешно опубликован',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false
    },
    {
      id: '3',
      type: 'page',
      title: 'Новая страница',
      message: 'Создана страница "О компании"',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true
    }
  ];

  // Получение иконки по типу
  const getIcon = (type: string) => {
    switch (type) {
      case 'user':
        return FiUser;
      case 'project':
        return FiFolder;
      case 'page':
        return FiFileText;
      default:
        return FiClock;
    }
  };

  // Получение цвета по типу
  const getColor = (type: string) => {
    switch (type) {
      case 'user':
        return 'text-blue-500';
      case 'project':
        return 'text-green-500';
      case 'page':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  // Форматирование времени
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 60) {
      return `${minutes} мин назад`;
    } else if (hours < 24) {
      return `${hours} ч назад`;
    } else {
      return date.toLocaleDateString('ru-RU');
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
    >
      {/* Заголовок */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Уведомления
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>

      {/* Список уведомлений */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const IconComponent = getIcon(notification.type);
            const colorClass = getColor(notification.type);

            return (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 ${colorClass}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      {formatTime(notification.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center">
            <FiClock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">Нет уведомлений</p>
          </div>
        )}
      </div>

      {/* Подвал */}
      {notifications.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium w-full text-center">
            Показать все уведомления
          </button>
        </div>
      )}
    </div>
  );
};

export default SitusNotifications;