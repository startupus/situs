import React from 'react';
import { ThemeButton, ThemeSelect, ThemeCheckbox, ThemeBadge, ThemeActionButtons } from '../../../ui';
import ToggleSwitch from '../../../ui/ToggleSwitch';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  globalRole: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED' | 'BANNED';
  lastLogin?: Date;
  projectsCount: number;
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
}

interface UserTableProps {
  users: User[];
  selectedUsers: string[];
  onSelectUser: (userId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onUpdateUserRole: (userId: string, newRole: string) => void;
  onUpdateUserStatus: (userId: string, newStatus: User['status']) => void;
  onEditUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  onUpdateUserRole,
  onUpdateUserStatus,
  onEditUser,
  onDeleteUser
}) => {
  const getRoleVariant = (role: string): 'primary' | 'success' | 'danger' | 'warning' | 'info' => {
    switch (role) {
      case 'SUPER_ADMIN': return 'danger';
      case 'STAFF': return 'primary';
      case 'AGENCY': return 'info';
      case 'BUSINESS': return 'success';
      default: return 'primary';
    }
  };

  const getRoleLabel = (role: string): string => {
    switch (role) {
      case 'SUPER_ADMIN': return 'Супер Админ';
      case 'STAFF': return 'Сотрудник';
      case 'AGENCY': return 'Агентство';
      case 'BUSINESS': return 'Бизнес';
      default: return role;
    }
  };

  const getStatusVariant = (status: User['status']): 'primary' | 'success' | 'danger' | 'warning' | 'info' => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'PENDING': return 'warning';
      case 'SUSPENDED': return 'danger';
      case 'BANNED': return 'danger';
      case 'INACTIVE': return 'info';
      default: return 'info';
    }
  };

  const getStatusLabel = (status: User['status']): string => {
    switch (status) {
      case 'ACTIVE': return 'Активный';
      case 'PENDING': return 'Ожидает';
      case 'SUSPENDED': return 'Заблокирован';
      case 'BANNED': return 'Забанен';
      case 'INACTIVE': return 'Неактивный';
      default: return status;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left">
                <ThemeCheckbox
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onChange={(checked) => onSelectAll(checked)}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Пользователь
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Роль
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Проекты
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Последний вход
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4">
                  <ThemeCheckbox
                    checked={selectedUsers.includes(user.id)}
                    onChange={(checked) => onSelectUser(user.id, checked)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="relative">
                      {user.avatar ? (
                        <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                      {/* Статус-индикатор на аватарке */}
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                        user.status === 'ACTIVE' ? 'bg-green-500' :
                        user.status === 'INACTIVE' ? 'bg-gray-400' :
                        user.status === 'PENDING' ? 'bg-yellow-500' :
                        (user.status === 'SUSPENDED' || user.status === 'BANNED') ? 'bg-red-500' : 'bg-gray-400'
                      }`} title={
                        user.status === 'ACTIVE' ? 'Активен' :
                        user.status === 'INACTIVE' ? 'Неактивен' :
                        user.status === 'PENDING' ? 'Ожидает активации' :
                        (user.status === 'SUSPENDED' || user.status === 'BANNED') ? 'Заблокирован' : 'Неизвестный статус'
                      }></div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        <span>{user.name}</span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                        <span>{user.email}</span>
                        {user.isEmailVerified && (
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        {user.twoFactorEnabled && (
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <ThemeBadge
                    variant={getRoleVariant(user.globalRole)}
                    size="sm"
                  >
                    {getRoleLabel(user.globalRole)}
                  </ThemeBadge>
                </td>
                <td className="px-6 py-4">
                  {user.status === 'SUSPENDED' || user.status === 'BANNED' || user.status === 'PENDING' ? (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {(user.status === 'SUSPENDED' || user.status === 'BANNED') && 'Заблокирован'}
                      {user.status === 'PENDING' && 'Ожидает'}
                    </span>
                  ) : (
                    <ToggleSwitch
                      checked={user.status === 'ACTIVE'}
                      onChange={(checked) => {
                        const newStatus = checked ? 'ACTIVE' : 'INACTIVE';
                        onUpdateUserStatus(user.id, newStatus);
                      }}
                      size="sm"
                    />
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {user.projectsCount}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {user.lastLogin ? user.lastLogin.toLocaleDateString('ru-RU') : 'Никогда'}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <ThemeActionButtons
                    onEdit={() => onEditUser(user.id)}
                    onDelete={() => onDeleteUser(user.id)}
                    editTitle="Редактировать пользователя"
                    deleteTitle="Удалить пользователя"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
