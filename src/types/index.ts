// Authentication types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Currency types - теперь динамические
export interface Currency {
  id: string;
  code: string;        // e.g., "USD", "EUR", "BTC", "GEMS"
  name: string;        // e.g., "US Dollar", "Euro", "Bitcoin", "Game Gems"
  symbol: string;      // e.g., "$", "€", "₿", "💎"
  decimals: number;    // Number of decimal places
  isActive: boolean;
  isSystem: boolean;   // System currencies vs user-created
  
  // Metadata
  description?: string;
  iconUrl?: string;
  color?: string;      // Hex color for UI
  
  // Audit fields
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCurrencyRequest {
  code: string;
  name: string;
  symbol: string;
  decimals?: number;
  description?: string;
  iconUrl?: string;
  color?: string;
}

export interface UpdateCurrencyRequest {
  name?: string;
  symbol?: string;
  decimals?: number;
  description?: string;
  iconUrl?: string;
  color?: string;
  isActive?: boolean;
}

// Balance types
export interface Balance {
  id: string;
  userId: string;
  currencyId: string;
  amount: number;
  reserved: number;
  lastUpdated: string;
  
  // Relations
  user?: User;
  currency?: Currency;
}

export interface BalanceUpdate {
  userId: string;
  currencyId: string;
  amount: number;
  description?: string;
  skipEvents?: boolean;
}

// Transaction types
export interface Transaction {
  id: string;
  userId: string;
  serviceId: string;
  type: 'deposit' | 'charge' | 'refund' | 'transfer';
  amount: number;
  currencyId: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  completedAt?: string;
  
  // Relations
  user?: User;
  currency?: Currency;
}

export interface CreateTransactionRequest {
  userId: string;
  serviceId: string;
  type: 'deposit' | 'charge' | 'refund' | 'transfer';
  amount: number;
  currencyId: string;
  description?: string;
  metadata?: Record<string, any>;
}

// Event types
export interface BillingEvent {
  id: string;
  type: BillingEventType;
  timestamp: string;
  userId: string;
  serviceId?: string;
  data: Record<string, any>;
  metadata?: Record<string, any>;
}

export enum BillingEventType {
  BALANCE_CREDITED = 'balance_credited',
  BALANCE_DEBITED = 'balance_debited',
  BALANCE_INSUFFICIENT = 'balance_insufficient',
  TRANSACTION_CREATED = 'transaction_created',
  TRANSACTION_COMPLETED = 'transaction_completed',
  TRANSACTION_FAILED = 'transaction_failed',
  TRANSACTION_REFUNDED = 'transaction_refunded',
  PAYMENT_RECEIVED = 'payment_received',
  PAYMENT_FAILED = 'payment_failed',
  SYSTEM_ALERT = 'system_alert',
  CURRENCY_CREATED = 'currency_created',
  CURRENCY_UPDATED = 'currency_updated',
  CURRENCY_DEACTIVATED = 'currency_deactivated'
}

// Plugin types
export interface Plugin {
  name: string;
  version: string;
  description: string;
  enabled: boolean;
  config: Record<string, any>;
  dependencies: string[];
}

export interface PluginConfig {
  [key: string]: any;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
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

// Service types
export interface Service {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Statistics types
export interface DashboardStats {
  totalUsers: number;
  totalTransactions: number;
  totalBalance: Record<string, number>; // currencyId -> amount
  recentTransactions: Transaction[];
  topCurrencies: Array<{
    currency: Currency;
    totalAmount: number;
    transactionCount: number;
  }>;
}

export interface TransactionStats {
  totalTransactions: number;
  totalAmount: Record<string, number>; // currencyId -> amount
  transactionsByType: Record<string, number>;
  transactionsByStatus: Record<string, number>;
  transactionsByCurrency: Record<string, number>;
  dailyTransactions: Array<{
    date: string;
    count: number;
    amount: Record<string, number>;
  }>;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  usersByRole: Record<string, number>;
  usersByStatus: Record<string, number>;
}

export interface EventStats {
  totalEvents: number;
  eventsByType: Record<string, number>;
  recentEvents: BillingEvent[];
  eventsOverTime: Array<{
    date: string;
    count: number;
  }>;
}

// Webhook types
export interface WebhookConfig {
  url: string;
  events: BillingEventType[];
  secret: string;
  enabled: boolean;
  maxRetries: number;
  timeout: number;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  eventId: string;
  url: string;
  status: 'pending' | 'success' | 'failed';
  attempts: number;
  lastAttempt: string;
  nextAttempt?: string;
  response?: {
    status: number;
    body: string;
    headers: Record<string, string>;
  };
}

// Audit types
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  changes: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

// Error types
export interface BillingError extends Error {
  code: string;
  statusCode: number;
  details?: Record<string, any>;
}

// Health check types
export interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  services: {
    database: 'healthy' | 'unhealthy';
    events: 'healthy' | 'unhealthy';
    plugins: 'healthy' | 'unhealthy';
  };
}