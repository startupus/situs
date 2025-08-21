import React, { useState, useMemo, useEffect } from 'react';
import { usersApi, UserFilters, UsersListResponse } from '../../../api/services/users.api';
import { User } from '../../../types/users';
import { ApiUtils } from '../../../api/client';
import UserModal from '../components/UserModal';
import RolePermissionsModal from '../components/RolePermissionsModal';
import { testIds } from '../../ui/testids';

const SitusUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: '',
    status: '',
    sortBy: 'created',
    sortOrder: 'desc',
    page: 1,
    limit: 20
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Загрузка пользователей
  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await usersApi.getUsers(filters);
      setUsers(response.users);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage = ApiUtils.handleError(err);
      setError(errorMessage);
      console.error('Load users error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка при изменении фильтров
  useEffect(() => {
    loadUsers();
  }, [filters]);

  // Статистика пользователей
  const stats = useMemo(() => {
    return {
      total: pagination.total,
      active: users.filter(u => u.status === 'active').length,
      inactive: users.filter(u => u.status === 'inactive').length,
      suspended: users.filter(u => u.status === 'suspended').length,
      pending: users.filter(u => u.status === 'pending').length,
      byRole: {
        super_admin: users.filter(u => u.role === 'super_admin').length,
        company_admin: users.filter(u => u.role === 'company_admin').length,
        admin: users.filter(u => u.role === 'admin').length,
        moderator: users.filter(u => u.role === 'moderator').length,
        editor: users.filter(u => u.role === 'editor').length,
        client: users.filter(u => u.role === 'client').length,
      },
      newThisMonth: 0, // Будет вычисляться на бэкенде
      newThisWeek: 0, // Будет вычисляться на бэкенде
    };
  }, [users, pagination]);

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      super_admin: 'Супер администратор',
      company_admin: 'Администратор компании',
      admin: 'Администратор',
      moderator: 'Модератор',
      editor: 'Редактор',
      client: 'Клиент',
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  const getStatusDisplayName = (status: string) => {
    const statusNames = {
      active: 'Активен',
      inactive: 'Неактивен', 
      suspended: 'Заблокирован',
      pending: 'Ожидает',
    };
    return statusNames[status as keyof typeof statusNames] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRoleColor = (role: string) => {
    const colors = {
      super_admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      company_admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      admin: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      moderator: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      editor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      client: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleFilterChange = (newFilters: Partial<UserFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Сбрасываем на первую страницу при изменении фильтров
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleEditPermissions = (userId: string) => {
    setSelectedUserId(userId);
    setIsRoleModalOpen(true);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleUserSave = async (userData: any) => {
    try {
      if (selectedUser) {
        await usersApi.updateUser(selectedUser.id, userData);
      } else {
        await usersApi.createUser(userData);
      }
      loadUsers();
      setIsUserModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Save user error:', error);
      alert('Ошибка сохранения пользователя');
    }
  };

  const handlePermissionsSave = async (permissions: string[]) => {
    try {
      if (selectedUserId) {
        // Здесь будет обновление прав пользователя
        console.log('Saving permissions for user:', selectedUserId, permissions);
      }
      setIsRoleModalOpen(false);
      setSelectedUserId(null);
    } catch (error) {
      console.error('Save permissions error:', error);
      alert('Ошибка сохранения прав доступа');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      return;
    }

    try {
      await usersApi.deleteUser(userId);
      loadUsers();
    } catch (error) {
      console.error('Delete user error:', error);
      alert('Ошибка удаления пользователя');
    }
  };

  if (loading && users.length === 0 && !error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" data-testid={testIds.users.container}>
      {/* Заголовок */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Управление пользователями
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Управление пользователями платформы, ролями и правами доступа
          </p>
        </div>
        <button
          onClick={handleCreateUser}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Добавить пользователя
        </button>
      </div>

      {/* Ошибка */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Всего пользователей</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Активных</h3>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Новых за месяц</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.newThisMonth}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ожидают активации</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
      </div>

      {/* Фильтры */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Поиск
            </label>
            <input
              data-testid={testIds.users.searchInput}
              type="text"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              placeholder="Поиск пользователей..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Роль
            </label>
            <select
              data-testid={testIds.users.roleSelect}
              value={filters.role || ''}
              onChange={(e) => handleFilterChange({ role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Все роли</option>
              <option value="super_admin">Супер администратор</option>
              <option value="company_admin">Администратор компании</option>
              <option value="admin">Администратор</option>
              <option value="moderator">Модератор</option>
              <option value="editor">Редактор</option>
              <option value="client">Клиент</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Статус
            </label>
            <select
              data-testid={testIds.users.statusSelect}
              value={filters.status || ''}
              onChange={(e) => handleFilterChange({ status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Все статусы</option>
              <option value="active">Активен</option>
              <option value="inactive">Неактивен</option>
              <option value="suspended">Заблокирован</option>
              <option value="pending">Ожидает</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Сортировка
            </label>
            <select
              value={`${filters.sortBy}_${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('_');
                handleFilterChange({ sortBy: sortBy as any, sortOrder: sortOrder as any });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="created_desc">Новые сначала</option>
              <option value="created_asc">Старые сначала</option>
              <option value="username_asc">По имени А-Я</option>
              <option value="username_desc">По имени Я-А</option>
            </select>
          </div>
        </div>
      </div>

      {/* Таблица пользователей */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden" data-testid={testIds.users.table}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Пользователь
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Роль
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Проекты
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Последний вход
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700" data-testid={testIds.users.row}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {user.firstName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}`
                            : user.email
                          }
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {getRoleDisplayName(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {getStatusDisplayName(user.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.projectsCount} проектов
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Никогда'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        data-testid={testIds.users.editButton}
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Редактировать
                      </button>
                      <button
                        data-testid={testIds.users.permissionsButton}
                        onClick={() => handleEditPermissions(user.id)}
                        className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                      >
                        Права
                      </button>
                      <button
                        data-testid={testIds.users.deleteButton}
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Пагинация */}
        {pagination.totalPages > 1 && (
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Показано {users.length} из {pagination.total} пользователей
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Назад
              </button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const page = i + Math.max(1, pagination.page - 2);
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm ${
                      page === pagination.page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Вперед
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Модальные окна */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSave={handleUserSave}
      />

      <RolePermissionsModal
        isOpen={isRoleModalOpen}
        onClose={() => {
          setIsRoleModalOpen(false);
          setSelectedUserId(null);
        }}
        userId={selectedUserId || ''}
        onSave={handlePermissionsSave}
      />
    </div>
  );
};

export default SitusUsers; 