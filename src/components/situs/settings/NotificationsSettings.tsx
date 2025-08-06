import React from 'react';

interface GlobalSettings {
  theme: string;
  language: string;
  timezone: string;
  notifications: Record<string, boolean>;
}

interface NotificationsSettingsProps {
  globalSettings: GlobalSettings;
  handleGlobalSettingChange: (category: string, setting: string, value: any) => void;
  handleSave: () => void;
}

/**
 * Компонент настроек уведомлений
 */
const NotificationsSettings: React.FC<NotificationsSettingsProps> = ({ 
  globalSettings, 
  handleGlobalSettingChange,
  handleSave 
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg dark:bg-dark-2">
      <h3 className="text-xl font-semibold text-dark dark:text-white mb-6">
        Уведомления
      </h3>
      
      <div className="space-y-6">
        {Object.entries(globalSettings.notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-dark dark:text-white capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </h4>
              <p className="text-sm text-body-color dark:text-dark-6">
                Настройки уведомлений для {key}
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={value as boolean}
                onChange={(e) => handleGlobalSettingChange('notifications', key, e.target.checked)}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
            </label>
          </div>
        ))}

        {/* Дополнительные настройки уведомлений */}
        <div className="border-t border-stroke dark:border-gray-700 pt-6">
          <h4 className="font-medium text-dark dark:text-white mb-4">
            Дополнительные настройки
          </h4>
          
          <div className="space-y-4">
            {/* Звуковые уведомления */}
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-dark dark:text-white">
                  Звуковые уведомления
                </h5>
                <p className="text-sm text-body-color dark:text-dark-6">
                  Воспроизводить звук при получении уведомлений
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

            {/* Браузерные уведомления */}
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-dark dark:text-white">
                  Браузерные уведомления
                </h5>
                <p className="text-sm text-body-color dark:text-dark-6">
                  Показывать уведомления в браузере
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

            {/* Email уведомления */}
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-dark dark:text-white">
                  Email уведомления
                </h5>
                <p className="text-sm text-body-color dark:text-dark-6">
                  Отправлять уведомления на email
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

export default NotificationsSettings;
