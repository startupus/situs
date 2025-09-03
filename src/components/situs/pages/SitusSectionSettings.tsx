import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import {
  FaCog,
  FaUsers,
  FaProjectDiagram,
  FaStore,
  FaRobot,
  FaChartBar,
  FaLock,
  FaBell,
  FaGlobe,
  FaPalette,
} from 'react-icons/fa';
import EnhancedThemeSettings from '../../admin/EnhancedThemeSettings';
import EditorInterfaceSettings from '../../admin/EditorInterfaceSettings';
import {
  SettingsSidebar,
  SectionContent,
  GeneralSettings,
  AppearanceSettings,
  NotificationsSettings,
  SecuritySettings,
} from '../settings';

interface SectionSettings {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  permissions: string[];
  icon: React.ReactNode;
  settings: Record<string, any>;
}

interface GlobalSettings {
  theme: string;
  language: string;
  timezone: string;
  notifications: Record<string, boolean>;
}

/**
 * Главный компонент настроек разделов Situs - переработанная версия
 * Разбита на отдельные компоненты для упрощения разработки
 */
const SitusSectionSettings: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showEditorModal, setShowEditorModal] = useState(false);

  // Получаем активный раздел из URL
  const getActiveSectionFromUrl = () => {
    const path = location.pathname;
    if (path.includes('/section-settings/')) {
      const section = path.split('/section-settings/')[1];
      return section || 'dashboard';
    }
    return 'dashboard';
  };

  const [activeSection, setActiveSection] = useState(getActiveSectionFromUrl);

  // Синхронизируем activeSection с URL
  useEffect(() => {
    const section = getActiveSectionFromUrl();
    setActiveSection(section);
  }, [location.pathname]);

  // Данные разделов платформы
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
        refreshInterval: 30,
      },
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
        versioning: true,
      },
    },
    {
      id: 'websites',
      name: 'Веб-сайты',
      description: 'Конструктор и управление веб-сайтами',
      enabled: true,
      permissions: ['view', 'create', 'edit', 'publish'],
      icon: <FaGlobe className="text-purple-500" />,
      settings: {
        maxPages: 100,
        customDomain: true,
        sslEnabled: true,
      },
    },
    {
      id: 'stores',
      name: 'Интернет-магазины',
      description: 'E-commerce платформа для онлайн торговли',
      enabled: true,
      permissions: ['view', 'create', 'edit', 'manage_orders'],
      icon: <FaStore className="text-orange-500" />,
      settings: {
        paymentGateways: ['stripe', 'paypal'],
        inventory: true,
        analytics: true,
      },
    },
    {
      id: 'bots',
      name: 'Чат-боты',
      description: 'Создание и управление чат-ботами',
      enabled: false,
      permissions: ['view', 'create', 'edit'],
      icon: <FaRobot className="text-cyan-500" />,
      settings: {
        aiIntegration: true,
        multiLang: false,
        analytics: true,
      },
    },
    {
      id: 'users',
      name: 'Пользователи',
      description: 'Управление пользователями и ролями',
      enabled: true,
      permissions: ['view', 'create', 'edit', 'delete'],
      icon: <FaUsers className="text-indigo-500" />,
      settings: {
        registration: true,
        emailVerification: true,
        roleBasedAccess: true,
      },
    },
  ]);

  // Глобальные настройки
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({
    theme: 'auto',
    language: 'ru',
    timezone: 'Europe/Moscow',
    notifications: {
      email: true,
      browser: false,
      mobile: true,
      marketing: false,
    },
  });

  // Обработчики изменений
  const handleSectionToggle = (sectionId: string) => {
    setSections((prev) =>
      prev.map((section) => (section.id === sectionId ? { ...section, enabled: !section.enabled } : section)),
    );
  };

  const handleSectionSettingChange = (sectionId: string, key: string, value: any) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              settings: { ...section.settings, [key]: value },
            }
          : section,
      ),
    );
  };

  const updateSectionSettings = (sectionId: string, setting: string, value: any) => {
    handleSectionSettingChange(sectionId, setting, value);
  };

  const updateSectionPermissions = (sectionId: string, permission: string, enabled: boolean) => {
    // Логика обновления разрешений
    console.log('Update permission:', sectionId, permission, enabled);
  };

  const handleGlobalSettingChange = (category: string, setting: string, value: any) => {
    setGlobalSettings((prev) => ({
      ...prev,
      [category]:
        typeof prev[category as keyof GlobalSettings] === 'object'
          ? { ...(prev[category as keyof GlobalSettings] as Record<string, any>), [setting]: value }
          : value,
    }));
  };

  const handleSave = () => {
    console.log('Сохранение настроек');
  };

  const currentSection = sections.find((s) => s.id === activeSection);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark">
      <div className="flex">
        {/* Боковая панель */}
        <SettingsSidebar sections={sections} activeSection={activeSection} />

        {/* Основной контент с роутингом */}
        <div className="flex-1 p-8">
          <Routes>
            {/* Маршрут по умолчанию - перенаправляем на dashboard */}
            <Route path="/" element={<Navigate to="/section-settings/dashboard" replace />} />

            {/* Маршруты для разделов платформы */}
            {sections.map((section) => (
              <Route
                key={section.id}
                path={`/${section.id}`}
                element={
                  <SectionContent
                    section={section}
                    updateSectionSettings={updateSectionSettings}
                    updateSectionPermissions={updateSectionPermissions}
                    handleSectionToggle={handleSectionToggle}
                    handleSectionSettingChange={handleSectionSettingChange}
                  />
                }
              />
            ))}

            {/* Маршруты для системных настроек */}
            <Route path="/general" element={<Navigate to="/profile-settings?tab=general" replace />} />

            {/* Внешний вид перенесён в тему проекта (системный проект админки) */}
            <Route path="/appearance" element={<Navigate to="/projects/situs-admin/settings/theme" replace />} />

            <Route path="/notifications" element={<Navigate to="/profile-settings?tab=notifications" replace />} />

            <Route path="/security" element={<Navigate to="/profile-settings?tab=security" replace />} />
          </Routes>
        </div>
      </div>

      {/* Модальное окно расширенных настроек темы */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-dark-2 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-stroke dark:border-gray-700">
              <h2 className="text-xl font-semibold text-dark dark:text-white">Расширенные настройки темы</h2>
              <button
                onClick={() => setShowThemeModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <EnhancedThemeSettings />
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно настроек интерфейса редактора */}
      {showEditorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-dark-2 rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-stroke dark:border-gray-700">
              <h2 className="text-xl font-semibold text-dark dark:text-white">Настройки интерфейса редактора</h2>
              <button
                onClick={() => setShowEditorModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <EditorInterfaceSettings />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SitusSectionSettings;
