// Глобальные роли пользователей (синхронизировано с бэкендом)
export type GlobalRole = 'SUPER_ADMIN' | 'STAFF' | 'AGENCY' | 'BUSINESS';

// Роли проекта
export type ProjectRole = 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER';

// Роли аккаунта  
export type AccountRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'MEMBER';

// Статусы пользователей (синхронизировано с бэкендом)
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BANNED';

// Права доступа
export interface UserPermission {
  id: string;
  name: string;
  description: string;
  category: 'projects' | 'users' | 'orders' | 'marketing' | 'settings' | 'reports';
}

// Роль с правами доступа
export interface Role {
  id: string;
  name: GlobalRole;
  displayName: string;
  description: string;
  permissions: string[]; // IDs прав доступа
  level: number; // Уровень доступа (чем выше, тем больше прав)
}

// Основной интерфейс пользователя
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  globalRole: GlobalRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isEmailVerified: boolean;
  phone?: string;
  company?: string;
  position?: string;
  notes?: string;
  // Статистика
  projectsCount: number;
  ordersCount: number;
  // Настройки
  permissions: string[];
  // Данные для клиентов
  clientInfo?: {
    balance: number;
    currency: string;
    totalSpent: number;
    registrationSource: string;
  };
}

// Фильтры для поиска пользователей
export interface UserFilters {
  role?: GlobalRole | 'all';
  status?: UserStatus | 'all';
  search?: string;
  company?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

// Статистика по пользователям
export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  banned: number;
  byRole: Record<GlobalRole, number>;
  newThisMonth: number;
  newThisWeek: number;
}

// Форма создания/редактирования пользователя
export interface UserForm {
  email: string;
  firstName: string;
  lastName: string;
  globalRole: GlobalRole;
  status: UserStatus;
  phone?: string;
  company?: string;
  position?: string;
  notes?: string;
  permissions?: string[];
  // Для новых пользователей
  password?: string;
  sendWelcomeEmail?: boolean;
} 