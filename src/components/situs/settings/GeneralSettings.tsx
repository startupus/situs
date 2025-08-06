import React from 'react';

interface GlobalSettings {
  theme: string;
  language: string;
  timezone: string;
  notifications: Record<string, boolean>;
}

interface GeneralSettingsProps {
  globalSettings: GlobalSettings;
  handleGlobalSettingChange: (category: string, setting: string, value: any) => void;
  handleSave: () => void;
}

/**
 * Компонент общих настроек системы
 */
const GeneralSettings: React.FC<GeneralSettingsProps> = ({ 
  globalSettings, 
  handleGlobalSettingChange,
  handleSave 
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg dark:bg-dark-2">
      <h3 className="text-xl font-semibold text-dark dark:text-white mb-6">
        Общие настройки
      </h3>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Тема оформления */}
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
            Тема оформления
          </label>
          <select
            value={globalSettings.theme}
            onChange={(e) => handleGlobalSettingChange('theme', '', e.target.value)}
            className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
          >
            <option value="light">Светлая</option>
            <option value="dark">Тёмная</option>
            <option value="auto">Авто</option>
          </select>
        </div>

        {/* Язык интерфейса */}
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
            Язык интерфейса
          </label>
          <select
            value={globalSettings.language}
            onChange={(e) => handleGlobalSettingChange('language', '', e.target.value)}
            className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
          >
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* Часовой пояс */}
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
            Часовой пояс
          </label>
          <select
            value={globalSettings.timezone}
            onChange={(e) => handleGlobalSettingChange('timezone', '', e.target.value)}
            className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
          >
            <option value="Europe/Moscow">Москва (UTC+3)</option>
            <option value="Europe/London">Лондон (UTC+0)</option>
            <option value="America/New_York">Нью-Йорк (UTC-5)</option>
            <option value="Asia/Tokyo">Токио (UTC+9)</option>
          </select>
        </div>

        {/* Формат даты */}
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
            Формат даты
          </label>
          <select
            className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
          >
            <option value="dd.mm.yyyy">ДД.ММ.ГГГГ</option>
            <option value="mm/dd/yyyy">ММ/ДД/ГГГГ</option>
            <option value="yyyy-mm-dd">ГГГГ-ММ-ДД</option>
          </select>
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

export default GeneralSettings;
