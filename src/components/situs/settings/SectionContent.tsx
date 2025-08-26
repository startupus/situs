import React, { useState } from 'react';
import ProjectRolePermissions from './ProjectRolePermissions';

interface SectionSettings {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  permissions: string[];
  icon: React.ReactNode;
  settings: Record<string, any>;
}

interface SectionContentProps {
  section: SectionSettings;
  updateSectionSettings: (sectionId: string, setting: string, value: any) => void;
  updateSectionPermissions: (sectionId: string, permission: string, enabled: boolean) => void;
  handleSectionToggle: (sectionId: string) => void;
  handleSectionSettingChange: (sectionId: string, key: string, value: any) => void;
}

/**
 * Компонент для отображения настроек конкретного раздела платформы
 */
const SectionContent: React.FC<SectionContentProps> = ({ 
  section, 
  updateSectionSettings, 
  updateSectionPermissions,
  handleSectionToggle,
  handleSectionSettingChange
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'roles'>('basic');
  return (
    <div>
      {/* Заголовок внутри контента не дублирует заголовок верхней панели */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-3">
          <div className="text-2xl">{section.icon}</div>
          <div>
            {/* Убрали h1: заголовок раздела отрисовывается в верхнем хедере */}
            <p className="text-body-color dark:text-dark-6">{section.description}</p>
          </div>
        </div>

        {/* Табы для проектов */}
        {section.id === 'projects' && (
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('basic')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'basic'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Основные настройки
              </button>
              <button
                onClick={() => setActiveTab('roles')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'roles'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Права ролей
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Контент в зависимости от активного таба */}
      {section.id === 'projects' && activeTab === 'roles' ? (
        <ProjectRolePermissions
          onSave={(rolePermissions) => {
            console.log('Сохранение настроек ролей:', rolePermissions);
            // Здесь будет API вызов для сохранения
          }}
        />
      ) : (
        <>
          {/* Настройки раздела */}
          <div className="grid gap-8 md:grid-cols-2">
        {/* Основные настройки раздела */}
        <div className="bg-white rounded-lg p-6 shadow-lg dark:bg-dark-2">
          <h3 className="text-xl font-semibold text-dark dark:text-white mb-6">
            Основные настройки
          </h3>
          
          {/* Включение/отключение раздела */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-dark dark:text-white">
                  Включить раздел
                </h4>
                <p className="text-sm text-body-color dark:text-dark-6">
                  Показывать раздел в интерфейсе пользователям
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={section.enabled}
                  onChange={() => handleSectionToggle(section.id)}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
              </label>
            </div>
          </div>

          {/* Специфичные настройки для каждого раздела */}
          <div className="space-y-4">
            {Object.entries(section.settings).map(([key, value]) => (
              <div key={key}>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white capitalize">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
                {typeof value === 'boolean' ? (
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => handleSectionSettingChange(section.id, key, e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
                  </label>
                ) : typeof value === 'number' ? (
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => handleSectionSettingChange(section.id, key, Number(e.target.value))}
                    className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
                  />
                ) : Array.isArray(value) ? (
                  <div className="space-y-2">
                    {value.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleSectionSettingChange(section.id, key, e.target.value)}
                    className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Права доступа */}
        <div className="bg-white rounded-lg p-6 shadow-lg dark:bg-dark-2">
          <h3 className="text-xl font-semibold text-dark dark:text-white mb-6">
            Права доступа
          </h3>
          <div className="space-y-4">
            {section.permissions.map((permission: string) => (
              <div key={permission} className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-dark dark:text-white">{permission}</h4>
                  <p className="text-sm text-body-color dark:text-dark-6">
                    Разрешение на {permission}
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
            ))}
          </div>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={() => console.log('Сохранение настроек')}
          className="rounded-lg bg-primary px-6 py-3 text-white hover:bg-primary/90 transition-colors font-medium"
        >
          Сохранить изменения
        </button>
        <button
          type="button"
          className="rounded-lg border border-stroke px-6 py-3 text-dark hover:bg-gray-50 transition-colors font-medium dark:border-dark-3 dark:text-white dark:hover:bg-dark"
        >
          Сбросить
        </button>
      </div>
        </>
      )}
    </div>
  );
};

export default SectionContent;
