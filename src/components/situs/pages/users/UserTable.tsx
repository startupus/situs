import React from 'react';
import { ThemeButton, ThemeSelect, ThemeCheckbox, ThemeBadge, ThemeActionButtons } from '../../../ui';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  globalRole: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
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
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  onUpdateUserRole,
  onUpdateUserStatus
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
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'suspended': return 'danger';
      case 'inactive': return 'info';
      default: return 'info';
    }
  };

  const getStatusLabel = (status: User['status']): string => {
    switch (status) {
      case 'active': return 'Активный';
      case 'pending': return 'Ожидает';
      case 'suspended': return 'Заблокирован';
      case 'inactive': return 'Неактивный';
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
                  onChange={(e) => onSelectAll(e.target.checked)}
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
                    onChange={(e) => onSelectUser(user.id, e.target.checked)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {user.avatar ? (
                      <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
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
                  <ThemeBadge
                    variant={getStatusVariant(user.status)}
                    size="sm"
                  >
                    {getStatusLabel(user.status)}
                  </ThemeBadge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {user.projectsCount}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {user.lastLogin ? user.lastLogin.toLocaleDateString('ru-RU') : 'Никогда'}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <ThemeActionButtons
                    onEdit={() => console.log('Edit user:', user.id)}
                    onDelete={() => console.log('Delete user:', user.id)}
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
