import React, { useState, useEffect } from 'react';
import { usersApi, User, UserFilters, UsersListResponse } from '../../../api/services/users.api';
import { projectsApi } from '../../../api/services/projects.api';
import { Project } from '../../../types/project';
import UserModal from '../components/UserModal';
import { ThemePermissionsModal } from '../../ui';

/**
 * Компонент управления пользователями с интеграцией API
 * Поддерживает фильтрацию, поиск, пагинацию и CRUD операции
 */
const SitusUsersNew: React.FC = () => {
  // Состояние компонента
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filters, setFilters] = useState<UserFilters>({});
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState<string>('');

  // Загрузка пользователей
  const loadUsers = async () => {
    setLoading(true);
    try {
      const searchFilters = {
        ...filters,
        search: searchTerm || undefined,
        projectId: projectId || undefined,
        page: currentPage,
        limit: pageSize,
      };

      const response = await usersApi.getUsers(searchFilters);
      setUsers(response.users);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка статистики
  const loadStats = async () => {
    try {
      // TODO: Добавить метод getUserStats в users API
      // const stats = await usersApi.getUserStats();
      // setStats(stats);
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    }
  };

  const loadProjects = async () => {
    try {
      const res = await projectsApi.getProjects({ page: 1, limit: 100 });
      setProjects(res.projects || []);
    } catch (e) {
      setProjects([]);
    }
  };

  // Обработчики событий
  const handleCreateUser = () => {
    setEditingUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        await usersApi.deleteUser(userId);
        await loadUsers();
      } catch (error) {
        console.error('Ошибка удаления пользователя:', error);
      }
    }
  };

  const handleSaveUser = async (userData: any) => {
    try {
      if (editingUser) {
        await usersApi.updateUser(editingUser.id, userData);
      } else {
        await usersApi.createUser(userData);
      }

      setShowUserModal(false);
      setEditingUser(null);
      await loadUsers();
    } catch (error) {
      console.error('Ошибка сохранения пользователя:', error);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') => {
    try {
      await usersApi.updateUserStatus(userId, newStatus);
      await loadUsers();
    } catch (error) {
      console.error('Ошибка изменения статуса:', error);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'ADMIN' | 'USER') => {
    try {
      await usersApi.updateUser(userId, { role: newRole });
      await loadUsers();
    } catch (error) {
      console.error('Ошибка изменения роли:', error);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadUsers();
  };

  const handleFilterChange = (newFilters: Partial<UserFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
  };

  // Вспомогательные функции
  const getRoleDisplay = (role: 'ADMIN' | 'USER'): string => {
    const roleMap = {
      ADMIN: 'Администратор',
      USER: 'Пользователь',
    };
    return roleMap[role] || role;
  };

  const getStatusDisplay = (status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'): string => {
    const statusMap = {
      ACTIVE: 'Активен',
      INACTIVE: 'Неактивен',
      SUSPENDED: 'Заблокирован',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'): string => {
    const colorMap = {
      ACTIVE: 'text-green-600 bg-green-100',
      INACTIVE: 'text-gray-600 bg-gray-100',
      SUSPENDED: 'text-red-600 bg-red-100',
    };
    return colorMap[status] || 'text-gray-600 bg-gray-100';
  };

  const getRoleColor = (role: 'ADMIN' | 'USER'): string => {
    const colorMap = {
      ADMIN: 'text-purple-600 bg-purple-100',
      USER: 'text-blue-600 bg-blue-100',
    };
    return colorMap[role] || 'text-gray-600 bg-gray-100';
  };

  // Загрузка данных при монтировании и изменении фильтров
  useEffect(() => {
    loadProjects();
    loadUsers();
    loadStats();
  }, [currentPage, filters, projectId]);

  useEffect(() => {
    const timeoutId = setTimeout(handleSearch, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Заголовок */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Управление пользователями</h1>
        <button
          onClick={handleCreateUser}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Добавить пользователя
        </button>
      </div>

      {/* Фильтры и поиск */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div>
            <select
              value={projectId}
              onChange={(e) => {
                setProjectId(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Все проекты</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Поиск по имени или email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filters.role || ''}
            onChange={(e) => handleFilterChange({ role: e.target.value || undefined })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Все роли</option>
            <option value="ADMIN">Администратор</option>
            <option value="USER">Пользователь</option>
          </select>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange({ status: e.target.value || undefined })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Все статусы</option>
            <option value="ACTIVE">Активен</option>
            <option value="INACTIVE">Неактивен</option>
            <option value="SUSPENDED">Заблокирован</option>
          </select>
        </div>
      </div>

      {/* Таблица пользователей */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-4 py-2 text-left">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">Пользователь</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Email</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Роль</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Статус</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Дата регистрации</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border border-gray-200 px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">{user.username.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.username}</div>
                      {user.profile?.firstName && user.profile?.lastName && (
                        <div className="text-sm text-gray-500">
                          {user.profile.firstName} {user.profile.lastName}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="border border-gray-200 px-4 py-2 text-gray-900">{user.email}</td>
                <td className="border border-gray-200 px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {getRoleDisplay(user.role)}
                  </span>
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                    {getStatusDisplay(user.status)}
                  </span>
                </td>
                <td className="border border-gray-200 px-4 py-2 text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  <div className="flex space-x-2">
                    <button onClick={() => handleEditUser(user)} className="text-blue-600 hover:text-blue-800 text-sm">
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
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
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-700">
            Показано {(pagination.page - 1) * pagination.limit + 1} -{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} из {pagination.total}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={pagination.page === 1}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Назад
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Вперед
            </button>
          </div>
        </div>
      )}

      {/* Модальные окна */}
      {showUserModal && (
        <UserModal
          isOpen={showUserModal}
          onClose={() => {
            setShowUserModal(false);
            setEditingUser(null);
          }}
          user={editingUser}
          onSave={handleSaveUser}
        />
      )}

      {showPermissionsModal && (
        <ThemePermissionsModal
          isOpen={showPermissionsModal}
          onClose={() => setShowPermissionsModal(false)}
          userId=""
          onSave={() => {}}
        />
      )}
    </div>
  );
};

export default SitusUsersNew;
