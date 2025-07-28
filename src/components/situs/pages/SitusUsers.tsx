import React, { useState, useMemo, useEffect } from 'react';
import { User, UserRole, UserStatus, UserFilters, UserStats } from '../../../types/users';
import { mockUsersApi } from '../../../api/mockUsersData';
import UserModal from '../components/UserModal';
import RolePermissionsModal from '../components/RolePermissionsModal';

// Мок-данные пользователей
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@situs.com',
    firstName: 'Дмитрий',
    lastName: 'Иванов',
    role: 'super_admin',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-15'),
    lastLoginAt: new Date('2024-12-15'),
    isEmailVerified: true,
    phone: '+7 (999) 123-45-67',
    company: 'Situs Platform',
    position: 'CTO',
    projectsCount: 25,
    ordersCount: 156,
    permissions: ['all'],
  },
  {
    id: '2',
    email: 'manager@company.ru',
    firstName: 'Анна',
    lastName: 'Петрова',
    role: 'company_admin',
    status: 'active',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-12-10'),
    lastLoginAt: new Date('2024-12-14'),
    isEmailVerified: true,
    phone: '+7 (999) 234-56-78',
    company: 'ООО "Инновации"',
    position: 'Руководитель проектов',
    projectsCount: 8,
    ordersCount: 42,
    permissions: ['projects.manage', 'users.view', 'orders.manage'],
  },
  {
    id: '3',
    email: 'editor@creative.com',
    firstName: 'Михаил',
    lastName: 'Сидоров',
    role: 'editor',
    status: 'active',
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-12-12'),
    lastLoginAt: new Date('2024-12-13'),
    isEmailVerified: true,
    company: 'Creative Agency',
    position: 'Контент-менеджер',
    projectsCount: 3,
    ordersCount: 18,
    permissions: ['projects.edit', 'marketing.view'],
  },
  {
    id: '4',
    email: 'client@business.ru',
    firstName: 'Елена',
    lastName: 'Козлова',
    role: 'client',
    status: 'active',
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-12-11'),
    lastLoginAt: new Date('2024-12-11'),
    isEmailVerified: true,
    phone: '+7 (999) 345-67-89',
    company: 'ИП Козлова Е.А.',
    projectsCount: 2,
    ordersCount: 8,
    permissions: ['projects.view'],
    clientInfo: {
      balance: 15000,
      currency: 'RUB',
      totalSpent: 85000,
      registrationSource: 'Website',
    },
  },
  {
    id: '5',
    email: 'pending@newuser.com',
    firstName: 'Алексей',
    lastName: 'Новиков',
    role: 'client',
    status: 'pending',
    createdAt: new Date('2024-12-14'),
    updatedAt: new Date('2024-12-14'),
    isEmailVerified: false,
    projectsCount: 0,
    ordersCount: 0,
    permissions: [],
  },
];

const SitusUsers: React.FC = () => {
  const [users] = useState<User[]>(mockUsers);
  const [filters, setFilters] = useState<UserFilters>({
    role: 'all',
    status: 'all',
    search: '',
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Фильтрация пользователей
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesRole = filters.role === 'all' || user.role === filters.role;
      const matchesStatus = filters.status === 'all' || user.status === filters.status;
      const matchesSearch = !filters.search || 
        user.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        (user.company && user.company.toLowerCase().includes(filters.search.toLowerCase()));
      
      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [users, filters]);

  // Статистика
  const stats: UserStats = useMemo(() => {
    const total = users.length;
    const active = users.filter(u => u.status === 'active').length;
    const inactive = users.filter(u => u.status === 'inactive').length;
    const suspended = users.filter(u => u.status === 'suspended').length;
    const pending = users.filter(u => u.status === 'pending').length;
    
    const byRole = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<UserRole, number>);

    const thisMonth = new Date();
    thisMonth.setDate(1);
    const newThisMonth = users.filter(u => u.createdAt >= thisMonth).length;

    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const newThisWeek = users.filter(u => u.createdAt >= thisWeek).length;

    return {
      total,
      active,
      inactive,
      suspended,
      pending,
      byRole,
      newThisMonth,
      newThisWeek,
    };
  }, [users]);

  const getRoleDisplayName = (role: UserRole) => {
    const roleNames = {
      super_admin: 'Супер админ',
      company_admin: 'Админ компании',
      admin: 'Администратор',
      moderator: 'Модератор',
      editor: 'Редактор',
      client: 'Клиент',
    };
    return roleNames[role];
  };

  const getStatusDisplayName = (status: UserStatus) => {
    const statusNames = {
      active: 'Активен',
      inactive: 'Неактивен',
      suspended: 'Заблокирован',
      pending: 'Ожидает',
    };
    return statusNames[status];
  };

  const getStatusColor = (status: UserStatus) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    };
    return colors[status];
  };

  const getRoleColor = (role: UserRole) => {
    const colors = {
      super_admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      company_admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      admin: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      moderator: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      editor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      client: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    };
    return colors[role];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleManagePermissions = (userId: string) => {
    setSelectedUserId(userId);
    setIsRoleModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-dark dark:text-white">
          Управление пользователями
        </h1>
        <p className="text-body-color dark:text-dark-6 mt-2">
          Управление пользователями платформы, ролями и правами доступа
        </p>
      </div>

      {/* Статистические карточки */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow-1 dark:bg-dark-2 dark:shadow-box-dark">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-dark dark:text-white">
                {stats.total}
              </h3>
              <p className="text-sm text-body-color dark:text-dark-6">
                Всего пользователей
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-1 dark:bg-dark-2 dark:shadow-box-dark">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-dark dark:text-white">
                {stats.active}
              </h3>
              <p className="text-sm text-body-color dark:text-dark-6">
                Активных
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
              <svg className="h-6 w-6 text-green-600 dark:text-green-200" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-1 dark:bg-dark-2 dark:shadow-box-dark">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-dark dark:text-white">
                {stats.newThisMonth}
              </h3>
              <p className="text-sm text-body-color dark:text-dark-6">
                Новых за месяц
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <svg className="h-6 w-6 text-blue-600 dark:text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-1 dark:bg-dark-2 dark:shadow-box-dark">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-dark dark:text-white">
                {stats.pending}
              </h3>
              <p className="text-sm text-body-color dark:text-dark-6">
                Ожидают активации
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900">
              <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-200" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Фильтры и поиск */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow-1 dark:bg-dark-2 dark:shadow-box-dark">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Поиск */}
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск пользователей..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 pl-10 text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:text-white md:w-64"
              />
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body-color dark:text-dark-6"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Фильтр по роли */}
            <select
              value={filters.role}
              onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value as UserRole | 'all' }))}
              className="rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:text-white"
            >
              <option value="all">Все роли</option>
              <option value="super_admin">Супер админ</option>
              <option value="company_admin">Админ компании</option>
              <option value="admin">Администратор</option>
              <option value="moderator">Модератор</option>
              <option value="editor">Редактор</option>
              <option value="client">Клиент</option>
            </select>

            {/* Фильтр по статусу */}
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as UserStatus | 'all' }))}
              className="rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:text-white"
            >
              <option value="all">Все статусы</option>
              <option value="active">Активен</option>
              <option value="inactive">Неактивен</option>
              <option value="suspended">Заблокирован</option>
              <option value="pending">Ожидает</option>
            </select>
          </div>

          <button
            onClick={handleCreateUser}
            className="rounded-lg bg-primary px-6 py-2 text-white transition-colors hover:bg-primary/90"
          >
            Добавить пользователя
          </button>
        </div>
      </div>

      {/* Таблица пользователей */}
      <div className="rounded-lg bg-white shadow-1 dark:bg-dark-2 dark:shadow-box-dark">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-stroke dark:border-dark-3">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark dark:text-white">
                  Пользователь
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark dark:text-white">
                  Роль
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark dark:text-white">
                  Статус
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark dark:text-white">
                  Проекты
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark dark:text-white">
                  Последний вход
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark dark:text-white">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-stroke dark:border-dark-3 hover:bg-gray/5 dark:hover:bg-dark-3">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div>
                        <div className="font-medium text-dark dark:text-white">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-body-color dark:text-dark-6">
                          {user.email}
                        </div>
                        {user.company && (
                          <div className="text-xs text-body-color dark:text-dark-6">
                            {user.company}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getRoleColor(user.role)}`}>
                      {getRoleDisplayName(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(user.status)}`}>
                      {getStatusDisplayName(user.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-dark dark:text-white">
                      {user.projectsCount} проектов
                    </div>
                    <div className="text-xs text-body-color dark:text-dark-6">
                      {user.ordersCount} заказов
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-dark dark:text-white">
                      {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Никогда'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="rounded-lg bg-blue-100 px-3 py-1 text-xs text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200"
                      >
                        Редактировать
                      </button>
                      <button
                        onClick={() => handleManagePermissions(user.id)}
                        className="rounded-lg bg-purple-100 px-3 py-1 text-xs text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200"
                      >
                        Права
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-body-color dark:text-dark-6">
              Пользователи не найдены
            </p>
          </div>
        )}
      </div>

      {/* Модальные окна */}
      {isUserModalOpen && (
        <UserModal
          user={selectedUser}
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
          onSave={(userData) => {
            // Здесь будет логика сохранения
            console.log('Saving user:', userData);
            setIsUserModalOpen(false);
          }}
        />
      )}

      {isRoleModalOpen && selectedUserId && (
        <RolePermissionsModal
          userId={selectedUserId}
          isOpen={isRoleModalOpen}
          onClose={() => setIsRoleModalOpen(false)}
          onSave={(permissions) => {
            // Здесь будет логика сохранения прав
            console.log('Saving permissions:', permissions);
            setIsRoleModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default SitusUsers; 