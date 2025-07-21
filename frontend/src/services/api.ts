import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { 
  User, 
  Balance, 
  Transaction, 
  BillingEvent, 
  Plugin, 
  EventStats,
  DashboardStats,
  TransactionStats,
  UserStats,
  ApiResponse,
  PaginatedResponse,
  CreateUserForm,
  UpdateUserForm,
  BalanceUpdateForm,
  TransactionFilter,
  UserFilter,
  ExportRequest,
  WebhookConfig,
  AuditLog,
  LoginForm,
  AuthState
} from '../types';

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - добавляем токен авторизации
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - обрабатываем ошибки
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Удаляем токен и перенаправляем на логин
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginForm): Promise<AuthState> {
    const response = await this.client.post('/auth/login', credentials);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
    localStorage.removeItem('auth_token');
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  // User endpoints
  async getUsers(params?: {
    page?: number;
    limit?: number;
    filters?: UserFilter;
  }): Promise<PaginatedResponse<User>> {
    const response = await this.client.get('/api/users', { params });
    return response.data;
  }

  async getUser(id: string): Promise<User> {
    const response = await this.client.get(`/api/users/${id}`);
    return response.data;
  }

  async createUser(userData: CreateUserForm): Promise<User> {
    const response = await this.client.post('/api/users', userData);
    return response.data;
  }

  async updateUser(id: string, userData: UpdateUserForm): Promise<User> {
    const response = await this.client.put(`/api/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await this.client.delete(`/api/users/${id}`);
  }

  // Balance endpoints
  async getBalance(userId: string): Promise<Balance[]> {
    const response = await this.client.get(`/api/balance/${userId}`);
    return response.data;
  }

  async updateBalance(data: BalanceUpdateForm): Promise<Balance> {
    const response = await this.client.post('/api/balance/update', data);
    return response.data;
  }

  async getBalances(params?: {
    page?: number;
    limit?: number;
    userId?: string;
    currency?: string;
  }): Promise<PaginatedResponse<Balance>> {
    const response = await this.client.get('/api/balances', { params });
    return response.data;
  }

  // Transaction endpoints
  async getTransactions(params?: {
    page?: number;
    limit?: number;
    filters?: TransactionFilter;
  }): Promise<PaginatedResponse<Transaction>> {
    const response = await this.client.get('/api/transactions', { params });
    return response.data;
  }

  async getTransaction(id: string): Promise<Transaction> {
    const response = await this.client.get(`/api/transactions/${id}`);
    return response.data;
  }

  async createTransaction(data: Omit<Transaction, 'id' | 'createdAt' | 'status'>): Promise<Transaction> {
    const response = await this.client.post('/api/transactions', data);
    return response.data;
  }

  async refundTransaction(id: string, amount?: number): Promise<Transaction> {
    const response = await this.client.post(`/api/transactions/${id}/refund`, { amount });
    return response.data;
  }

  // Event endpoints
  async getEvents(params?: {
    page?: number;
    limit?: number;
    type?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedResponse<BillingEvent>> {
    const response = await this.client.get('/api/events', { params });
    return response.data;
  }

  async getEventStats(): Promise<EventStats> {
    const response = await this.client.get('/api/events/stats');
    return response.data;
  }

  // Plugin endpoints
  async getPlugins(): Promise<Plugin[]> {
    const response = await this.client.get('/api/plugins');
    return response.data;
  }

  async enablePlugin(name: string): Promise<Plugin> {
    const response = await this.client.post(`/api/plugins/${name}/enable`);
    return response.data;
  }

  async disablePlugin(name: string): Promise<Plugin> {
    const response = await this.client.post(`/api/plugins/${name}/disable`);
    return response.data;
  }

  async updatePluginConfig(name: string, config: Record<string, any>): Promise<Plugin> {
    const response = await this.client.put(`/api/plugins/${name}/config`, config);
    return response.data;
  }

  // Statistics endpoints
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.client.get('/api/stats/dashboard');
    return response.data;
  }

  async getTransactionStats(params?: {
    startDate?: string;
    endDate?: string;
    currency?: string;
  }): Promise<TransactionStats> {
    const response = await this.client.get('/api/stats/transactions', { params });
    return response.data;
  }

  async getUserStats(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<UserStats> {
    const response = await this.client.get('/api/stats/users', { params });
    return response.data;
  }

  // Export endpoints
  async exportData(request: ExportRequest): Promise<Blob> {
    const response = await this.client.post('/api/export', request, {
      responseType: 'blob',
    });
    return response.data;
  }

  // Webhook endpoints
  async getWebhookConfig(): Promise<WebhookConfig> {
    const response = await this.client.get('/api/webhook/config');
    return response.data;
  }

  async updateWebhookConfig(config: WebhookConfig): Promise<WebhookConfig> {
    const response = await this.client.put('/api/webhook/config', config);
    return response.data;
  }

  async testWebhook(url: string): Promise<{ success: boolean; message: string }> {
    const response = await this.client.post('/api/webhook/test', { url });
    return response.data;
  }

  // Audit endpoints
  async getAuditLogs(params?: {
    page?: number;
    limit?: number;
    userId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedResponse<AuditLog>> {
    const response = await this.client.get('/api/audit', { params });
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; uptime: number }> {
    const response = await this.client.get('/');
    return response.data;
  }

  // Utility methods
  async uploadFile(file: File, endpoint: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await this.client.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async downloadFile(url: string, filename: string): Promise<void> {
    const response = await this.client.get(url, {
      responseType: 'blob',
    });
    
    const blob = new Blob([response.data]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }

  // Real-time updates (WebSocket)
  connectWebSocket(onMessage: (data: any) => void, onError?: (error: Event) => void): WebSocket {
    const wsUrl = this.baseURL.replace('http', 'ws') + '/ws';
    const ws = new WebSocket(wsUrl);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) onError(error);
    };
    
    return ws;
  }
}

// Singleton instance
export const apiClient = new ApiClient();
export default apiClient;