import React, { useState, useEffect } from 'react';
import { UserPermission, Role, UserRole } from '../../../types/users';

interface RolePermissionsModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (permissions: string[]) => void;
}

// Мок-данные прав доступа
const mockPermissions: UserPermission[] = [
  // Проекты
  { id: 'projects.view', name: 'Просмотр проектов', description: 'Может просматривать список проектов', category: 'projects' },
  { id: 'projects.create', name: 'Создание проектов', description: 'Может создавать новые проекты', category: 'projects' },
  { id: 'projects.edit', name: 'Редактирование проектов', description: 'Может редактировать существующие проекты', category: 'projects' },
  { id: 'projects.delete', name: 'Удаление проектов', description: 'Может удалять проекты', category: 'projects' },
  { id: 'projects.manage', name: 'Управление проектами', description: 'Полное управление проектами', category: 'projects' },
  
  // Пользователи
  { id: 'users.view', name: 'Просмотр пользователей', description: 'Может просматривать список пользователей', category: 'users' },
  { id: 'users.create', name: 'Создание пользователей', description: 'Может создавать новых пользователей', category: 'users' },
  { id: 'users.edit', name: 'Редактирование пользователей', description: 'Может редактировать данные пользователей', category: 'users' },
  { id: 'users.delete', name: 'Удаление пользователей', description: 'Может удалять пользователей', category: 'users' },
  { id: 'users.permissions', name: 'Управление правами', description: 'Может изменять права доступа пользователей', category: 'users' },

  // Заказы
  { id: 'orders.view', name: 'Просмотр заказов', description: 'Может просматривать заказы', category: 'orders' },
  { id: 'orders.create', name: 'Создание заказов', description: 'Может создавать заказы', category: 'orders' },
  { id: 'orders.edit', name: 'Редактирование заказов', description: 'Может редактировать заказы', category: 'orders' },
  { id: 'orders.manage', name: 'Управление заказами', description: 'Полное управление заказами', category: 'orders' },

  // Маркетинг
  { id: 'marketing.view', name: 'Просмотр маркетинга', description: 'Может просматривать маркетинговые данные', category: 'marketing' },
  { id: 'marketing.campaigns', name: 'Управление кампаниями', description: 'Может создавать и управлять маркетинговыми кампаниями', category: 'marketing' },
  { id: 'marketing.analytics', name: 'Аналитика маркетинга', description: 'Доступ к аналитике и отчетам', category: 'marketing' },

  // Настройки
  { id: 'settings.view', name: 'Просмотр настроек', description: 'Может просматривать настройки системы', category: 'settings' },
  { id: 'settings.edit', name: 'Изменение настроек', description: 'Может изменять настройки системы', category: 'settings' },
  { id: 'settings.system', name: 'Системные настройки', description: 'Доступ к критическим системным настройкам', category: 'settings' },

  // Отчеты
  { id: 'reports.view', name: 'Просмотр отчетов', description: 'Может просматривать отчеты', category: 'reports' },
  { id: 'reports.export', name: 'Экспорт отчетов', description: 'Может экспортировать отчеты', category: 'reports' },
  { id: 'reports.advanced', name: 'Расширенные отчеты', description: 'Доступ к расширенной аналитике', category: 'reports' },
];

// Роли с предустановленными правами
const mockRoles: Role[] = [
  {
    id: 'super_admin',
    name: 'super_admin',
    displayName: 'Супер администратор',
    description: 'Полный доступ ко всем функциям системы',
    permissions: ['all'],
    level: 100,
  },
  {
    id: 'company_admin',
    name: 'company_admin',
    displayName: 'Администратор компании',
    description: 'Управление проектами и пользователями компании',
    permissions: [
      'projects.manage',
      'users.view', 'users.create', 'users.edit',
      'orders.manage',
      'marketing.view', 'marketing.campaigns',
      'reports.view', 'reports.export',
    ],
    level: 80,
  },
  {
    id: 'admin',
    name: 'admin',
    displayName: 'Администратор',
    description: 'Управление проектами и контентом',
    permissions: [
      'projects.view', 'projects.create', 'projects.edit',
      'users.view',
      'orders.view', 'orders.edit',
      'marketing.view',
      'reports.view',
    ],
    level: 60,
  },
  {
    id: 'moderator',
    name: 'moderator',
    displayName: 'Модератор',
    description: 'Модерация контента и пользователей',
    permissions: [
      'projects.view', 'projects.edit',
      'users.view',
      'orders.view',
      'marketing.view',
    ],
    level: 40,
  },
  {
    id: 'editor',
    name: 'editor',
    displayName: 'Редактор',
    description: 'Создание и редактирование контента',
    permissions: [
      'projects.view', 'projects.edit',
      'marketing.view',
    ],
    level: 30,
  },
  {
    id: 'client',
    name: 'client',
    displayName: 'Клиент',
    description: 'Просмотр собственных проектов',
    permissions: [
      'projects.view',
    ],
    level: 10,
  },
];

const RolePermissionsModal: React.FC<RolePermissionsModalProps> = ({ userId, isOpen, onClose, onSave }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('client');
  const [customPermissions, setCustomPermissions] = useState<string[]>([]);
  const [useCustomPermissions, setUseCustomPermissions] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Здесь можно загрузить текущие права пользователя
      // const user = users.find(u => u.id === userId);
      // if (user) {
      //   setSelectedRole(user.role);
      //   setCustomPermissions(user.permissions);
      // }
    }
  }, [userId, isOpen]);

  const getPermissionsByCategory = () => {
    const categories = ['projects', 'users', 'orders', 'marketing', 'settings', 'reports'] as const;
    return categories.reduce((acc, category) => {
      acc[category] = mockPermissions.filter(p => p.category === category);
      return acc;
    }, {} as Record<string, UserPermission[]>);
  };

  const getRolePermissions = (role: UserRole): string[] => {
    const roleData = mockRoles.find(r => r.name === role);
    return roleData?.permissions || [];
  };

  const getCategoryDisplayName = (category: string) => {
    const names = {
      projects: 'Проекты',
      users: 'Пользователи',
      orders: 'Заказы',
      marketing: 'Маркетинг',
      settings: 'Настройки',
      reports: 'Отчеты',
    };
    return names[category as keyof typeof names] || category;
  };

  const handlePermissionToggle = (permissionId: string) => {
    setCustomPermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    if (!useCustomPermissions) {
      setCustomPermissions(getRolePermissions(role));
    }
  };

  const handleSave = () => {
    const finalPermissions = useCustomPermissions ? customPermissions : getRolePermissions(selectedRole);
    onSave(finalPermissions);
  };

  const getActivePermissions = () => {
    if (useCustomPermissions) {
      return customPermissions;
    }
    return getRolePermissions(selectedRole);
  };

  if (!isOpen) return null;

  const permissionsByCategory = getPermissionsByCategory();
  const activePermissions = getActivePermissions();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-dark-2">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-dark dark:text-white">
            Управление правами доступа
          </h2>
          <button
            onClick={onClose}
            className="text-body-color hover:text-dark dark:text-dark-6 dark:hover:text-white"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Выбор роли */}
          <div>
            <h3 className="mb-4 text-lg font-medium text-dark dark:text-white">
              Роль пользователя
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {mockRoles.map((role) => (
                <div
                  key={role.id}
                  className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                    selectedRole === role.name
                      ? 'border-primary bg-primary/5'
                      : 'border-stroke hover:bg-gray/5 dark:border-dark-3 dark:hover:bg-dark-3'
                  }`}
                  onClick={() => handleRoleChange(role.name)}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      checked={selectedRole === role.name}
                      onChange={() => handleRoleChange(role.name)}
                      className="mt-1 h-4 w-4 text-primary"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-dark dark:text-white">
                        {role.displayName}
                      </h4>
                      <p className="mt-1 text-sm text-body-color dark:text-dark-6">
                        {role.description}
                      </p>
                      <div className="mt-2">
                        <span className="text-xs text-body-color dark:text-dark-6">
                          Уровень доступа: {role.level}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Переключатель на кастомные права */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="useCustomPermissions"
              checked={useCustomPermissions}
              onChange={(e) => setUseCustomPermissions(e.target.checked)}
              className="h-4 w-4 rounded border-stroke text-primary focus:ring-primary dark:border-dark-3"
            />
            <label htmlFor="useCustomPermissions" className="ml-2 text-sm text-dark dark:text-white">
              Настроить права доступа индивидуально
            </label>
          </div>

          {/* Права доступа */}
          <div>
            <h3 className="mb-4 text-lg font-medium text-dark dark:text-white">
              Права доступа
              {!useCustomPermissions && (
                <span className="ml-2 text-sm text-body-color dark:text-dark-6">
                  (автоматически по роли)
                </span>
              )}
            </h3>
            
            <div className="space-y-6">
              {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                <div key={category} className="rounded-lg border border-stroke p-4 dark:border-dark-3">
                  <h4 className="mb-3 font-medium text-dark dark:text-white">
                    {getCategoryDisplayName(category)}
                  </h4>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id={permission.id}
                          checked={activePermissions.includes(permission.id) || activePermissions.includes('all')}
                          onChange={() => handlePermissionToggle(permission.id)}
                          disabled={!useCustomPermissions || activePermissions.includes('all')}
                          className="mt-1 h-4 w-4 text-primary focus:ring-primary disabled:opacity-50"
                        />
                        <label htmlFor={permission.id} className="flex-1">
                          <div className="font-medium text-dark dark:text-white">
                            {permission.name}
                          </div>
                          <div className="text-sm text-body-color dark:text-dark-6">
                            {permission.description}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Информация о супер-админе */}
          {selectedRole === 'super_admin' && (
            <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-purple-800 dark:text-purple-200">
                  Супер администратор
                </span>
              </div>
              <p className="mt-2 text-sm text-purple-700 dark:text-purple-300">
                Супер администратор имеет полный доступ ко всем функциям системы и не может быть ограничен в правах доступа.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-stroke px-6 py-2 text-dark transition-colors hover:bg-gray/5 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-primary px-6 py-2 text-white transition-colors hover:bg-primary/90"
          >
            Сохранить права
          </button>
        </div>
      </div>
    </div>
  );
};

export default RolePermissionsModal; 