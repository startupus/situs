import React from 'react';
import { FaPalette, FaGlobe, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface GlobalSettings {
  theme: string;
  language: string;
  timezone: string;
  notifications: Record<string, boolean>;
}

interface AppearanceSettingsProps {
  globalSettings: GlobalSettings;
  handleGlobalSettingChange: (category: string, setting: string, value: any) => void;
  setShowThemeModal: (show: boolean) => void;
  setShowEditorModal: (show: boolean) => void;
  handleSave: () => void;
}

/**
 * Компонент настроек внешнего вида
 */
const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  globalSettings,
  handleGlobalSettingChange,
  setShowThemeModal,
  setShowEditorModal,
  handleSave,
}) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg dark:bg-dark-2">
      <h3 className="text-xl font-semibold text-dark dark:text-white mb-6">Внешний вид</h3>

      <div className="space-y-8">
        {/* Тема админки */}
        <div className="bg-gray-50 dark:bg-dark rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <FaPalette className="text-primary" />
            <h4 className="text-lg font-semibold text-dark dark:text-white">Тема админ-панели</h4>
          </div>
          <p className="text-body-color dark:text-dark-6 mb-4">Настройка темы оформления административной панели</p>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Режим темы</label>
              <select
                value={globalSettings.theme}
                onChange={(e) => handleGlobalSettingChange('theme', '', e.target.value)}
                className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
              >
                <option value="light">Светлая</option>
                <option value="dark">Тёмная</option>
                <option value="auto">Следовать системе</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setShowThemeModal(true)}
                className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Расширенные настройки темы
              </button>
            </div>
          </div>
        </div>

        {/* Демонстрация компонентов */}
        <div className="bg-gray-50 dark:bg-dark rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <FaEye className="text-primary" />
            <h4 className="text-lg font-semibold text-dark dark:text-white">Демонстрация компонентов</h4>
          </div>
          <p className="text-body-color dark:text-dark-6 mb-4">
            Просмотр всех доступных компонентов глобальной темы проекта
          </p>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark dark:text-white font-medium">300+ компонентов UI библиотеки</p>
              <p className="text-xs text-body-color dark:text-dark-6">
                Theme Components, Core Components, Dashboard Components
              </p>
            </div>
            <button
              onClick={() => navigate('/demo/components')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Открыть демо
            </button>
          </div>
        </div>

        {/* Интерфейс редактора */}
        <div className="bg-gray-50 dark:bg-dark rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <FaGlobe className="text-primary" />
            <h4 className="text-lg font-semibold text-dark dark:text-white">Интерфейс редактора</h4>
          </div>
          <p className="text-body-color dark:text-dark-6 mb-4">
            Настройка внешнего вида и поведения интерфейса редактора страниц
          </p>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark dark:text-white font-medium">Тема, типографика, макет, анимации</p>
              <p className="text-xs text-body-color dark:text-dark-6">
                Персонализация интерфейса редактора под ваши предпочтения
              </p>
            </div>
            <button
              onClick={() => setShowEditorModal(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Настроить интерфейс
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

export default AppearanceSettings;
