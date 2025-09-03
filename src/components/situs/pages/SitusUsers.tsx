import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSSEPermissions } from '../../../hooks/useSSEPermissions';
import GlobalRolesManager from '../settings/GlobalRolesManager';
import CreateUserForm from '../forms/CreateUserForm';
import CreateRoleForm from '../forms/CreateRoleForm';

// Импортируем новые компоненты
import UserStats from './users/UserStats';
import UserTabs from './users/UserTabs';
import UserControls from './users/UserControls';
import UserTable from './users/UserTable';
import UserSettingsComponent from './users/UserSettings';
import UserInvites from './users/UserInvites';
import { useUsers } from './users/useUsers';

type TabId = 'users' | 'roles' | 'settings' | 'invites';

interface InviteForm {
  emails: string;
  role: string;
  message: string;
  expiresIn: number;
}

const SitusUsers: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Используем хук для управления пользователями
  const {
    users,
    settings,
    loading,
    setSettings,
    loadUsersAndSettings,
    updateUserRole,
    updateUserStatus,
    bulkUpdateUsers,
    createUser,
  } = useUsers();

  // Локальное состояние
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [showCreateRoleForm, setShowCreateRoleForm] = useState(false);

  // SSE для автоматического применения изменений
  const { isConnected, connectionStatus, sendPermissionChange } = useSSEPermissions();

  // Определяем активную вкладку из URL
  const getActiveTabFromUrl = (): TabId => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab') as TabId;
    return tab || 'users';
  };

  const [activeTab, setActiveTab] = useState<TabId>(getActiveTabFromUrl());

  // Системное уведомление об ошибках SSE
  useEffect(() => {
    if (connectionStatus === 'error') {
      console.error('❌ Ошибка подключения к серверу автосохранения. Изменения могут не сохраняться автоматически.');
    }
  }, [connectionStatus]);

  // Обновляем активную вкладку при изменении URL
  useEffect(() => {
    setActiveTab(getActiveTabFromUrl());
  }, [location.search]);

  // Функция для изменения вкладки с обновлением URL
  const handleTabChange = useCallback(
    (tab: TabId) => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('tab', tab);
      navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    },
    [location.pathname, location.search, navigate],
  );

  // Загружаем данные при монтировании
  useEffect(() => {
    loadUsersAndSettings();
  }, [loadUsersAndSettings]);

  // Обработчики событий от кнопки + в хедере
  useEffect(() => {
    const handleCreateRole = () => {
      handleTabChange('roles');
      setTimeout(() => {
        setShowCreateRoleForm(true);
      }, 100);
    };

    const handleCreateUser = () => {
      handleTabChange('users');
      setTimeout(() => {
        setShowCreateUserForm(true);
      }, 100);
    };

    window.addEventListener('situs:create-role', handleCreateRole);
    window.addEventListener('situs:create-user', handleCreateUser);

    return () => {
      window.removeEventListener('situs:create-role', handleCreateRole);
      window.removeEventListener('situs:create-user', handleCreateUser);
    };
  }, [handleTabChange]);

  // Обработчики для таблицы пользователей
  const handleSelectUser = (userId: string, selected: boolean) => {
    if (selected) {
      setSelectedUsers((prev) => [...prev, userId]);
    } else {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleBulkAction = (action: 'activate' | 'suspend' | 'delete') => {
    bulkUpdateUsers(selectedUsers, action);
    setSelectedUsers([]);
  };

  const handleEditUser = (userId: string) => {
    console.log('Редактирование пользователя:', userId);
    // TODO: Открыть форму редактирования пользователя
    alert(`Редактирование пользователя ${userId} будет реализовано в следующей версии`);
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user && window.confirm(`Вы уверены, что хотите удалить пользователя "${user.name}"?`)) {
      console.log('Удаление пользователя:', userId);
      // TODO: Реализовать удаление пользователя
      alert(`Удаление пользователя ${user.name} будет реализовано в следующей версии`);
    }
  };

  // Обработчик создания роли
  const handleCreateRole = useCallback(async (roleData: any) => {
    try {
      console.log('Создание роли:', roleData);
      setShowCreateRoleForm(false);
    } catch (error) {
      console.error('Ошибка создания роли:', error);
      throw error;
    }
  }, []);

  // Обработчик отправки приглашений
  const handleSendInvitations = useCallback(async (inviteData: InviteForm) => {
    try {
      const emails = inviteData.emails.split('\n').filter((email) => email.trim());
      console.log('Отправка приглашений:', { emails, role: inviteData.role, message: inviteData.message });

      // Компонент UserInvites сам обрабатывает отправку через API
      // Здесь можно добавить дополнительную логику если нужно
      console.log('Приглашения отправлены успешно');
    } catch (error) {
      console.error('Ошибка отправки приглашений:', error);
    }
  }, []);

  // Фильтрация пользователей
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.globalRole === filterRole;
    const matchesStatus = !filterStatus || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Статистика пользователей */}
      <UserStats users={users} />

      {/* Навигация по вкладкам */}
      <UserTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Контент вкладок */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <UserControls
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterRole={filterRole}
            setFilterRole={setFilterRole}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            selectedUsers={selectedUsers}
            onInviteClick={() => setActiveTab('invites')}
            onBulkAction={handleBulkAction}
          />

          <UserTable
            users={filteredUsers}
            selectedUsers={selectedUsers}
            onSelectUser={handleSelectUser}
            onSelectAll={handleSelectAll}
            onUpdateUserRole={updateUserRole}
            onUpdateUserStatus={updateUserStatus}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />
        </div>
      )}

      {activeTab === 'roles' && <GlobalRolesManager />}

      {activeTab === 'settings' && settings && (
        <UserSettingsComponent settings={settings} onUpdateSettings={setSettings} />
      )}

      {activeTab === 'invites' && <UserInvites onSendInvitations={handleSendInvitations} />}

      {/* Формы создания */}
      <CreateUserForm isOpen={showCreateUserForm} onClose={() => setShowCreateUserForm(false)} onSubmit={createUser} />

      <CreateRoleForm
        isOpen={showCreateRoleForm}
        onClose={() => setShowCreateRoleForm(false)}
        onSubmit={handleCreateRole}
      />
    </div>
  );
};

export default SitusUsers;
