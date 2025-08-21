import React, { useState, useEffect, useCallback } from 'react';
import { useSSEPermissions } from '../../../hooks/useSSEPermissions';

interface Permission {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: 'admin' | 'site' | 'both';
  subcategory: string;
  isSystem: boolean;
}

interface RolePermissions {
  roleId: string;
  roleName: string;
  roleLevel: number;
  adminPermissions: string[];
  sitePermissions: string[];
  inheritsFrom?: string;
}

interface ProjectRolePermissionsProps {
  projectId?: string;
  onSave: (rolePermissions: RolePermissions[]) => void;
}

const ProjectRolePermissions: React.FC<ProjectRolePermissionsProps> = ({
  projectId,
  onSave
}) => {
  const [rolePermissions, setRolePermissions] = useState<RolePermissions[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRole] = useState<string>('OWNER');
  const [activeContext, setActiveContext] = useState<'admin' | 'site'>('admin');
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // SSE хук для автоматического применения изменений
  const { isConnected, lastUpdate, connectionStatus, sendPermissionChange } = useSSEPermissions(projectId);

  // Роли в проектах с их уровнями
  const projectRoles = [
    { id: 'OWNER', name: 'Владелец', level: 100, color: 'red' },
    { id: 'ADMIN', name: 'Администратор', level: 70, color: 'orange' },
    { id: 'EDITOR', name: 'Редактор', level: 30, color: 'blue' },
    { id: 'VIEWER', name: 'Наблюдатель', level: 10, color: 'green' }
  ];

  useEffect(() => {
    loadPermissions();
  }, [projectId]);

  const loadPermissions = async () => {
    setLoading(true);
    try {
      // Здесь будут API вызовы
      const mockPermissions: Permission[] = [
        // Административные права
        { id: 'project.view', name: 'project.view', displayName: 'Просмотр проекта', description: 'Доступ к административной панели проекта', category: 'admin', subcategory: 'Основные', isSystem: true },
        { id: 'project.edit', name: 'project.edit', displayName: 'Редактирование проекта', description: 'Изменение настроек и конфигурации проекта', category: 'admin', subcategory: 'Основные', isSystem: true },
        { id: 'project.delete', name: 'project.delete', displayName: 'Удаление проекта', description: 'Полное удаление проекта', category: 'admin', subcategory: 'Основные', isSystem: true },
        { id: 'project.publish', name: 'project.publish', displayName: 'Публикация проекта', description: 'Публикация и снятие с публикации', category: 'admin', subcategory: 'Основные', isSystem: true },
        
        { id: 'content.create', name: 'content.create', displayName: 'Создание контента', description: 'Создание новых страниц и контента', category: 'admin', subcategory: 'Контент', isSystem: true },
        { id: 'content.edit', name: 'content.edit', displayName: 'Редактирование контента', description: 'Изменение существующего контента', category: 'admin', subcategory: 'Контент', isSystem: true },
        { id: 'content.delete', name: 'content.delete', displayName: 'Удаление контента', description: 'Удаление страниц и контента', category: 'admin', subcategory: 'Контент', isSystem: true },
        { id: 'content.publish', name: 'content.publish', displayName: 'Публикация контента', description: 'Публикация и снятие с публикации контента', category: 'admin', subcategory: 'Контент', isSystem: true },
        
        { id: 'media.upload', name: 'media.upload', displayName: 'Загрузка медиа', description: 'Загрузка изображений и файлов', category: 'admin', subcategory: 'Медиа', isSystem: true },
        { id: 'media.manage', name: 'media.manage', displayName: 'Управление медиа', description: 'Организация и удаление медиафайлов', category: 'admin', subcategory: 'Медиа', isSystem: true },
        
        { id: 'users.invite', name: 'users.invite', displayName: 'Приглашение пользователей', description: 'Приглашение новых пользователей в проект', category: 'admin', subcategory: 'Пользователи', isSystem: true },
        { id: 'users.manage', name: 'users.manage', displayName: 'Управление пользователями', description: 'Изменение ролей и удаление пользователей', category: 'admin', subcategory: 'Пользователи', isSystem: true },
        
        { id: 'analytics.view', name: 'analytics.view', displayName: 'Просмотр аналитики', description: 'Доступ к статистике и отчетам', category: 'admin', subcategory: 'Аналитика', isSystem: true },
        { id: 'analytics.export', name: 'analytics.export', displayName: 'Экспорт данных', description: 'Экспорт аналитических данных', category: 'admin', subcategory: 'Аналитика', isSystem: true },
        
        // Права на сайте
        { id: 'site.view', name: 'site.view', displayName: 'Просмотр сайта', description: 'Доступ к просмотру опубликованного сайта', category: 'site', subcategory: 'Основные', isSystem: true },
        { id: 'site.comment', name: 'site.comment', displayName: 'Комментирование', description: 'Возможность оставлять комментарии', category: 'site', subcategory: 'Интерактив', isSystem: true },
        { id: 'site.rate', name: 'site.rate', displayName: 'Оценка контента', description: 'Возможность ставить оценки и лайки', category: 'site', subcategory: 'Интерактив', isSystem: true },
        { id: 'site.download', name: 'site.download', displayName: 'Скачивание файлов', description: 'Доступ к скачиванию файлов и ресурсов', category: 'site', subcategory: 'Файлы', isSystem: true },
        { id: 'site.contact', name: 'site.contact', displayName: 'Обратная связь', description: 'Использование форм обратной связи', category: 'site', subcategory: 'Интерактив', isSystem: true },
        
        // Универсальные права
        { id: 'notifications.receive', name: 'notifications.receive', displayName: 'Получение уведомлений', description: 'Получение уведомлений о изменениях', category: 'both', subcategory: 'Уведомления', isSystem: true }
      ];

      const mockRolePermissions: RolePermissions[] = [
        {
          roleId: 'OWNER',
          roleName: 'Владелец',
          roleLevel: 100,
          adminPermissions: mockPermissions.filter(p => p.category === 'admin' || p.category === 'both').map(p => p.id),
          sitePermissions: mockPermissions.filter(p => p.category === 'site' || p.category === 'both').map(p => p.id)
        },
        {
          roleId: 'ADMIN',
          roleName: 'Администратор',
          roleLevel: 70,
          adminPermissions: ['project.view', 'project.edit', 'content.create', 'content.edit', 'content.publish', 'media.upload', 'media.manage', 'users.invite', 'analytics.view', 'notifications.receive'],
          sitePermissions: ['site.view', 'site.comment', 'site.rate', 'site.download', 'site.contact', 'notifications.receive'],
          inheritsFrom: 'EDITOR'
        },
        {
          roleId: 'EDITOR',
          roleName: 'Редактор',
          roleLevel: 30,
          adminPermissions: ['project.view', 'content.create', 'content.edit', 'media.upload', 'analytics.view', 'notifications.receive'],
          sitePermissions: ['site.view', 'site.comment', 'site.rate', 'site.download', 'notifications.receive'],
          inheritsFrom: 'VIEWER'
        },
        {
          roleId: 'VIEWER',
          roleName: 'Наблюдатель',
          roleLevel: 10,
          adminPermissions: ['project.view', 'analytics.view', 'notifications.receive'],
          sitePermissions: ['site.view', 'notifications.receive']
        }
      ];

      setAvailablePermissions(mockPermissions);
      setRolePermissions(mockRolePermissions);
    } catch (error) {
      console.error('Ошибка загрузки прав:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRolePermission = useCallback(async (roleId: string, permissionId: string, context: 'admin' | 'site', enabled: boolean) => {
    // Обновляем локальное состояние
    setRolePermissions(prev => prev.map(role => {
      if (role.roleId !== roleId) return role;
      
      const permissionsKey = context === 'admin' ? 'adminPermissions' : 'sitePermissions';
      const currentPermissions = role[permissionsKey];
      
      if (enabled) {
        return {
          ...role,
          [permissionsKey]: [...currentPermissions, permissionId]
        };
      } else {
        return {
          ...role,
          [permissionsKey]: currentPermissions.filter(p => p !== permissionId)
        };
      }
    }));

    // Автоматически отправляем изменение через SSE
    try {
      setAutoSaveStatus('saving');
      await sendPermissionChange({
        roleId,
        permissionId,
        context,
        enabled,
        timestamp: Date.now()
      });
      setAutoSaveStatus('saved');
      
      // Сбрасываем статус через 2 секунды
      setTimeout(() => setAutoSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Ошибка автосохранения:', error);
      setAutoSaveStatus('error');
      
      // Сбрасываем статус через 3 секунды
      setTimeout(() => setAutoSaveStatus('idle'), 3000);
    }
  }, [sendPermissionChange]);

  const getPermissionsByCategory = (context: 'admin' | 'site') => {
    const contextPermissions = availablePermissions.filter(p => 
      p.category === context || p.category === 'both'
    );
    
    const categories: Record<string, Permission[]> = {};
    contextPermissions.forEach(permission => {
      if (!categories[permission.subcategory]) {
        categories[permission.subcategory] = [];
      }
      categories[permission.subcategory].push(permission);
    });
    
    return categories;
  };

  const getCurrentRolePermissions = () => {
    return rolePermissions.find(r => r.roleId === activeRole);
  };

  const hasPermission = (permissionId: string, context: 'admin' | 'site') => {
    const role = getCurrentRolePermissions();
    if (!role) return false;
    
    const permissions = context === 'admin' ? role.adminPermissions : role.sitePermissions;
    return permissions.includes(permissionId);
  };

  const getInheritedPermissions = (roleId: string, context: 'admin' | 'site'): string[] => {
    const role = rolePermissions.find(r => r.roleId === roleId);
    if (!role || !role.inheritsFrom) return [];
    
    const parentRole = rolePermissions.find(r => r.roleId === role.inheritsFrom);
    if (!parentRole) return [];
    
    const parentPermissions = context === 'admin' ? parentRole.adminPermissions : parentRole.sitePermissions;
    const inheritedFromParent = getInheritedPermissions(role.inheritsFrom, context);
    
    return [...new Set([...parentPermissions, ...inheritedFromParent])];
  };

  const isPermissionInherited = (permissionId: string, context: 'admin' | 'site') => {
    const inherited = getInheritedPermissions(activeRole, context);
    return inherited.includes(permissionId);
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Настройка прав ролей в проекте
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Определите, какие действия может выполнять каждая роль в административной панели и на сайте
            </p>
          </div>
          
          {/* Индикатор статуса SSE и автосохранения */}
          <div className="flex items-center space-x-4">
            {/* Статус подключения */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' :
                connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                connectionStatus === 'error' ? 'bg-red-500' : 'bg-gray-400'
              }`}></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {connectionStatus === 'connected' ? 'Подключено' :
                 connectionStatus === 'connecting' ? 'Подключение...' :
                 connectionStatus === 'error' ? 'Ошибка подключения' : 'Отключено'}
              </span>
            </div>
            
            {/* Статус автосохранения */}
            {autoSaveStatus !== 'idle' && (
              <div className="flex items-center space-x-2">
                {autoSaveStatus === 'saving' && (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-blue-600">Сохранение...</span>
                  </>
                )}
                {autoSaveStatus === 'saved' && (
                  <>
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-green-600">Сохранено</span>
                  </>
                )}
                {autoSaveStatus === 'error' && (
                  <>
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-red-600">Ошибка сохранения</span>
                  </>
                )}
              </div>
            )}
            
            {/* Время последнего обновления */}
            {lastUpdate && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Обновлено: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Выбор роли */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Выберите роль для настройки
        </h3>
        <div className="flex flex-wrap gap-3">
          {projectRoles.map(role => {
            const roleData = getCurrentRolePermissions();
            const isActive = activeRole === role.id;
            
            return (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`px-4 py-3 rounded-lg border transition-colors ${
                  isActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="text-left">
                  <div className="font-medium">{role.name}</div>
                  <div className="text-sm opacity-75">Уровень: {role.level}</div>
                  {roleData?.inheritsFrom && (
                    <div className="text-xs opacity-60">
                      Наследует от: {projectRoles.find(r => r.id === roleData.inheritsFrom)?.name}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Переключатель контекста */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Контекст прав:
          </h3>
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveContext('admin')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeContext === 'admin'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Административная панель
            </button>
            <button
              onClick={() => setActiveContext('site')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeContext === 'site'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Фронт сайта
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {activeContext === 'admin' 
            ? 'Права для работы в административной панели проекта'
            : 'Права для взаимодействия с опубликованным сайтом'
          }
        </p>
      </div>

      {/* Настройка прав */}
      <div className="space-y-6">
        {Object.entries(getPermissionsByCategory(activeContext)).map(([category, permissions]) => (
          <div key={category} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {category}
            </h4>
            <div className="space-y-4">
              {permissions.map(permission => {
                const hasCurrentPermission = hasPermission(permission.id, activeContext);
                const isInherited = isPermissionInherited(permission.id, activeContext);
                
                return (
                  <div
                    key={permission.id}
                    className={`flex items-start justify-between p-4 border rounded-lg ${
                      isInherited 
                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {permission.displayName}
                        </h5>
                        {isInherited && (
                          <span className="px-2 py-1 text-xs font-medium text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/40 rounded-full">
                            Наследуется
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {permission.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        ID: {permission.name}
                      </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center ml-4">
                      <input
                        type="checkbox"
                        checked={hasCurrentPermission || isInherited}
                        disabled={isInherited}
                        onChange={(e) => updateRolePermission(activeRole, permission.id, activeContext, e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className={`peer h-6 w-11 rounded-full after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white ${
                        isInherited
                          ? 'bg-green-400 cursor-not-allowed'
                          : 'bg-gray-200 peer-checked:bg-blue-600 dark:border-gray-600 dark:bg-gray-700'
                      }`}></div>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Кнопки действий */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => loadPermissions()}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Сбросить
        </button>
        <button
          onClick={() => onSave(rolePermissions)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Сохранить настройки
        </button>
      </div>
    </div>
  );
};

export default ProjectRolePermissions;
