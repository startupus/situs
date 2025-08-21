import React from 'react';
import { ThemeButton } from '../../../ui';
import { FiMail } from 'react-icons/fi';

interface UserControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterRole: string;
  setFilterRole: (role: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  selectedUsers: string[];
  onInviteClick: () => void;
  onBulkAction: (action: 'activate' | 'suspend' | 'delete') => void;
}

const UserControls: React.FC<UserControlsProps> = ({
  searchTerm,
  setSearchTerm,
  filterRole,
  setFilterRole,
  filterStatus,
  setFilterStatus,
  selectedUsers,
  onInviteClick,
  onBulkAction
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Поиск и фильтры */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск пользователей..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Все роли</option>
            <option value="SUPER_ADMIN">Супер Админ</option>
            <option value="STAFF">Сотрудник</option>
            <option value="AGENCY">Агентство</option>
            <option value="BUSINESS">Бизнес</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Все статусы</option>
            <option value="active">Активные</option>
            <option value="pending">Ожидающие</option>
            <option value="suspended">Заблокированные</option>
            <option value="inactive">Неактивные</option>
          </select>
        </div>

        {/* Действия */}
        <div className="flex space-x-3">
          <ThemeButton
            onClick={onInviteClick}
            icon={<FiMail className="w-4 h-4" />}
          >
            Пригласить
          </ThemeButton>
          
          {selectedUsers.length > 0 && (
            <div className="flex space-x-2">
              <button
                onClick={() => onBulkAction('activate')}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Активировать ({selectedUsers.length})
              </button>
              <button
                onClick={() => onBulkAction('suspend')}
                className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
              >
                Заблокировать
              </button>
              <button
                onClick={() => onBulkAction('delete')}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Удалить
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserControls;
