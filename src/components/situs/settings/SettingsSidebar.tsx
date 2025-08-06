import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCog, FaChartBar, FaProjectDiagram, FaStore, FaRobot, FaUsers, FaBell, FaLock, FaPalette } from 'react-icons/fa';

interface SectionSettings {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  permissions: string[];
  icon: React.ReactNode;
  settings: Record<string, any>;
}

interface SettingsSidebarProps {
  sections: SectionSettings[];
  activeSection: string;
}

/**
 * Боковая панель настроек разделов
 */
const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ sections, activeSection }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'general', name: 'Общие настройки', icon: <FaCog /> },
    { id: 'appearance', name: 'Внешний вид', icon: <FaPalette /> },
    { id: 'notifications', name: 'Уведомления', icon: <FaBell /> },
    { id: 'security', name: 'Безопасность', icon: <FaLock /> }
  ];

  return (
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
                onClick={() => navigate(`/section-settings/${section.id}`)}
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
                {section.enabled && (
                  <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Системные настройки */}
        <div>
          <h3 className="text-sm font-semibold text-body-color uppercase tracking-wide mb-3">
            Системные настройки
          </h3>
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(`/section-settings/${item.id}`)}
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
  );
};

export default SettingsSidebar;
