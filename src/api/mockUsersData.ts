// Мок-данные для системы управления пользователями
import { User, UserStats } from '../types/users';

// Мок-пользователи для тестирования
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@situs.ru',
    firstName: 'Администратор',
    lastName: 'Системы',
    avatar: null,
    phone: '+7 (999) 123-45-67',
    company: 'Situs Ltd.',
    position: 'Системный администратор',
    notes: 'Главный администратор платформы',
    role: 'super_admin',
    status: 'active',
    permissions: ['all'],
    isEmailVerified: true,
    emailVerifiedAt: '2024-01-15T10:00:00Z',
    lastLoginAt: '2024-01-20T14:30:00Z',
    projectsCount: 25,
    ordersCount: 150,
    clientBalance: 0,
    clientCurrency: 'RUB',
    clientTotalSpent: 0,
    registrationSource: 'Internal',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: '2',
    email: 'manager@agency.com',
    firstName: 'Анна',
    lastName: 'Менеджер',
    avatar: null,
    phone: '+7 (999) 234-56-78',
    company: 'Digital Agency',
    position: 'Project Manager',
    notes: 'Менеджер проектов агентства',
    role: 'company_admin',
    status: 'active',
    permissions: ['projects_manage', 'users_view', 'orders_manage'],
    isEmailVerified: true,
    emailVerifiedAt: '2024-01-10T12:00:00Z',
    lastLoginAt: '2024-01-20T09:15:00Z',
    projectsCount: 12,
    ordersCount: 45,
    clientBalance: 15000,
    clientCurrency: 'RUB',
    clientTotalSpent: 250000,
    registrationSource: 'Website',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-20T09:15:00Z',
  },
  {
    id: '3',
    email: 'editor@content.ru',
    firstName: 'Михаил',
    lastName: 'Редактор',
    avatar: null,
    phone: '+7 (999) 345-67-89',
    company: 'Content Studio',
    position: 'Content Editor',
    notes: 'Редактор контента и блогов',
    role: 'editor',
    status: 'active',
    permissions: ['content_create', 'content_edit', 'projects_view'],
    isEmailVerified: true,
    emailVerifiedAt: '2024-01-12T15:30:00Z',
    lastLoginAt: '2024-01-19T16:45:00Z',
    projectsCount: 8,
    ordersCount: 23,
    clientBalance: 5000,
    clientCurrency: 'RUB',
    clientTotalSpent: 75000,
    registrationSource: 'Referral',
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-19T16:45:00Z',
  },
  {
    id: '4',
    email: 'client@business.com',
    firstName: 'Елена',
    lastName: 'Клиент',
    avatar: null,
    phone: '+7 (999) 456-78-90',
    company: 'Business Corp',
    position: 'Marketing Director',
    notes: 'Клиент с несколькими проектами',
    role: 'client',
    status: 'active',
    permissions: ['projects_view_own'],
    isEmailVerified: true,
    emailVerifiedAt: '2024-01-18T11:20:00Z',
    lastLoginAt: '2024-01-20T08:30:00Z',
    projectsCount: 3,
    ordersCount: 8,
    clientBalance: 25000,
    clientCurrency: 'RUB',
    clientTotalSpent: 120000,
    registrationSource: 'Website',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-20T08:30:00Z',
  },
  {
    id: '5',
    email: 'moderator@situs.ru',
    firstName: 'Дмитрий',
    lastName: 'Модератор',
    avatar: null,
    phone: '+7 (999) 567-89-01',
    company: 'Situs Ltd.',
    position: 'Content Moderator',
    notes: 'Модератор контента и пользователей',
    role: 'moderator',
    status: 'active',
    permissions: ['content_moderate', 'users_moderate', 'reports_view'],
    isEmailVerified: true,
    emailVerifiedAt: '2024-01-06T14:15:00Z',
    lastLoginAt: '2024-01-19T18:20:00Z',
    projectsCount: 0,
    ordersCount: 0,
    clientBalance: 0,
    clientCurrency: 'RUB',
    clientTotalSpent: 0,
    registrationSource: 'Internal',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-19T18:20:00Z',
  },
  {
    id: '6',
    email: 'newuser@test.com',
    firstName: 'Новый',
    lastName: 'Пользователь',
    avatar: null,
    phone: null,
    company: null,
    position: null,
    notes: 'Новый пользователь, ожидает активации',
    role: 'client',
    status: 'pending',
    permissions: [],
    isEmailVerified: false,
    emailVerifiedAt: null,
    lastLoginAt: null,
    projectsCount: 0,
    ordersCount: 0,
    clientBalance: 0,
    clientCurrency: 'RUB',
    clientTotalSpent: 0,
    registrationSource: 'Website',
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-01-20T12:00:00Z',
  },
  {
    id: '7',
    email: 'blocked@spam.com',
    firstName: 'Заблокированный',
    lastName: 'Пользователь',
    avatar: null,
    phone: '+7 (999) 000-00-00',
    company: null,
    position: null,
    notes: 'Заблокирован за нарушение правил',
    role: 'client',
    status: 'suspended',
    permissions: [],
    isEmailVerified: true,
    emailVerifiedAt: '2024-01-10T10:00:00Z',
    lastLoginAt: '2024-01-12T14:30:00Z',
    projectsCount: 1,
    ordersCount: 2,
    clientBalance: 0,
    clientCurrency: 'RUB',
    clientTotalSpent: 5000,
    registrationSource: 'Website',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-15T16:00:00Z',
  },
];

// Мок-статистика пользователей
export const mockUserStats: UserStats = {
  total: mockUsers.length,
  active: mockUsers.filter(u => u.status === 'active').length,
  inactive: mockUsers.filter(u => u.status === 'inactive').length,
  suspended: mockUsers.filter(u => u.status === 'suspended').length,
  pending: mockUsers.filter(u => u.status === 'pending').length,
  byRole: {
    super_admin: mockUsers.filter(u => u.role === 'super_admin').length,
    company_admin: mockUsers.filter(u => u.role === 'company_admin').length,
    admin: mockUsers.filter(u => u.role === 'admin').length,
    moderator: mockUsers.filter(u => u.role === 'moderator').length,
    editor: mockUsers.filter(u => u.role === 'editor').length,
    client: mockUsers.filter(u => u.role === 'client').length,
  },
  recentRegistrations: mockUsers
    .filter(u => {
      const createdDate = new Date(u.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdDate > weekAgo;
    }).length,
  activeToday: mockUsers
    .filter(u => {
      if (!u.lastLoginAt) return false;
      const lastLogin = new Date(u.lastLoginAt);
      const today = new Date();
      return lastLogin.toDateString() === today.toDateString();
    }).length,
};

// Функции для работы с мок-данными
export const mockUsersApi = {
  // Получение пользователей с фильтрацией и пагинацией
  getUsers: async (filters: any = {}, page: number = 1, limit: number = 20) => {
    let filteredUsers = [...mockUsers];

    // Фильтрация по статусу
    if (filters.status) {
      filteredUsers = filteredUsers.filter(u => u.status === filters.status);
    }

    // Фильтрация по роли
    if (filters.role) {
      filteredUsers = filteredUsers.filter(u => u.role === filters.role);
    }

    // Поиск по имени или email
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(u => 
        u.firstName.toLowerCase().includes(searchTerm) ||
        u.lastName.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm) ||
        (u.company && u.company.toLowerCase().includes(searchTerm))
      );
    }

    // Пагинация
    const total = filteredUsers.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  },

  // Получение одного пользователя
  getUser: async (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    return {
      success: !!user,
      data: user,
      error: user ? undefined : 'Пользователь не найден',
    };
  },

  // Создание пользователя
  createUser: async (userData: any) => {
    const newUser: User = {
      id: String(mockUsers.length + 1),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      avatar: userData.avatar || null,
      phone: userData.phone || null,
      company: userData.company || null,
      position: userData.position || null,
      notes: userData.notes || null,
      role: userData.role || 'client',
      status: userData.status || 'pending',
      permissions: userData.permissions || [],
      isEmailVerified: false,
      emailVerifiedAt: null,
      lastLoginAt: null,
      projectsCount: 0,
      ordersCount: 0,
      clientBalance: 0,
      clientCurrency: 'RUB',
      clientTotalSpent: 0,
      registrationSource: 'Manual',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    return {
      success: true,
      data: newUser,
    };
  },

  // Обновление пользователя
  updateUser: async (userId: string, userData: any) => {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return {
        success: false,
        error: 'Пользователь не найден',
      };
    }

    const updatedUser = {
      ...mockUsers[userIndex],
      ...userData,
      updatedAt: new Date().toISOString(),
    };

    mockUsers[userIndex] = updatedUser;

    return {
      success: true,
      data: updatedUser,
    };
  },

  // Удаление пользователя
  deleteUser: async (userId: string) => {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return {
        success: false,
        error: 'Пользователь не найден',
      };
    }

    mockUsers.splice(userIndex, 1);

    return {
      success: true,
    };
  },

  // Получение статистики
  getUserStats: async () => {
    return {
      success: true,
      data: mockUserStats,
    };
  },
};

export default mockUsersApi; 