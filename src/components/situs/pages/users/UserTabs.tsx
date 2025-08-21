import React from 'react';
import { FiUsers, FiShield, FiSettings, FiMail } from 'react-icons/fi';

type TabId = 'users' | 'roles' | 'settings' | 'invites';

interface UserTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const UserTabs: React.FC<UserTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'users' as TabId, name: 'Пользователи', icon: FiUsers },
    { id: 'roles' as TabId, name: 'Роли и права', icon: FiShield },
    { id: 'settings' as TabId, name: 'Настройки', icon: FiSettings },
    { id: 'invites' as TabId, name: 'Приглашения', icon: FiMail }
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-8">
        {tabs.map(tab => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default UserTabs;
