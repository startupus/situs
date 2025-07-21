// Базовые типы
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface Balance {
  userId: string;
  currency: Currency;
  amount: number;
  reserved: number;
  available: number;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  userId: string;
  serviceId: string;
  type: 'deposit' | 'charge' | 'refund' | 'transfer';
  amount: number;
  currency: Currency;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  completedAt?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  pricing: {
    currency: Currency;
    amount: number;
    type: 'fixed' | 'variable';
  };
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface BillingEvent {
  id: string;
  type: BillingEventType;
  timestamp: string;
  userId: string;
  serviceId?: string;
  data: Record<string, any>;
  metadata?: Record<string, any>;
}

export type BillingEventType = 
  | 'BALANCE_CREDITED'
  | 'BALANCE_DEBITED'
  | 'BALANCE_INSUFFICIENT'
  | 'TRANSACTION_CREATED'
  | 'TRANSACTION_COMPLETED'
  | 'TRANSACTION_FAILED'
  | 'TRANSACTION_REFUNDED'
  | 'PAYMENT_RECEIVED'
  | 'PAYMENT_FAILED'
  | 'SYSTEM_ALERT'
  | 'USER_CREATED';

export interface Plugin {
  name: string;
  version: string;
  description: string;
  enabled: boolean;
  config: Record<string, any>;
  installedAt: string;
  updatedAt: string;
}

export interface EventStats {
  totalEvents: number;
  eventsByType: Record<BillingEventType, number>;
  recentEvents: number;
  errorRate: number;
}

export type Currency = 'MNT' | 'USD' | 'EUR' | 'RUB' | 'MRK';

// API Response типы
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, any>;
}

// Форма типы
export interface CreateUserForm {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export interface UpdateUserForm {
  username?: string;
  email?: string;
  role?: 'admin' | 'user';
  status?: 'active' | 'inactive' | 'suspended';
}

export interface BalanceUpdateForm {
  userId: string;
  currency: Currency;
  amount: number;
  operation: 'deposit' | 'charge' | 'refund';
  description?: string;
}

export interface TransactionFilter {
  userId?: string;
  serviceId?: string;
  type?: Transaction['type'];
  status?: Transaction['status'];
  currency?: Currency;
  dateFrom?: string;
  dateTo?: string;
  amountFrom?: number;
  amountTo?: number;
}

export interface UserFilter {
  role?: User['role'];
  status?: User['status'];
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Статистика и аналитика
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  totalVolume: Record<Currency, number>;
  recentTransactions: Transaction[];
  balanceByUsers: number;
  systemHealth: {
    uptime: number;
    responseTime: number;
    errorRate: number;
  };
}

export interface TransactionStats {
  totalTransactions: number;
  totalVolume: Record<Currency, number>;
  transactionsByType: Record<Transaction['type'], number>;
  transactionsByStatus: Record<Transaction['status'], number>;
  transactionsByDay: Array<{
    date: string;
    count: number;
    volume: Record<Currency, number>;
  }>;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  usersByRole: Record<User['role'], number>;
  usersByStatus: Record<User['status'], number>;
  userRegistrationsByDay: Array<{
    date: string;
    count: number;
  }>;
}

// UI состояние
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface TableState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: Record<string, any>;
  sort: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

export interface ModalState {
  isOpen: boolean;
  type: 'create' | 'edit' | 'delete' | 'view';
  data?: any;
}

// Настройки
export interface AppSettings {
  theme: 'light' | 'dark';
  language: 'en' | 'ru';
  currency: Currency;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard: {
    refreshInterval: number;
    defaultCurrency: Currency;
    itemsPerPage: number;
  };
}

// Аутентификация
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginForm {
  username: string;
  password: string;
}

// Уведомления
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

// Экспорт данных
export interface ExportRequest {
  type: 'transactions' | 'users' | 'balances' | 'events';
  format: 'csv' | 'excel' | 'pdf';
  filters?: Record<string, any>;
  dateRange?: {
    from: string;
    to: string;
  };
}

// Webhook
export interface WebhookConfig {
  url: string;
  events: BillingEventType[];
  secret: string;
  enabled: boolean;
  retryCount: number;
  timeout: number;
}

// Аудит
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  changes: Record<string, any>;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}