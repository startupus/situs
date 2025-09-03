import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '../../../../api/client';
import { useUsersSSE } from '../../../../hooks/useUsersSSE';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  globalRole: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED' | 'BANNED';
  lastLogin?: Date;
  createdAt: Date;
  projectsCount: number;
  permissions: string[];
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
}

export interface UserSettings {
  registration: {
    enabled: boolean;
    requireEmailVerification: boolean;
    allowedDomains: string[];
    defaultRole: string;
    autoApprove: boolean;
  };
  authentication: {
    requireTwoFactor: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
  };
  notifications: {
    welcomeEmail: boolean;
    roleChangeNotification: boolean;
    securityAlerts: boolean;
  };
  privacy: {
    showUserList: boolean;
    allowProfileSearch: boolean;
    dataRetentionDays: number;
  };
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // SSE для реального времени обновления пользователей
  useUsersSSE({
    onUserUpdated: (userId, updatedUser, changes) => {
      console.log('📡 SSE: Пользователь обновлен', { userId, updatedUser, changes });
      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, ...updatedUser } : user)));
    },
    onConnected: () => {
      console.log('🔗 SSE соединение пользователей установлено');
    },
    onError: (error) => {
      console.error('❌ Ошибка SSE пользователей:', error);
    },
  });

  const loadUsersAndSettings = useCallback(async () => {
    setLoading(true);
    try {
      // Загружаем пользователей с сервера
      const usersResponse = await apiClient.getUsers();
      if ((usersResponse as any)?.error) {
        console.error('Ошибка загрузки пользователей:', usersResponse.error);
        setUsers([]);
      } else {
        // Преобразуем данные с сервера в формат фронтенда
        const serverUsers = Array.isArray(usersResponse) ? usersResponse : (usersResponse as any).data || [];
        const toFrontendStatus = (s: string | undefined): User['status'] => {
          const v = (s || '').toUpperCase();
          if (v === 'ACTIVE') return 'ACTIVE';
          if (v === 'INACTIVE') return 'INACTIVE';
          if (v === 'PENDING') return 'PENDING';
          if (v === 'SUSPENDED') return 'SUSPENDED';
          if (v === 'BANNED') return 'BANNED';
          return 'ACTIVE';
        };

        const transformedUsers: User[] = serverUsers.map((user: any) => ({
          id: user.id,
          email: user.email,
          name: user.name || user.username || 'Пользователь',
          avatar:
            user.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username || 'U')}&background=3b82f6&color=fff`,
          globalRole: user.globalRole || 'BUSINESS',
          status: toFrontendStatus(user.status),
          lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
          createdAt: new Date(user.createdAt),
          projectsCount: user.projectsCount || 0,
          permissions: user.permissions || [],
          isEmailVerified: user.isEmailVerified || false,
          twoFactorEnabled: user.twoFactorEnabled || false,
        }));
        setUsers(transformedUsers);
      }

      const mockSettings: UserSettings = {
        registration: {
          enabled: true,
          requireEmailVerification: true,
          allowedDomains: [],
          defaultRole: 'BUSINESS',
          autoApprove: false,
        },
        authentication: {
          requireTwoFactor: false,
          sessionTimeout: 24,
          maxLoginAttempts: 5,
          lockoutDuration: 30,
        },
        notifications: {
          welcomeEmail: true,
          roleChangeNotification: true,
          securityAlerts: true,
        },
        privacy: {
          showUserList: true,
          allowProfileSearch: true,
          dataRetentionDays: 365,
        },
      };

      // Настройки пока оставляем как мок данные
      setSettings(mockSettings);
    } catch (error) {
      console.error('Ошибка загрузки пользователей и настроек:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserRole = useCallback(async (userId: string, newRole: string) => {
    try {
      const response = await apiClient.changeUserRole(userId, newRole);
      if (response.error) {
        console.error('Ошибка обновления роли пользователя:', response.error);
        return;
      }

      // Обновляем локальное состояние
      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, globalRole: newRole } : user)));
    } catch (error) {
      console.error('Ошибка обновления роли пользователя:', error);
    }
  }, []);

  const updateUserStatus = useCallback(async (userId: string, newStatus: User['status']) => {
    try {
      // Преобразуем статус фронтенда в формат бэкенда (верхний регистр)
      const backendStatus = newStatus.toUpperCase();
      const response = await apiClient.updateUser(userId, { status: backendStatus });

      if (response.error) {
        console.error('Ошибка обновления статуса пользователя:', response.error);
        return;
      }

      // Обновляем локальное состояние
      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)));
    } catch (error) {
      console.error('Ошибка обновления статуса пользователя:', error);
    }
  }, []);

  const bulkUpdateUsers = useCallback(
    async (userIds: string[], action: 'activate' | 'suspend' | 'delete' | 'changeRole', data?: any) => {
      if (userIds.length === 0) return;

      try {
        let response;

        switch (action) {
          case 'activate':
            response = await apiClient.bulkUpdateUsers(userIds, { status: 'ACTIVE' });
            if (!response.error) {
              setUsers((prev) =>
                prev.map((user) => (userIds.includes(user.id) ? { ...user, status: 'ACTIVE' } : user)),
              );
            }
            break;

          case 'suspend':
            response = await apiClient.bulkUpdateUsers(userIds, { status: 'SUSPENDED' });
            if (!response.error) {
              setUsers((prev) =>
                prev.map((user) => (userIds.includes(user.id) ? { ...user, status: 'SUSPENDED' } : user)),
              );
            }
            break;

          case 'delete':
            if (confirm(`Удалить ${userIds.length} пользователей?`)) {
              response = await apiClient.bulkDeleteUsers(userIds);
              if (!response.error) {
                setUsers((prev) => prev.filter((user) => !userIds.includes(user.id)));
              }
            }
            break;

          case 'changeRole':
            if (data?.role) {
              response = await apiClient.bulkUpdateUsers(userIds, { globalRole: data.role });
              if (!response.error) {
                setUsers((prev) =>
                  prev.map((user) => (userIds.includes(user.id) ? { ...user, globalRole: data.role } : user)),
                );
              }
            }
            break;
        }

        if (response?.error) {
          console.error('Ошибка массовой операции:', response.error);
        }
      } catch (error) {
        console.error('Ошибка массовой операции:', error);
      }
    },
    [],
  );

  const createUser = useCallback(async (userData: any) => {
    try {
      const response = await apiClient.createUser({
        email: userData.email,
        password: userData.password || 'TempPassword123!',
        name: userData.name,
        globalRole: userData.role,
        isActive: userData.isActive,
      });

      if (response.error) {
        console.error('Ошибка создания пользователя:', response.error);
        throw new Error(response.error.message);
      }

      // Добавляем нового пользователя в локальное состояние
      if (response.data) {
        const newUser: User = {
          id: response.data.id,
          email: response.data.email,
          name: response.data.name || response.data.username || 'Пользователь',
          avatar:
            response.data.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(response.data.name || 'U')}&background=3b82f6&color=fff`,
          globalRole: response.data.globalRole || 'BUSINESS',
          status: response.data.status || 'active',
          lastLogin: response.data.lastLogin ? new Date(response.data.lastLogin) : undefined,
          createdAt: new Date(response.data.createdAt),
          projectsCount: response.data.projectsCount || 0,
          permissions: response.data.permissions || [],
          isEmailVerified: response.data.isEmailVerified || false,
          twoFactorEnabled: response.data.twoFactorEnabled || false,
        };

        setUsers((prev) => [newUser, ...prev]);
      }
    } catch (error) {
      console.error('Ошибка создания пользователя:', error);
      throw error;
    }
  }, []);

  // Автоматическая загрузка данных при монтировании
  useEffect(() => {
    loadUsersAndSettings();
  }, [loadUsersAndSettings]);

  return {
    users,
    settings,
    loading,
    setSettings,
    loadUsersAndSettings,
    updateUserRole,
    updateUserStatus,
    bulkUpdateUsers,
    createUser,
  };
};
