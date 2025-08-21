import React, { useState, useEffect } from 'react';
import { FiCheck, FiShield, FiLock, FiUnlock } from 'react-icons/fi';
import ProModal from '../../ui/ProModal';
import ProButton from '../../ui/ProButton';

interface Permission {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  subcategory: string;
  isSystem: boolean;
}

interface Role {
  id: string;
  name: string;
  displayName: string;
  level: number;
  description: string;
  permissions: string[];
  isSystem: boolean;
}

interface RolePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  permissions: Permission[];
  onSave: (roleId: string, permissions: string[]) => void;
}

const RolePermissionsModal: React.FC<RolePermissionsModalProps> = ({
  isOpen,
  onClose,
  role,
  permissions,
  onSave
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (role) {
      setSelectedPermissions([...role.permissions]);
    }
  }, [role]);

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

  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || permission.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePermissionToggle = (permissionId: string) => {
    if (role?.permissions.includes('*')) {
      return; // Нельзя изменять права для роли с полными правами
    }

    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSave = () => {
    if (role) {
      onSave(role.id, selectedPermissions);
      onClose();
    }
  };

  const handleSelectAll = () => {
    if (role?.permissions.includes('*')) return;
    
    const categoryPermissions = selectedCategory === 'all' 
      ? filteredPermissions.map(p => p.id)
      : filteredPermissions.filter(p => p.category === selectedCategory).map(p => p.id);
    
    const allSelected = categoryPermissions.every(id => selectedPermissions.includes(id));
    
    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(id => !categoryPermissions.includes(id)));
    } else {
      setSelectedPermissions(prev => [...new Set([...prev, ...categoryPermissions])]);
    }
  };

  const categories = Object.keys(getPermissionsByCategory());
  const hasFullAccess = role?.permissions.includes('*');

  if (!isOpen || !role) return null;

  return (
    <ProModal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      className="max-h-[90vh] overflow-hidden"
    >
      {/* Заголовок с иконкой */}
      <div className="flex items-center space-x-3 mb-6">
        <FiShield className="w-6 h-6 text-blue-600" />
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Настройка прав доступа
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {role.displayName} (уровень {role.level})
          </p>
        </div>
      </div>

        {/* Предупреждение для системных ролей */}
        {hasFullAccess && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center space-x-2">
              <FiLock className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Эта роль имеет полный доступ ко всем функциям системы. Права нельзя изменить.
              </p>
            </div>
          </div>
        )}

        {/* Панель управления */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Поиск */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Поиск прав доступа..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={hasFullAccess}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50"
              />
            </div>
            
            {/* Фильтр по категориям */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={hasFullAccess}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50"
            >
              <option value="all">Все категории</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            
            {/* Кнопка "Выбрать все" */}
            {!hasFullAccess && (
              <button
                onClick={handleSelectAll}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Выбрать все
              </button>
            )}
          </div>
        </div>

        {/* Список прав */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {hasFullAccess ? (
            <div className="text-center py-8">
              <FiUnlock className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Полный доступ
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Эта роль имеет доступ ко всем функциям системы
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(getPermissionsByCategory()).map(([category, categoryPermissions]) => {
                const filteredCategoryPermissions = categoryPermissions.filter(permission =>
                  filteredPermissions.includes(permission)
                );

                if (filteredCategoryPermissions.length === 0) return null;

                const selectedInCategory = filteredCategoryPermissions.filter(p => 
                  selectedPermissions.includes(p.id)
                ).length;

                return (
                  <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                        {category}
                      </h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedInCategory} из {filteredCategoryPermissions.length}
                      </span>
                    </div>
                    
                    <div className="grid gap-3 md:grid-cols-2">
                      {filteredCategoryPermissions.map(permission => (
                        <label
                          key={permission.id}
                          className="flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(permission.id)}
                            onChange={() => handlePermissionToggle(permission.id)}
                            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {permission.displayName}
                              </span>
                              {permission.isSystem && (
                                <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 rounded-full">
                                  Системное
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {permission.description}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {permission.name}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      {/* Подвал */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 -mx-8 -mb-6 px-8 py-6">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Выбрано прав: {selectedPermissions.length} из {permissions.length}
        </div>
        
        <div className="flex space-x-4">
          <ProButton
            variant="outline"
            onClick={onClose}
          >
            Отмена
          </ProButton>
          {!hasFullAccess && (
            <ProButton
              variant="primary"
              onClick={handleSave}
            >
              <FiCheck className="w-4 h-4 mr-2" />
              Сохранить
            </ProButton>
          )}
        </div>
      </div>
    </ProModal>
  );
};

export default RolePermissionsModal;