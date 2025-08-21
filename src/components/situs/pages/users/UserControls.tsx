import React from 'react';
import { ThemeButton, ThemeInput, ThemeSelect } from '../../../ui';
import { FiMail, FiSearch } from 'react-icons/fi';

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
          <ThemeInput
            type="text"
            placeholder="Поиск пользователей..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<FiSearch className="w-5 h-5" />}
          />
          
          <ThemeSelect
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            options={[
              { value: "", label: "Все роли" },
              { value: "SUPER_ADMIN", label: "Супер Админ" },
              { value: "STAFF", label: "Сотрудник" },
              { value: "AGENCY", label: "Агентство" },
              { value: "BUSINESS", label: "Бизнес" }
            ]}
          />
          
          <ThemeSelect
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: "", label: "Все статусы" },
              { value: "active", label: "Активные" },
              { value: "pending", label: "Ожидающие" },
              { value: "suspended", label: "Заблокированные" },
              { value: "inactive", label: "Неактивные" }
            ]}
          />
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
              <ThemeButton
                onClick={() => onBulkAction('activate')}
                variant="success"
                size="sm"
              >
                Активировать ({selectedUsers.length})
              </ThemeButton>
              <ThemeButton
                onClick={() => onBulkAction('suspend')}
                variant="warning"
                size="sm"
              >
                Заблокировать
              </ThemeButton>
              <ThemeButton
                onClick={() => onBulkAction('delete')}
                variant="danger"
                size="sm"
              >
                Удалить
              </ThemeButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserControls;
