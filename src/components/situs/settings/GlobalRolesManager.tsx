import React, { useState, useEffect, useCallback } from 'react';
import { useSSEPermissions } from '../../../hooks/useSSEPermissions';
import RolePermissionsModal from '../components/RolePermissionsModal';
import ProButton from '../../ui/ProButton';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiX,
  FiShield,
  FiUsers,
  FiSettings
} from 'react-icons/fi';

interface GlobalRole {
  id: string;
  name: string;
  displayName: string;
  level: number;
  description: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface NewRoleForm {
  name: string;
  displayName: string;
  description: string;
  level: number;
  permissions: string[];
  basedOnRole?: string;
  isEditingId: boolean;
}

interface GlobalPermission {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  subcategory: string;
  isSystem: boolean;
}

const GlobalRolesManager: React.FC = () => {
  const [roles, setRoles] = useState<GlobalRole[]>([]);
  const [permissions, setPermissions] = useState<GlobalPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedRoleForPermissions, setSelectedRoleForPermissions] = useState<GlobalRole | null>(null);
  const [newRoleForm, setNewRoleForm] = useState<NewRoleForm>({
    name: '',
    displayName: '',
    description: '',
    level: 50,
    permissions: [],
    basedOnRole: undefined,
    isEditingId: false
  });

  // SSE для автоматического применения изменений
  const { isConnected, connectionStatus, sendPermissionChange } = useSSEPermissions();

  // Системное уведомление об ошибках SSE
  useEffect(() => {
    if (connectionStatus === 'error') {
      console.error('❌ Ошибка подключения к серверу автосохранения. Изменения могут не сохраняться автоматически.');
      // Здесь можно добавить toast-уведомление
    }
  }, [connectionStatus]);

  useEffect(() => {
    loadRolesAndPermissions();
  }, []);

  // Обработчик события создания роли от кнопки + в хедере
  useEffect(() => {
    const handleOpenCreateRoleForm = () => {
      setShowCreateForm(true);
    };

    window.addEventListener('situs:open-create-role-form', handleOpenCreateRoleForm);

    return () => {
      window.removeEventListener('situs:open-create-role-form', handleOpenCreateRoleForm);
    };
  }, []);

  // Функция для автоматической генерации ID роли
  const generateRoleId = (displayName: string): string => {
    return displayName
      .toUpperCase()
      .replace(/[^А-ЯA-Z0-9\s]/g, '') // Убираем спецсимволы
      .replace(/\s+/g, '_') // Заменяем пробелы на подчеркивания
      .replace(/[А-Я]/g, (match) => {
        // Транслитерация русских букв
        const translitMap: Record<string, string> = {
          'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'YO',
          'Ж': 'ZH', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
          'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
          'Ф': 'F', 'Х': 'KH', 'Ц': 'TS', 'Ч': 'CH', 'Ш': 'SH', 'Щ': 'SCH',
          'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'YU', 'Я': 'YA'
        };
        return translitMap[match] || match;
      });
  };

  const loadRolesAndPermissions = async () => {
    setLoading(true);
    try {
      // Здесь будут API вызовы
      const mockRoles: GlobalRole[] = [
        {
          id: 'SUPER_ADMIN',
          name: 'SUPER_ADMIN',
          displayName: 'Супер Администратор',
          level: 100,
          description: 'Полный доступ ко всем функциям системы',
          permissions: ['*'],
          isSystem: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date()
        },
        {
          id: 'STAFF',
          name: 'STAFF',
          displayName: 'Сотрудник',
          level: 80,
          description: 'Доступ к административным функциям',
          permissions: ['system.admin', 'users.manage', 'projects.manage', 'content.manage'],
          isSystem: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date()
        },
        {
          id: 'AGENCY',
          name: 'AGENCY',
          displayName: 'Агентство',
          level: 60,
          description: 'Управление клиентами и проектами',
          permissions: ['projects.create', 'projects.manage.own', 'users.invite', 'analytics.view'],
          isSystem: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date()
        },
        {
          id: 'BUSINESS',
          name: 'BUSINESS',
          displayName: 'Бизнес',
          level: 40,
          description: 'Управление собственными проектами',
          permissions: ['projects.create.limited', 'projects.manage.own', 'content.edit.own'],
          isSystem: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date()
        }
      ];

      const mockPermissions: GlobalPermission[] = [
        // Системные права
        { id: 'system.admin', name: 'system.admin', displayName: 'Администрирование системы', description: 'Полный доступ к системным настройкам', category: 'system', subcategory: 'Администрирование', isSystem: true },
        { id: 'system.settings', name: 'system.settings', displayName: 'Настройки системы', description: 'Изменение глобальных настроек', category: 'system', subcategory: 'Администрирование', isSystem: true },
        
        // Права пользователей
        { id: 'users.manage', name: 'users.manage', displayName: 'Управление пользователями', description: 'Создание, редактирование и удаление пользователей', category: 'users', subcategory: 'Управление', isSystem: true },
        { id: 'users.invite', name: 'users.invite', displayName: 'Приглашение пользователей', description: 'Отправка приглашений новым пользователям', category: 'users', subcategory: 'Управление', isSystem: true },
        { id: 'users.view', name: 'users.view', displayName: 'Просмотр пользователей', description: 'Доступ к списку пользователей', category: 'users', subcategory: 'Просмотр', isSystem: true },
        
        // Права проектов
        { id: 'projects.create', name: 'projects.create', displayName: 'Создание проектов', description: 'Создание новых проектов без ограничений', category: 'projects', subcategory: 'Создание', isSystem: true },
        { id: 'projects.create.limited', name: 'projects.create.limited', displayName: 'Ограниченное создание проектов', description: 'Создание проектов с лимитами', category: 'projects', subcategory: 'Создание', isSystem: true },
        { id: 'projects.manage', name: 'projects.manage', displayName: 'Управление всеми проектами', description: 'Редактирование и удаление любых проектов', category: 'projects', subcategory: 'Управление', isSystem: true },
        { id: 'projects.manage.own', name: 'projects.manage.own', displayName: 'Управление собственными проектами', description: 'Редактирование только своих проектов', category: 'projects', subcategory: 'Управление', isSystem: true },
        
        // Права контента
        { id: 'content.manage', name: 'content.manage', displayName: 'Управление всем контентом', description: 'Редактирование любого контента', category: 'content', subcategory: 'Управление', isSystem: true },
        { id: 'content.edit.own', name: 'content.edit.own', displayName: 'Редактирование собственного контента', description: 'Редактирование только своего контента', category: 'content', subcategory: 'Редактирование', isSystem: true },
        
        // Права аналитики
        { id: 'analytics.view', name: 'analytics.view', displayName: 'Просмотр аналитики', description: 'Доступ к статистике и отчетам', category: 'analytics', subcategory: 'Просмотр', isSystem: true },
        { id: 'analytics.export', name: 'analytics.export', displayName: 'Экспорт данных', description: 'Экспорт аналитических данных', category: 'analytics', subcategory: 'Экспорт', isSystem: true }
      ];

      setRoles(mockRoles);
      setPermissions(mockPermissions);
    } catch (error) {
      console.error('Ошибка загрузки ролей и прав:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRole = useCallback(async () => {
    try {
      const newRole: GlobalRole = {
        id: newRoleForm.name.toUpperCase(),
        name: newRoleForm.name.toUpperCase(),
        displayName: newRoleForm.displayName,
        level: newRoleForm.level,
        description: newRoleForm.description,
        permissions: newRoleForm.permissions,
        isSystem: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Здесь будет API вызов
      console.log('Создание новой роли:', newRole);
      
      setRoles(prev => [...prev, newRole]);
      setShowCreateForm(false);
      setNewRoleForm({
        name: '',
        displayName: '',
        description: '',
        level: 50,
        permissions: [],
        basedOnRole: undefined,
        isEditingId: false
      });
    } catch (error) {
      console.error('Ошибка создания роли:', error);
    }
  }, [newRoleForm]);

  const updateRolePermissions = useCallback(async (roleId: string, newPermissions: string[]) => {
    setRoles(prev => prev.map(role => {
      if (role.id !== roleId) return role;
      
      return {
        ...role,
        permissions: newPermissions,
        updatedAt: new Date()
      };
    }));

    // Автосохранение через SSE
    try {
      await sendPermissionChange({
        roleId,
        permissionId: 'bulk_update',
        context: 'admin',
        enabled: true,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Ошибка обновления прав роли:', error);
    }
  }, [sendPermissionChange]);

  const handleEditPermissions = useCallback((role: GlobalRole) => {
    setSelectedRoleForPermissions(role);
    setShowPermissionsModal(true);
  }, []);

  const handleClosePermissionsModal = useCallback(() => {
    setShowPermissionsModal(false);
    setSelectedRoleForPermissions(null);
  }, []);

  const deleteRole = useCallback(async (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isSystem) {
      alert('Нельзя удалить системную роль');
      return;
    }

    if (confirm(`Удалить роль "${role?.displayName}"?`)) {
      try {
        // Здесь будет API вызов
        console.log('Удаление роли:', roleId);
        setRoles(prev => prev.filter(r => r.id !== roleId));
      } catch (error) {
        console.error('Ошибка удаления роли:', error);
      }
    }
  }, [roles]);

  const getPermissionsByCategory = () => {
    const categories: Record<string, GlobalPermission[]> = {};
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
      {/* Информационная панель без заголовка */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400">
            Создавайте и настраивайте роли с различными уровнями доступа
          </p>
        </div>
        
        {/* Индикатор SSE - только при подключении */}
        {connectionStatus === 'connected' && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Автосохранение активно
            </span>
          </div>
        )}
      </div>

      {/* Кнопка создания новой роли */}
      <div className="flex justify-end">
        <ProButton
          variant="primary"
          onClick={() => setShowCreateForm(true)}
        >
          <FiPlus className="w-5 h-5 mr-2" />
          Создать роль
        </ProButton>
      </div>

      {/* Список ролей */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {roles.map(role => (
          <div key={role.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {role.displayName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Уровень: {role.level}
                </p>
                {role.isSystem && (
                  <span className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/40 rounded-full mt-1">
                    Системная
                  </span>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditPermissions(role)}
                  className="p-1 text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
                  title="Настроить права"
                >
                  <FiShield className="w-4 h-4" />
                </button>
                {!role.isSystem && (
                  <button
                    onClick={() => deleteRole(role.id)}
                    className="p-1 text-red-400 hover:text-red-600"
                    title="Удалить роль"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {role.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Прав: {role.permissions.includes('*') ? 'Все' : role.permissions.length}
              </div>
              <button
                onClick={() => handleEditPermissions(role)}
                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Настроить права
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Форма создания новой роли */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Создание новой роли
              </h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Название роли
                </label>
                <input
                  type="text"
                  value={newRoleForm.displayName}
                  onChange={(e) => {
                    const displayName = e.target.value;
                    setNewRoleForm(prev => ({ 
                      ...prev, 
                      displayName,
                      name: prev.isEditingId ? prev.name : generateRoleId(displayName)
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Пользовательская роль"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ID роли
                  <button
                    type="button"
                    onClick={() => setNewRoleForm(prev => ({ ...prev, isEditingId: !prev.isEditingId }))}
                    className="ml-2 text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    {newRoleForm.isEditingId ? 'Авто' : 'Изменить'}
                  </button>
                </label>
                <input
                  type="text"
                  value={newRoleForm.name}
                  onChange={(e) => setNewRoleForm(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!newRoleForm.isEditingId}
                  className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    !newRoleForm.isEditingId ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''
                  }`}
                  placeholder="CUSTOM_ROLE"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {newRoleForm.isEditingId ? 'Редактируйте ID вручную' : 'ID генерируется автоматически на основе названия'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Описание
                </label>
                <textarea
                  value={newRoleForm.description}
                  onChange={(e) => setNewRoleForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Описание роли и её назначения"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Уровень доступа: {newRoleForm.level}
                </label>
                <input
                  type="range"
                  min="1"
                  max="99"
                  value={newRoleForm.level}
                  onChange={(e) => setNewRoleForm(prev => ({ ...prev, level: Number(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Минимальный (1)</span>
                  <span>Максимальный (99)</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Базироваться на роли
                </label>
                <select
                  value={newRoleForm.basedOnRole || ''}
                  onChange={(e) => {
                    const baseRole = roles.find(r => r.id === e.target.value);
                    setNewRoleForm(prev => ({ 
                      ...prev, 
                      basedOnRole: e.target.value || undefined,
                      permissions: baseRole ? [...baseRole.permissions] : []
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Создать с нуля</option>
                  {roles.filter(r => r.isSystem).map(role => (
                    <option key={role.id} value={role.id}>
                      {role.displayName} (уровень {role.level})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <ProButton
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Отмена
              </ProButton>
              <ProButton
                variant="primary"
                onClick={createRole}
                disabled={!newRoleForm.name || !newRoleForm.displayName}
              >
                Создать роль
              </ProButton>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования прав */}
      {console.log('🎭 Rendering modal with:', { showPermissionsModal, selectedRole: selectedRoleForPermissions?.displayName, permissionsCount: permissions.length })}
      <RolePermissionsModal
        isOpen={showPermissionsModal}
        onClose={handleClosePermissionsModal}
        role={selectedRoleForPermissions}
        permissions={permissions}
        onSave={updateRolePermissions}
      />
    </div>
  );
};

export default GlobalRolesManager;
