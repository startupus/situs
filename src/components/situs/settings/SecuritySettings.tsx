import React from 'react';
import { FaShieldAlt, FaKey, FaUserLock, FaHistory } from 'react-icons/fa';

interface SecuritySettingsProps {
  handleSave: () => void;
}

/**
 * Компонент настроек безопасности
 */
const SecuritySettings: React.FC<SecuritySettingsProps> = ({ handleSave }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg dark:bg-dark-2">
      <h3 className="text-xl font-semibold text-dark dark:text-white mb-6">
        Безопасность
      </h3>
      
      <div className="space-y-8">
        {/* Двухфакторная аутентификация */}
        <div className="bg-gray-50 dark:bg-dark rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <FaShieldAlt className="text-primary" />
            <h4 className="text-lg font-semibold text-dark dark:text-white">
              Двухфакторная аутентификация
            </h4>
          </div>
          <p className="text-body-color dark:text-dark-6 mb-4">
            Дополнительный уровень защиты вашего аккаунта
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark dark:text-white font-medium">
                Статус: Отключена
              </p>
              <p className="text-xs text-body-color dark:text-dark-6">
                Рекомендуем включить для повышения безопасности
              </p>
            </div>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Включить 2FA
            </button>
          </div>
        </div>

        {/* Управление паролями */}
        <div className="bg-gray-50 dark:bg-dark rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <FaKey className="text-primary" />
            <h4 className="text-lg font-semibold text-dark dark:text-white">
              Управление паролями
            </h4>
          </div>
          <p className="text-body-color dark:text-dark-6 mb-4">
            Настройки политики паролей и их безопасности
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-dark dark:text-white">
                  Сложность пароля
                </h5>
                <p className="text-sm text-body-color dark:text-dark-6">
                  Требовать сложные пароли для всех пользователей
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-dark dark:text-white">
                  Автосмена пароля
                </h5>
                <p className="text-sm text-body-color dark:text-dark-6">
                  Требовать смену пароля каждые 90 дней
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  defaultChecked={false}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Сессии и доступ */}
        <div className="bg-gray-50 dark:bg-dark rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <FaUserLock className="text-primary" />
            <h4 className="text-lg font-semibold text-dark dark:text-white">
              Сессии и доступ
            </h4>
          </div>
          <p className="text-body-color dark:text-dark-6 mb-4">
            Управление активными сессиями и политиками доступа
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Время сессии (минуты)
              </label>
              <input
                type="number"
                defaultValue={480}
                min={30}
                max={1440}
                className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
              />
              <p className="text-xs text-body-color dark:text-dark-6 mt-1">
                Автоматический выход из системы при неактивности
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-dark dark:text-white">
                  Одновременные сессии
                </h5>
                <p className="text-sm text-body-color dark:text-dark-6">
                  Разрешить несколько активных сессий для одного пользователя
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Журнал аудита */}
        <div className="bg-gray-50 dark:bg-dark rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <FaHistory className="text-primary" />
            <h4 className="text-lg font-semibold text-dark dark:text-white">
              Журнал аудита
            </h4>
          </div>
          <p className="text-body-color dark:text-dark-6 mb-4">
            Логирование действий пользователей для безопасности
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark dark:text-white font-medium">
                Ведение журнала включено
              </p>
              <p className="text-xs text-body-color dark:text-dark-6">
                Записываются все важные действия пользователей
              </p>
            </div>
            <button className="px-4 py-2 bg-gray-200 text-dark rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
              Просмотреть журнал
            </button>
          </div>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="flex space-x-4 mt-8">
        <button
          onClick={handleSave}
          className="rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-primary/90 transition-colors"
        >
          Сохранить изменения
        </button>
        <button className="rounded-lg border border-stroke px-6 py-3 text-dark hover:bg-gray-50 transition-colors font-medium dark:border-dark-3 dark:text-white dark:hover:bg-dark">
          Сбросить
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings;
