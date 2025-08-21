import { useState, useCallback } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  globalRole: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
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

  const loadUsersAndSettings = useCallback(async () => {
    setLoading(true);
    try {
      // Здесь будут API вызовы
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'admin@example.com',
          name: 'Администратор Системы',
          avatar: 'https://ui-avatars.com/api/?name=AS&background=3b82f6&color=fff',
          globalRole: 'SUPER_ADMIN',
          status: 'active',
          lastLogin: new Date(Date.now() - 1000 * 60 * 30), // 30 минут назад
          createdAt: new Date('2024-01-01'),
          projectsCount: 15,
          permissions: ['*'],
          isEmailVerified: true,
          twoFactorEnabled: true
        },
        {
          id: '2',
          email: 'manager@agency.com',
          name: 'Менеджер Агентства',
          avatar: 'https://ui-avatars.com/api/?name=MA&background=10b981&color=fff',
          globalRole: 'AGENCY',
          status: 'active',
          lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 часа назад
          createdAt: new Date('2024-02-15'),
          projectsCount: 8,
          permissions: ['projects.create', 'projects.manage.own', 'users.invite'],
          isEmailVerified: true,
          twoFactorEnabled: false
        },
        {
          id: '3',
          email: 'client@business.com',
          name: 'Клиент Бизнес',
          globalRole: 'BUSINESS',
          status: 'pending',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // вчера
          projectsCount: 0,
          permissions: ['projects.create.limited'],
          isEmailVerified: false,
          twoFactorEnabled: false
        },
        {
          id: '4',
          email: 'staff@company.com',
          name: 'Сотрудник Компании',
          avatar: 'https://ui-avatars.com/api/?name=SK&background=f59e0b&color=fff',
          globalRole: 'STAFF',
          status: 'active',
          lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 дня назад
          createdAt: new Date('2024-01-20'),
          projectsCount: 25,
          permissions: ['system.admin', 'users.manage', 'projects.manage'],
          isEmailVerified: true,
          twoFactorEnabled: true
        },
        {
          id: '5',
          email: 'blocked@example.com',
          name: 'Заблокированный Пользователь',
          globalRole: 'BUSINESS',
          status: 'suspended',
          lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // месяц назад
          createdAt: new Date('2024-03-01'),
          projectsCount: 2,
          permissions: [],
          isEmailVerified: true,
          twoFactorEnabled: false
        }
      ];

      const mockSettings: UserSettings = {
        registration: {
          enabled: true,
          requireEmailVerification: true,
          allowedDomains: [],
          defaultRole: 'BUSINESS',
          autoApprove: false
        },
        authentication: {
          requireTwoFactor: false,
          sessionTimeout: 24,
          maxLoginAttempts: 5,
          lockoutDuration: 30
        },
        notifications: {
          welcomeEmail: true,
          roleChangeNotification: true,
          securityAlerts: true
        },
        privacy: {
          showUserList: true,
          allowProfileSearch: true,
          dataRetentionDays: 365
        }
      };

      setUsers(mockUsers);
      setSettings(mockSettings);
    } catch (error) {
      console.error('Ошибка загрузки пользователей и настроек:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserRole = useCallback(async (userId: string, newRole: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, globalRole: newRole } : user
    ));

    try {
      // API вызов для обновления роли
      console.log('Обновление роли пользователя:', { userId, newRole });
    } catch (error) {
      console.error('Ошибка обновления роли пользователя:', error);
    }
  }, []);

  const updateUserStatus = useCallback(async (userId: string, newStatus: User['status']) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));

    try {
      // API вызов для обновления статуса
      console.log('Обновление статуса пользователя:', { userId, newStatus });
    } catch (error) {
      console.error('Ошибка обновления статуса пользователя:', error);
    }
  }, []);

  const bulkUpdateUsers = useCallback(async (userIds: string[], action: 'activate' | 'suspend' | 'delete' | 'changeRole', data?: any) => {
    if (userIds.length === 0) return;

    try {
      switch (action) {
        case 'activate':
          setUsers(prev => prev.map(user => 
            userIds.includes(user.id) ? { ...user, status: 'active' } : user
          ));
          break;
        case 'suspend':
          setUsers(prev => prev.map(user => 
            userIds.includes(user.id) ? { ...user, status: 'suspended' } : user
          ));
          break;
        case 'delete':
          if (confirm(`Удалить ${userIds.length} пользователей?`)) {
            setUsers(prev => prev.filter(user => !userIds.includes(user.id)));
          }
          break;
        case 'changeRole':
          if (data?.role) {
            setUsers(prev => prev.map(user => 
              userIds.includes(user.id) ? { ...user, globalRole: data.role } : user
            ));
          }
          break;
      }
    } catch (error) {
      console.error('Ошибка массовой операции:', error);
    }
  }, []);

  const createUser = useCallback(async (userData: any) => {
    try {
      console.log('Создание пользователя:', userData);
      
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        globalRole: userData.role as 'BUSINESS' | 'AGENCY' | 'STAFF' | 'SUPER_ADMIN',
        status: userData.isActive ? 'active' : 'inactive',
        createdAt: new Date(),
        projectsCount: 0,
        permissions: [],
        isEmailVerified: false,
        twoFactorEnabled: false,
        lastLogin: undefined
      };

      setUsers(prev => [...prev, newUser]);
    } catch (error) {
      console.error('Ошибка создания пользователя:', error);
      throw error;
    }
  }, []);

  return {
    users,
    settings,
    loading,
    setSettings,
    loadUsersAndSettings,
    updateUserRole,
    updateUserStatus,
    bulkUpdateUsers,
    createUser
  };
};
