import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  FunnelIcon,
  ArrowPathIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table, { TableColumn } from '../components/ui/Table';
import { User, UserFilter, PaginatedResponse } from '../types';
import { apiClient } from '../services/api';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    pages: 0,
  });

  const [sorting, setSorting] = useState<{
    field: keyof User;
    direction: 'asc' | 'desc';
  }>({
    field: 'createdAt',
    direction: 'desc',
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.limit, sorting, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        filters: {
          ...filters,
          ...(searchTerm && { search: searchTerm }),
        },
      };

      const response = await apiClient.getUsers(params);
      setUsers(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total,
        pages: response.pagination.pages,
      }));
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Не удалось загрузить пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: keyof User, direction: 'asc' | 'desc') => {
    setSorting({ field, direction });
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  };

  const handleFilterChange = (newFilters: UserFilter) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      return;
    }

    try {
      await apiClient.deleteUser(userId);
      await fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Не удалось удалить пользователя');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      active: 'badge-success',
      inactive: 'badge-gray',
      suspended: 'badge-danger',
    };
    
    const labels: Record<string, string> = {
      active: 'Активен',
      inactive: 'Неактивен',
      suspended: 'Заблокирован',
    };

    return (
      <span className={`badge ${badges[status] || 'badge-gray'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, string> = {
      admin: 'badge-primary',
      user: 'badge-gray',
    };
    
    const labels: Record<string, string> = {
      admin: 'Администратор',
      user: 'Пользователь',
    };

    return (
      <span className={`badge ${badges[role] || 'badge-gray'}`}>
        {labels[role] || role}
      </span>
    );
  };

  const columns: TableColumn<User>[] = [
    {
      key: 'id',
      label: 'ID',
      width: '120px',
      render: (value) => (
        <span className="font-mono text-xs text-gray-500">
          {value.substring(0, 8)}...
        </span>
      ),
    },
    {
      key: 'username',
      label: 'Имя пользователя',
      width: '150px',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8">
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-gray-600" />
            </div>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{value}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      width: '200px',
      sortable: true,
      render: (value) => (
        <div className="text-sm text-gray-900">{value}</div>
      ),
    },
    {
      key: 'role',
      label: 'Роль',
      width: '120px',
      render: (value) => getRoleBadge(value),
    },
    {
      key: 'status',
      label: 'Статус',
      width: '120px',
      render: (value) => getStatusBadge(value),
    },
    {
      key: 'createdAt',
      label: 'Создан',
      width: '140px',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'updatedAt',
      label: 'Обновлен',
      width: '140px',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="form-label">Роль</label>
            <select
              className="form-input"
              value={filters.role || ''}
              onChange={(e) => handleFilterChange({ ...filters, role: e.target.value as any || undefined })}
            >
              <option value="">Все роли</option>
              <option value="admin">Администратор</option>
              <option value="user">Пользователь</option>
            </select>
          </div>
          
          <div>
            <label className="form-label">Статус</label>
            <select
              className="form-input"
              value={filters.status || ''}
              onChange={(e) => handleFilterChange({ ...filters, status: e.target.value as any || undefined })}
            >
              <option value="">Все статусы</option>
              <option value="active">Активен</option>
              <option value="inactive">Неактивен</option>
              <option value="suspended">Заблокирован</option>
            </select>
          </div>
          
          <div>
            <label className="form-label">Дата создания от</label>
            <input
              type="date"
              className="form-input"
              value={filters.dateFrom || ''}
              onChange={(e) => handleFilterChange({ ...filters, dateFrom: e.target.value || undefined })}
            />
          </div>
          
          <div>
            <label className="form-label">Дата создания до</label>
            <input
              type="date"
              className="form-input"
              value={filters.dateTo || ''}
              onChange={(e) => handleFilterChange({ ...filters, dateTo: e.target.value || undefined })}
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              setFilters({});
              setSearchTerm('');
            }}
          >
            Очистить фильтры
          </Button>
          <Button
            variant="primary"
            onClick={fetchUsers}
          >
            Применить фильтры
          </Button>
        </div>
      </Card>
    );
  };

  const renderActions = (user: User) => (
    <div className="flex items-center space-x-2">
      <Link to={`/users/${user.id}`}>
        <Button variant="ghost" size="sm">
          <EyeIcon className="h-4 w-4" />
        </Button>
      </Link>
      
      <Link to={`/users/${user.id}/edit`}>
        <Button variant="ghost" size="sm">
          <PencilIcon className="h-4 w-4" />
        </Button>
      </Link>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDeleteUser(user.id)}
      >
        <TrashIcon className="h-4 w-4 text-danger-600" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Пользователи</h1>
          <p className="text-sm text-gray-500">
            Управление пользователями биллинговой системы
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => fetchUsers()}
            loading={loading}
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Обновить
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Фильтры
          </Button>
          
          <Link to="/users/new">
            <Button variant="primary">
              <PlusIcon className="h-4 w-4 mr-2" />
              Новый пользователь
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            className="form-input pl-10"
            placeholder="Поиск по имени пользователя или email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                fetchUsers();
              }
            }}
          />
        </div>
      </Card>

      {/* Filters */}
      {renderFilters()}

      {/* Error State */}
      {error && (
        <Card className="text-center py-8">
          <div className="text-danger-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ошибка загрузки</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={fetchUsers} variant="primary">
            Повторить попытку
          </Button>
        </Card>
      )}

      {/* Users Table */}
      <Table
        data={users}
        columns={columns}
        loading={loading}
        pagination={{
          ...pagination,
          onPageChange: handlePageChange,
          onLimitChange: handleLimitChange,
        }}
        sorting={{
          field: sorting.field,
          direction: sorting.direction,
          onSort: handleSort,
        }}
        actions={renderActions}
        emptyMessage="Пользователи не найдены"
      />
    </div>
  );
};

export default Users;