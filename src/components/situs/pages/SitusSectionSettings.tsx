import React, { useState } from 'react';
import { FaCog, FaUsers, FaProjectDiagram, FaStore, FaRobot, FaChartBar, FaLock, FaBell, FaGlobe, FaPalette } from 'react-icons/fa';

interface SectionSettings {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  permissions: string[];
  icon: React.ReactNode;
  settings: Record<string, any>;
}

/**
 * Страница настроек разделов Situs
 * Базируется на SettingsPage2 компоненте из react-pro-components-main
 */
const SitusSectionSettings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sections, setSections] = useState<SectionSettings[]>([
    {
      id: 'dashboard',
      name: 'Дашборд',
      description: 'Основная панель управления и аналитики',
      enabled: true,
      permissions: ['view', 'edit'],
      icon: <FaChartBar className="text-blue-500" />,
      settings: {
        showStats: true,
        autoRefresh: true,
        refreshInterval: 30
      }
    },
    {
      id: 'projects',
      name: 'Проекты',
      description: 'Управление проектами и портфолио',
      enabled: true,
      permissions: ['view', 'create', 'edit', 'delete'],
      icon: <FaProjectDiagram className="text-green-500" />,
      settings: {
        defaultTemplate: 'modern',
        autoSave: true,
        versioning: true
      }
    },
    {
      id: 'websites',
      name: 'Веб-сайты',
      description: 'Конструктор и управление веб-сайтами',
      enabled: true,
      permissions: ['view', 'create', 'edit', 'publish'],
      icon: <FaGlobe className="text-purple-500" />,
      settings: {
        seoOptimization: true,
        responsiveDesign: true,
        analytics: true
      }
    },
    {
      id: 'stores',
      name: 'Интернет-магазины',
      description: 'Создание и управление онлайн-магазинами',
      enabled: true,
      permissions: ['view', 'create', 'edit', 'manage_orders'],
      icon: <FaStore className="text-orange-500" />,
      settings: {
        paymentGateways: ['stripe', 'paypal'],
        inventory: true,
        orderTracking: true
      }
    },
    {
      id: 'chatbots',
      name: 'Чат-боты',
      description: 'AI-чат-боты и автоматизация',
      enabled: true,
      permissions: ['view', 'create', 'train'],
      icon: <FaRobot className="text-red-500" />,
      settings: {
        aiModel: 'gpt-4',
        autoLearn: true,
        multiLanguage: true
      }
    },
    {
      id: 'users',
      name: 'Пользователи',
      description: 'Управление пользователями и правами доступа',
      enabled: true,
      permissions: ['view', 'create', 'edit', 'manage_roles'],
      icon: <FaUsers className="text-indigo-500" />,
      settings: {
        registration: 'invite_only',
        emailVerification: true,
        twoFactorAuth: false
      }
    }
  ]);

  const [globalSettings, setGlobalSettings] = useState({
    theme: 'auto',
    language: 'ru',
    timezone: 'Europe/Moscow',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    security: {
      sessionTimeout: 60,
      passwordPolicy: 'strong',
      ipWhitelist: false
    }
  });

  const handleSectionToggle = (sectionId: string) => {
    setSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { ...section, enabled: !section.enabled }
          : section
      )
    );
  };

  const handleSectionSettingChange = (sectionId: string, setting: string, value: any) => {
    setSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { 
              ...section, 
              settings: { ...section.settings, [setting]: value }
            }
          : section
      )
    );
  };

  const handleGlobalSettingChange = (category: string, setting: string, value: any) => {
    setGlobalSettings(prev => ({
      ...prev,
      [category]: typeof prev[category] === 'object' 
        ? { ...prev[category], [setting]: value }
        : value
    }));
  };

  const currentSection = sections.find(s => s.id === activeSection);

  const menuItems = [
    { id: 'general', name: 'Общие настройки', icon: <FaCog /> },
    { id: 'appearance', name: 'Внешний вид', icon: <FaPalette /> },
    { id: 'notifications', name: 'Уведомления', icon: <FaBell /> },
    { id: 'security', name: 'Безопасность', icon: <FaLock /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark">
      <div className="flex">
        {/* Боковая панель */}
        <div className="w-64 bg-white shadow-lg dark:bg-dark-2">
          <div className="p-6">
            <h2 className="text-xl font-bold text-dark dark:text-white mb-6">
              Настройки разделов
            </h2>
            
            {/* Разделы платформы */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-body-color uppercase tracking-wide mb-3">
                Разделы платформы
              </h3>
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary text-white'
                        : 'text-dark hover:bg-gray-50 dark:text-white dark:hover:bg-dark'
                    }`}
                  >
                    <div className="mr-3">
                      {section.icon}
                    </div>
                    <span className="font-medium">{section.name}</span>
                    <div className={`ml-auto w-2 h-2 rounded-full ${
                      section.enabled ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Глобальные настройки */}
            <div>
              <h3 className="text-sm font-semibold text-body-color uppercase tracking-wide mb-3">
                Системные настройки
              </h3>
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? 'bg-primary text-white'
                        : 'text-dark hover:bg-gray-50 dark:text-white dark:hover:bg-dark'
                    }`}
                  >
                    <div className="mr-3">
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Основное содержимое */}
        <div className="flex-1 p-8">
          {/* Заголовок */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-dark dark:text-white mb-2">
              {currentSection ? currentSection.name : 'Настройки'}
            </h1>
            <p className="text-body-color dark:text-dark-6">
              {currentSection ? currentSection.description : 'Управление настройками платформы'}
            </p>
          </div>

          {/* Настройки раздела */}
          {currentSection && (
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
                        checked={currentSection.enabled}
                        onChange={() => handleSectionToggle(currentSection.id)}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
                    </label>
                  </div>
                </div>

                {/* Специфичные настройки для каждого раздела */}
                <div className="space-y-4">
                  {Object.entries(currentSection.settings).map(([key, value]) => (
                    <div key={key}>
                      <label className="mb-2 block text-sm font-medium text-dark dark:text-white capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </label>
                      {typeof value === 'boolean' ? (
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => handleSectionSettingChange(currentSection.id, key, e.target.checked)}
                            className="peer sr-only"
                          />
                          <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
                        </label>
                      ) : typeof value === 'number' ? (
                        <input
                          type="number"
                          value={value}
                          onChange={(e) => handleSectionSettingChange(currentSection.id, key, Number(e.target.value))}
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
                          onChange={(e) => handleSectionSettingChange(currentSection.id, key, e.target.value)}
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
                  {currentSection.permissions.map((permission) => (
                    <div key={permission} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-dark dark:text-white capitalize">
                          {permission.replace('_', ' ')}
                        </h4>
                        <p className="text-sm text-body-color dark:text-dark-6">
                          Разрешение на {permission.replace('_', ' ').toLowerCase()}
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
          )}

          {/* Глобальные настройки */}
          {['general', 'appearance', 'notifications', 'security'].includes(activeSection) && (
            <div className="bg-white rounded-lg p-6 shadow-lg dark:bg-dark-2">
              <h3 className="text-xl font-semibold text-dark dark:text-white mb-6">
                {menuItems.find(item => item.id === activeSection)?.name}
              </h3>

              {activeSection === 'general' && (
                <div className="grid gap-6 md:grid-cols-2">
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
                </div>
              )}

              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  {Object.entries(globalSettings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-dark dark:text-white capitalize">
                          {key === 'email' ? 'Email уведомления' : 
                           key === 'push' ? 'Push уведомления' : 
                           'SMS уведомления'}
                        </h4>
                        <p className="text-sm text-body-color dark:text-dark-6">
                          Получать уведомления через {key}
                        </p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleGlobalSettingChange('notifications', key, e.target.checked)}
                          className="peer sr-only"
                        />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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
        </div>
      </div>
    </div>
  );
};

export default SitusSectionSettings; 