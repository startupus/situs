import React, { useState, useEffect } from 'react';
import { FiCheck, FiShield, FiLock, FiX } from 'react-icons/fi';
import ThemeButton from './ThemeButton';
import { ThemeInput, ThemeSelect } from './ThemeForm';

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

interface ThemePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  permissions: Permission[];
  onSave: (roleId: string, permissions: string[]) => void;
}

const ThemePermissionsModal: React.FC<ThemePermissionsModalProps> = ({
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
    const grouped: { [key: string]: Permission[] } = {};
    permissions.forEach(permission => {
      if (!grouped[permission.category]) {
        grouped[permission.category] = [];
      }
      grouped[permission.category].push(permission);
    });
    return grouped;
  };

  const filterPermissions = () => {
    const grouped = getPermissionsByCategory();
    const filtered: { [key: string]: Permission[] } = {};

    Object.entries(grouped).forEach(([category, perms]) => {
      if (selectedCategory !== 'all' && category !== selectedCategory) {
        return;
      }

      const filteredPerms = perms.filter(permission =>
        permission.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (filteredPerms.length > 0) {
        filtered[category] = filteredPerms;
      }
    });

    return filtered;
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };

  const toggleCategoryPermissions = (category: string) => {
    const categoryPermissions = getPermissionsByCategory()[category];
    const categoryPermissionIds = categoryPermissions.map(p => p.id);
    const allSelected = categoryPermissionIds.every(id => selectedPermissions.includes(id));

    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(id => !categoryPermissionIds.includes(id)));
    } else {
      setSelectedPermissions(prev => {
        const newSelected = [...prev];
        categoryPermissionIds.forEach(id => {
          if (!newSelected.includes(id)) {
            newSelected.push(id);
          }
        });
        return newSelected;
      });
    }
  };

  const handleSave = () => {
    if (role) {
      onSave(role.id, selectedPermissions);
    }
  };

  const categories = Object.keys(getPermissionsByCategory());
  const hasFullAccess = role?.permissions.includes('*');

  if (!isOpen || !role) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Заголовок с кнопкой закрытия */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
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
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <FiX className="w-6 h-6" />
          </button>
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
              <ThemeInput
                type="text"
                placeholder="Поиск прав доступа..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={hasFullAccess}
                className="mb-0"
              />
            </div>
            {/* Фильтр по категории */}
            <div className="flex-1">
              <ThemeSelect
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={[
                  { value: 'all', label: 'Все категории' },
                  ...categories.map(category => ({ value: category, label: category }))
                ]}
                disabled={hasFullAccess}
                className="mb-0"
              />
            </div>
          </div>
        </div>

        {/* Список прав */}
        <div className="p-6 max-h-[calc(90vh-250px)] overflow-y-auto">
          {Object.entries(filterPermissions()).length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Нет прав, соответствующих вашему поиску или фильтру.
            </p>
          )}
          {Object.entries(filterPermissions()).map(([category, perms]) => (
            <div key={category} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {category}
                </h4>
                {!hasFullAccess && (
                  <button
                    onClick={() => toggleCategoryPermissions(category)}
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {selectedPermissions.filter(p => perms.some(ap => ap.id === p)).length === perms.length
                      ? 'Снять все'
                      : 'Выбрать все'}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {perms.map(permission => (
                  <div
                    key={permission.id}
                    className={`flex items-center justify-between p-3 rounded-md border ${
                      selectedPermissions.includes(permission.id)
                        ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                    }`}
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {permission.displayName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {permission.description}
                      </p>
                    </div>
                    {!hasFullAccess && (
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(permission.id)}
                        onChange={() => togglePermission(permission.id)}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Футер модального окна */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Выбрано прав: {selectedPermissions.length} из {permissions.length}
          </div>
          
          <div className="flex space-x-4">
            <ThemeButton
              variant="secondary"
              onClick={onClose}
            >
              Отмена
            </ThemeButton>
            {!hasFullAccess && (
              <ThemeButton
                variant="primary"
                onClick={handleSave}
              >
                <FiCheck className="w-4 h-4 mr-2" />
                Сохранить
              </ThemeButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemePermissionsModal;
