// Мок-данные для системы управления пользователями
import { User, UserRole, UserStats, UserStatus } from '../types/users';

/**
 * Mock данные пользователей для демонстрации
 */
export const mockUsers: User[] = [
  {
    id: 'user-001',
    email: 'john.doe@example.com',
    firstName: 'Джон',
    lastName: 'Доу',
    avatar: undefined,
    role: 'admin' as UserRole,
    status: 'active' as UserStatus,
    phone: '+7 (999) 123-45-67',
    company: 'TechCorp Ltd.',
    position: 'Senior Developer',
    notes: 'Опытный разработчик команды',
    lastLoginAt: new Date('2024-01-20T14:30:00Z'),
    isEmailVerified: true,
    projectsCount: 156,
    ordersCount: 89,
    permissions: ['projects_manage', 'users_view', 'orders_view'],
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-20T14:30:00Z'),
    clientInfo: {
      balance: 10000,
      currency: 'RUB',
      totalSpent: 250000,
      registrationSource: 'Website'
    }
  },
  {
    id: 'user-002',
    email: 'jane.smith@example.com',
    firstName: 'Джейн',
    lastName: 'Смит',
    avatar: undefined,
    role: 'client' as UserRole,
    status: 'active' as UserStatus,
    phone: '+7 (999) 234-56-78',
    company: 'DesignStudio Inc.',
    position: 'UI/UX Designer',
    notes: 'Дизайнер интерфейсов',
    lastLoginAt: new Date('2024-01-20T09:15:00Z'),
    isEmailVerified: true,
    projectsCount: 12,
    ordersCount: 45,
    permissions: ['projects_view_own'],
    createdAt: new Date('2024-01-05T00:00:00Z'),
    updatedAt: new Date('2024-01-20T09:15:00Z'),
    clientInfo: {
      balance: 15000,
      currency: 'RUB',
      totalSpent: 120000,
      registrationSource: 'Referral'
    }
  },
  {
    id: 'user-003',
    email: 'mike.wilson@example.com',
    firstName: 'Майк',
    lastName: 'Уилсон',
    avatar: undefined,
    role: 'editor' as UserRole,
    status: 'active' as UserStatus,
    phone: '+7 (999) 345-67-89',
    company: 'StartupHub',
    position: 'Product Manager',
    notes: 'Менеджер продуктов',
    lastLoginAt: new Date('2024-01-19T16:45:00Z'),
    isEmailVerified: true,
    projectsCount: 8,
    ordersCount: 23,
    permissions: ['content_create', 'content_edit', 'projects_view'],
    createdAt: new Date('2024-01-08T00:00:00Z'),
    updatedAt: new Date('2024-01-19T16:45:00Z'),
    clientInfo: {
      balance: 5000,
      currency: 'RUB',
      totalSpent: 75000,
      registrationSource: 'Website'
    }
  },
  {
    id: 'user-004',
    email: 'sarah.davis@example.com',
    firstName: 'Сара',
    lastName: 'Дэвис',
    avatar: undefined,
    role: 'client' as UserRole,
    status: 'active' as UserStatus,
    phone: '+7 (999) 456-78-90',
    company: 'MarketingPro',
    position: 'Content Manager',
    notes: 'Контент-менеджер',
    lastLoginAt: new Date('2024-01-20T08:30:00Z'),
    isEmailVerified: true,
    projectsCount: 3,
    ordersCount: 8,
    permissions: ['projects_view_own'],
    createdAt: new Date('2024-01-15T00:00:00Z'),
    updatedAt: new Date('2024-01-20T08:30:00Z'),
    clientInfo: {
      balance: 25000,
      currency: 'RUB',
      totalSpent: 95000,
      registrationSource: 'Website'
    }
  },
  {
    id: 'user-005',
    email: 'alex.brown@example.com',
    firstName: 'Алекс',
    lastName: 'Браун',
    avatar: undefined,
    role: 'moderator' as UserRole,
    status: 'active' as UserStatus,
    phone: '+7 (999) 567-89-01',
    company: 'DataCorp',
    position: 'Data Analyst',
    notes: 'Аналитик данных',
    lastLoginAt: new Date('2024-01-19T18:20:00Z'),
    isEmailVerified: true,
    projectsCount: 0,
    ordersCount: 0,
    permissions: ['content_moderate', 'users_moderate', 'reports_view'],
    createdAt: new Date('2024-01-03T00:00:00Z'),
    updatedAt: new Date('2024-01-19T18:20:00Z'),
    clientInfo: {
      balance: 0,
      currency: 'RUB',
      totalSpent: 0,
      registrationSource: 'Internal'
    }
  },
  {
    id: 'user-006',
    email: 'emma.taylor@example.com',
    firstName: 'Эмма',
    lastName: 'Тейлор',
    avatar: undefined,
    phone: undefined,
    company: undefined,
    position: undefined,
    notes: 'Новый пользователь',
    role: 'client' as UserRole,
    status: 'pending' as UserStatus,
    lastLoginAt: undefined,
    isEmailVerified: false,
    projectsCount: 0,
    ordersCount: 0,
    permissions: [],
    createdAt: new Date('2024-01-20T12:00:00Z'),
    updatedAt: new Date('2024-01-20T12:00:00Z'),
    clientInfo: {
      balance: 0,
      currency: 'RUB',
      totalSpent: 0,
      registrationSource: 'Website'
    }
  },
  {
    id: 'user-007',
    email: 'david.lee@example.com',
    firstName: 'Дэвид',
    lastName: 'Ли',
    avatar: undefined,
    phone: '+7 (999) 678-90-12',
    company: undefined,
    position: undefined,
    notes: 'Редко активный пользователь',
    role: 'client' as UserRole,
    status: 'inactive' as UserStatus,
    lastLoginAt: new Date('2024-01-12T14:30:00Z'),
    isEmailVerified: true,
    projectsCount: 1,
    ordersCount: 2,
    permissions: ['projects_view_own'],
    createdAt: new Date('2024-01-10T00:00:00Z'),
    updatedAt: new Date('2024-01-15T16:00:00Z'),
    clientInfo: {
      balance: 1000,
      currency: 'RUB',
      totalSpent: 15000,
      registrationSource: 'Website'
    }
  }
];

/**
 * Статистика пользователей
 */
export const mockUserStats: UserStats = {
  total: mockUsers.length,
  active: mockUsers.filter(user => user.status === 'active').length,
  inactive: mockUsers.filter(user => user.status === 'inactive').length,
  suspended: mockUsers.filter(user => user.status === 'suspended').length,
  pending: mockUsers.filter(user => user.status === 'pending').length,
  byRole: {
    super_admin: mockUsers.filter(user => user.role === 'super_admin').length,
    company_admin: mockUsers.filter(user => user.role === 'company_admin').length,
    admin: mockUsers.filter(user => user.role === 'admin').length,
    moderator: mockUsers.filter(user => user.role === 'moderator').length,
    editor: mockUsers.filter(user => user.role === 'editor').length,
    client: mockUsers.filter(user => user.role === 'client').length,
  },
  newThisMonth: mockUsers
    .filter(user => new Date(user.createdAt).getMonth() === new Date().getMonth())
    .length,
  newThisWeek: mockUsers
    .filter(user => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(user.createdAt) > weekAgo;
    })
    .length
};

/**
 * Получение пользователя по ID
 */
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

/**
 * Получение пользователей с пагинацией
 */
export interface PaginatedUsers {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getUsersWithPagination = (
  page: number = 1,
  limit: number = 10,
  search?: string,
  role?: UserRole,
  status?: UserStatus
): PaginatedUsers => {
  let filteredUsers = [...mockUsers];

  // Фильтрация по поиску
  if (search) {
    const searchLower = search.toLowerCase();
    filteredUsers = filteredUsers.filter(user =>
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.company && user.company.toLowerCase().includes(searchLower))
    );
  }

  // Фильтрация по роли
  if (role && role !== 'all') {
    filteredUsers = filteredUsers.filter(user => user.role === role);
  }

  // Фильтрация по статусу
  if (status && status !== 'all') {
    filteredUsers = filteredUsers.filter(user => user.status === status);
  }

  const total = filteredUsers.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const users = filteredUsers.slice(startIndex, endIndex);

  return {
    users,
    total,
    page,
    limit,
    totalPages
  };
};

/**
 * Создание нового пользователя
 */
export const createUser = (userData: Partial<User>): User => {
  const newUser: User = {
    id: `user-${String(Date.now()).slice(-6)}`,
    email: userData.email || '',
    firstName: userData.firstName || '',
    lastName: userData.lastName || '',
    avatar: userData.avatar,
    role: userData.role || 'client',
    status: userData.status || 'pending',
    phone: userData.phone,
    company: userData.company,
    position: userData.position,
    notes: userData.notes,
    lastLoginAt: undefined,
    isEmailVerified: false,
    projectsCount: 0,
    ordersCount: 0,
    permissions: userData.permissions || [],
    createdAt: new Date(),
    updatedAt: new Date(),
    clientInfo: userData.clientInfo || {
      balance: 0,
      currency: 'RUB',
      totalSpent: 0,
      registrationSource: 'Manual'
    }
  };

  mockUsers.push(newUser);
  return newUser;
};

/**
 * Обновление пользователя
 */
export const updateUser = (id: string, userData: Partial<User>): User | undefined => {
  const userIndex = mockUsers.findIndex(user => user.id === id);
  if (userIndex === -1) return undefined;

  const updatedUser = {
    ...mockUsers[userIndex],
    ...userData,
    id, // Защита от изменения ID
    updatedAt: new Date()
  };

  mockUsers[userIndex] = updatedUser;
  return updatedUser;
};

/**
 * Удаление пользователя
 */
export const deleteUser = (id: string): boolean => {
  const userIndex = mockUsers.findIndex(user => user.id === id);
  if (userIndex === -1) return false;

  mockUsers.splice(userIndex, 1);
  return true;
}; 