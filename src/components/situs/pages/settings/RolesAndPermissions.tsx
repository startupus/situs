import React, { useState, useEffect } from 'react';

interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  level: number;
  inheritsFrom?: string;
  permissions: string[];
  limitations?: {
    maxProjects?: number;
    maxClients?: number;
    maxStorage?: number;
    allowedComponents?: string[];
  };
  isSystem: boolean;
  usersCount: number;
}

interface Permission {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  isSystem: boolean;
}

const RolesAndPermissions: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions' | 'hierarchy'>('roles');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  useEffect(() => {
    loadRolesAndPermissions();
  }, []);

  const loadRolesAndPermissions = async () => {
    setLoading(true);
    try {
      // Здесь будут API вызовы
      const mockRoles: Role[] = [
        {
          id: 'SUPER_ADMIN',
          name: 'SUPER_ADMIN',
          displayName: 'Супер администратор',
          description: 'Полный доступ ко всем функциям системы',
          level: 100,
          permissions: ['*'],
          isSystem: true,
          usersCount: 1
        },
        {
          id: 'STAFF',
          name: 'STAFF',
          displayName: 'Персонал',
          description: 'Системные администраторы и поддержка',
          level: 80,
          inheritsFrom: 'AGENCY',
          permissions: ['system.admin', 'project.view.all', 'user.view.all'],
          isSystem: true,
          usersCount: 3
        },
        {
          id: 'AGENCY',
          name: 'AGENCY',
          displayName: 'Агентство',
          description: 'Управление собственными проектами и проектами клиентов',
          level: 60,
          inheritsFrom: 'BUSINESS',
          permissions: ['project.view.clients', 'user.create.clients'],
          limitations: {
            maxProjects: 100,
            maxClients: 50,
            maxStorage: 100000,
            allowedComponents: ['projects', 'users', 'orders', 'analytics', 'billing']
          },
          isSystem: true,
          usersCount: 5
        },
        {
          id: 'BUSINESS',
          name: 'BUSINESS',
          displayName: 'Бизнес-пользователь',
          description: 'Управление собственными проектами',
          level: 40,
          permissions: ['project.create', 'project.view.own', 'project.edit.own'],
          limitations: {
            maxProjects: 5,
            maxClients: 0,
            maxStorage: 10000,
            allowedComponents: ['projects', 'orders', 'analytics']
          },
          isSystem: true,
          usersCount: 12
        }
      ];

      const mockPermissions: Permission[] = [
        { id: 'project.create', name: 'project.create', displayName: 'Создание проектов', description: 'Может создавать новые проекты', category: 'Проекты', isSystem: true },
        { id: 'project.view.own', name: 'project.view.own', displayName: 'Просмотр собственных проектов', description: 'Может просматривать свои проекты', category: 'Проекты', isSystem: true },
        { id: 'project.edit.own', name: 'project.edit.own', displayName: 'Редактирование собственных проектов', description: 'Может редактировать свои проекты', category: 'Проекты', isSystem: true },
        { id: 'user.view.own', name: 'user.view.own', displayName: 'Просмотр профиля', description: 'Может просматривать свой профиль', category: 'Пользователи', isSystem: true },
        { id: 'user.create.clients', name: 'user.create.clients', displayName: 'Создание клиентов', description: 'Может создавать пользователей-клиентов', category: 'Пользователи', isSystem: true }
      ];

      setRoles(mockRoles);
      setPermissions(mockPermissions);
    } catch (error) {
      console.error('Ошибка загрузки ролей и прав:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleLevel = (role: Role): string => {
    if (role.level >= 90) return 'Критический';
    if (role.level >= 70) return 'Высокий';
    if (role.level >= 50) return 'Средний';
    return 'Базовый';
  };

  const getRoleLevelColor = (role: Role): string => {
    if (role.level >= 90) return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
    if (role.level >= 70) return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20';
    if (role.level >= 50) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
    return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
  };

  const getPermissionsByCategory = () => {
    const categories: Record<string, Permission[]> = {};
    permissions.forEach(permission => {
      if (!categories[permission.category]) {
        categories[permission.category] = [];
      }
      categories[permission.category].push(permission);
    });
    return categories;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Роли и права доступа
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Управление системой ролей и разрешений пользователей
        </p>
      </div>

      {/* Табы */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('roles')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'roles'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Роли
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'permissions'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Права доступа
          </button>
          <button
            onClick={() => setActiveTab('hierarchy')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'hierarchy'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Иерархия
          </button>
        </nav>
      </div>

      {/* Контент табов */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          {/* Действия */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Всего ролей: {roles.length}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Системных: {roles.filter(r => r.isSystem).length}
              </span>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Создать роль
            </button>
          </div>

          {/* Список ролей */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {roles.map(role => (
              <div
                key={role.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedRole(role);
                  setIsRoleModalOpen(true);
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {role.displayName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {role.name}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleLevelColor(role)}`}>
                    {getRoleLevel(role)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {role.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Уровень:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{role.level}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Пользователей:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{role.usersCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Прав:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {role.permissions.includes('*') ? 'Все' : role.permissions.length}
                    </span>
                  </div>
                  {role.inheritsFrom && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Наследует:</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">{role.inheritsFrom}</span>
                    </div>
                  )}
                </div>

                {role.limitations && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Ограничения:
                    </h4>
                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      {role.limitations.maxProjects !== undefined && (
                        <div>Проектов: {role.limitations.maxProjects === -1 ? '∞' : role.limitations.maxProjects}</div>
                      )}
                      {role.limitations.maxClients !== undefined && (
                        <div>Клиентов: {role.limitations.maxClients === -1 ? '∞' : role.limitations.maxClients}</div>
                      )}
                      {role.limitations.maxStorage !== undefined && (
                        <div>Хранилище: {role.limitations.maxStorage === -1 ? '∞' : `${role.limitations.maxStorage} MB`}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'permissions' && (
        <div className="space-y-6">
          {/* Действия */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Всего прав: {permissions.length}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Системных: {permissions.filter(p => p.isSystem).length}
              </span>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Создать право
            </button>
          </div>

          {/* Права по категориям */}
          <div className="space-y-6">
            {Object.entries(getPermissionsByCategory()).map(([category, categoryPermissions]) => (
              <div key={category} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {category} ({categoryPermissions.length})
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {categoryPermissions.map(permission => (
                    <div
                      key={permission.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {permission.displayName}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {permission.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                            {permission.description}
                          </p>
                        </div>
                        {permission.isSystem && (
                          <span className="ml-2 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 rounded-full">
                            Системное
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'hierarchy' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Иерархия ролей
            </h3>
            
            <div className="space-y-4">
              {roles
                .sort((a, b) => b.level - a.level)
                .map((role, index) => (
                  <div key={role.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {role.level}
                      </span>
                    </div>
                    <div className="flex-1 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {role.displayName}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {role.description}
                          </p>
                          {role.inheritsFrom && (
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              ↳ Наследует права от {role.inheritsFrom}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {role.usersCount} пользователей
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {role.permissions.includes('*') ? 'Все права' : `${role.permissions.length} прав`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesAndPermissions;
