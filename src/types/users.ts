// Типы ролей пользователей
export type UserRole = 'super_admin' | 'company_admin' | 'admin' | 'moderator' | 'editor' | 'client';

// Статусы пользователей
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

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
  name: UserRole;
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
  role: UserRole;
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
  role?: UserRole | 'all';
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
  pending: number;
  byRole: Record<UserRole, number>;
  newThisMonth: number;
  newThisWeek: number;
}

// Форма создания/редактирования пользователя
export interface UserForm {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
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