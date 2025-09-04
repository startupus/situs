import React, { useState, useEffect } from 'react';
import { User } from '../../../types/users';

interface UserRole {
  id: string;
  type: 'global' | 'project' | 'account';
  role: string;
  contextId?: string;
  contextName?: string;
  grantedBy?: string;
  grantedAt?: string;
}

interface UserRolesManagerProps {
  user: User;
  currentUser: User; // Текущий пользователь (кто назначает роли)
  isOpen: boolean;
  onClose: () => void;
  onSave: (roles: UserRole[]) => void;
}

const UserRolesManager: React.FC<UserRolesManagerProps> = ({ user, currentUser, isOpen, onClose, onSave }) => {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'global' | 'projects' | 'accounts'>('global');

  // Функция для получения уровня роли
  const getRoleLevel = (role: string): number => {
    const levels: Record<string, number> = {
      BUSINESS: 40,
      AGENCY: 60,
      STAFF: 80,
      SUPER_ADMIN: 100,
    };
    return levels[role] || 0;
  };

  // Проверка, может ли текущий пользователь назначить роль
  const canAssignRole = (targetRole: string): boolean => {
    // SUPER_ADMIN может назначать любые роли
    if (currentUser.globalRole === 'SUPER_ADMIN') {
      return true;
    }

    // Нельзя изменять роль самому себе
    if (currentUser.id === user.id) {
      return false;
    }

    // Нельзя назначить роль выше или равную своей
    const currentUserLevel = getRoleLevel(currentUser.globalRole || 'BUSINESS');
    const targetRoleLevel = getRoleLevel(targetRole);

    return targetRoleLevel < currentUserLevel;
  };

  // Глобальные роли с проверкой прав
  const globalRoles = [
    {
      value: 'SUPER_ADMIN',
      label: 'Супер администратор',
      description: 'Полный доступ ко всем функциям системы',
      level: 100,
    },
    { value: 'STAFF', label: 'Персонал', description: 'Системные администраторы и поддержка', level: 80 },
    {
      value: 'AGENCY',
      label: 'Агентство',
      description: 'Управление собственными проектами и проектами клиентов',
      level: 60,
    },
    { value: 'BUSINESS', label: 'Бизнес-пользователь', description: 'Управление собственными проектами', level: 40 },
  ].filter((role) => canAssignRole(role.value));

  // Роли в проектах
  const projectRoles = [
    { value: 'OWNER', label: 'Владелец', description: 'Полные права на проект' },
    { value: 'ADMIN', label: 'Администратор', description: 'Управление проектом и пользователями' },
    { value: 'EDITOR', label: 'Редактор', description: 'Создание и редактирование контента' },
    { value: 'VIEWER', label: 'Наблюдатель', description: 'Только просмотр проекта' },
  ];

  // Роли в аккаунтах
  const accountRoles = [
    { value: 'OWNER', label: 'Владелец', description: 'Полные права на аккаунт' },
    { value: 'ADMIN', label: 'Администратор', description: 'Управление аккаунтом и участниками' },
    { value: 'MEMBER', label: 'Участник', description: 'Базовые права участника' },
  ];

  useEffect(() => {
    if (isOpen && user) {
      loadUserRoles();
    }
  }, [isOpen, user]);

  const loadUserRoles = async () => {
    setLoading(true);
    try {
      // Здесь будет API вызов для получения всех ролей пользователя
      const userRoles: UserRole[] = [
        {
          id: '1',
          type: 'global',
          role: user.globalRole || 'BUSINESS',
        },
        // Добавятся роли в проектах и аккаунтах
      ];
      setRoles(userRoles);
    } catch (error) {
      console.error('Ошибка загрузки ролей:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateGlobalRole = (newRole: string) => {
    setRoles((prev) => prev.map((role) => (role.type === 'global' ? { ...role, role: newRole } : role)));
  };

  const addProjectRole = (projectId: string, projectName: string, role: string) => {
    const newRole: UserRole = {
      id: `project-${projectId}-${Date.now()}`,
      type: 'project',
      role,
      contextId: projectId,
      contextName: projectName,
      grantedAt: new Date().toISOString(),
    };
    setRoles((prev) => [...prev, newRole]);
  };

  const addAccountRole = (accountId: string, accountName: string, role: string) => {
    const newRole: UserRole = {
      id: `account-${accountId}-${Date.now()}`,
      type: 'account',
      role,
      contextId: accountId,
      contextName: accountName,
      grantedAt: new Date().toISOString(),
    };
    setRoles((prev) => [...prev, newRole]);
  };

  const removeRole = (roleId: string) => {
    setRoles((prev) => prev.filter((role) => role.id !== roleId));
  };

  const handleSave = () => {
    onSave(roles);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Заголовок */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Управление ролями пользователя</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {(user as any).name} ({user.email})
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Табы */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('global')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'global'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Глобальная роль
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'projects'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Роли в проектах
            </button>
            <button
              onClick={() => setActiveTab('accounts')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'accounts'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Роли в аккаунтах
            </button>
          </div>
        </div>

        {/* Контент */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Глобальная роль */}
              {activeTab === 'global' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Глобальная роль пользователя</h3>
                    {currentUser.id === user.id && (
                      <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            Вы не можете изменить собственную роль
                          </p>
                        </div>
                      </div>
                    )}
                    {currentUser.globalRole !== 'SUPER_ADMIN' && currentUser.id !== user.id && (
                      <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            Вы можете назначать только роли ниже своей ({currentUser.globalRole})
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="grid gap-4">
                    {globalRoles.map((roleOption) => {
                      const currentGlobalRole = roles.find((r) => r.type === 'global')?.role;
                      const isSelected = currentGlobalRole === roleOption.value;

                      return (
                        <div
                          key={roleOption.value}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                          onClick={() => updateGlobalRole(roleOption.value)}
                        >
                          <div className="flex items-start space-x-3">
                            <input
                              type="radio"
                              checked={isSelected}
                              onChange={() => updateGlobalRole(roleOption.value)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">{roleOption.label}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{roleOption.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Роли в проектах */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Роли в проектах</h3>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Добавить роль
                    </button>
                  </div>

                  <div className="space-y-3">
                    {roles
                      .filter((r) => r.type === 'project')
                      .map((role) => (
                        <div
                          key={role.id}
                          className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{role.contextName}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Роль: {projectRoles.find((r) => r.value === role.role)?.label || role.role}
                            </p>
                            {role.grantedAt && (
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                Назначена: {new Date(role.grantedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeRole(role.id)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}

                    {roles.filter((r) => r.type === 'project').length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        Пользователь не имеет ролей в проектах
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Роли в аккаунтах */}
              {activeTab === 'accounts' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Роли в аккаунтах</h3>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Добавить роль
                    </button>
                  </div>

                  <div className="space-y-3">
                    {roles
                      .filter((r) => r.type === 'account')
                      .map((role) => (
                        <div
                          key={role.id}
                          className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{role.contextName}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Роль: {accountRoles.find((r) => r.value === role.role)?.label || role.role}
                            </p>
                            {role.grantedAt && (
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                Назначена: {new Date(role.grantedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeRole(role.id)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}

                    {roles.filter((r) => r.type === 'account').length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        Пользователь не имеет ролей в аккаунтах
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Футер */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Сохранить изменения
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserRolesManager;
