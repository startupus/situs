/**
 * Orders API Service
 * Управление заказами, продуктами и услугами
 */

import { apiClient, ApiResponse, ApiUtils } from '../client';

export interface Order {
  id: string;
  orderNumber: string;
  projectName: string;
  projectId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  type: 'product' | 'service' | 'form' | 'subscription';
  status: 'new' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  amount: number;
  currency: string;
  date: string;
  description: string;
  items?: OrderItem[];
  metadata?: Record<string, any>;
  notes?: string;
  paymentMethod?: string;
  deliveryAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id?: string;
  name: string;
  quantity: number;
  price: number;
  discount?: number;
  description?: string;
}

export interface OrderFilters {
  search?: string;
  status?: string;
  type?: string;
  projectId?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: 'date' | 'amount' | 'status' | 'customer';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface OrdersListResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    totalAmount: number;
    totalOrders: number;
    newOrders: number;
    processingOrders: number;
    completedOrders: number;
  };
}

export interface CreateOrderData {
  projectId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  type: Order['type'];
  amount: number;
  currency: string;
  description: string;
  items?: Omit<OrderItem, 'id'>[];
  metadata?: Record<string, any>;
  notes?: string;
  paymentMethod?: string;
  deliveryAddress?: string;
}

export interface UpdateOrderData {
  status?: Order['status'];
  amount?: number;
  description?: string;
  items?: OrderItem[];
  notes?: string;
  paymentMethod?: string;
  deliveryAddress?: string;
  metadata?: Record<string, any>;
}

export interface OrderStats {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  topProducts: {
    name: string;
    quantity: number;
    revenue: number;
  }[];
  revenueByPeriod: {
    date: string;
    revenue: number;
    orders: number;
  }[];
}

class OrdersApiService {
  private readonly baseEndpoint = '/orders';

  /**
   * Получить список заказов
   */
  async getOrders(filters?: OrderFilters): Promise<OrdersListResponse> {
    try {
      const response = await apiClient.get<ApiResponse<OrdersListResponse>>(this.baseEndpoint, filters);

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при загрузке заказов');
    } catch (error) {
      console.error('Orders API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Получить отдельный заказ
   */
  async getOrder(orderId: string): Promise<Order> {
    try {
      const response = await apiClient.get<ApiResponse<Order>>(`${this.baseEndpoint}/${orderId}`);

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Заказ не найден');
    } catch (error) {
      console.error('Get Order API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Создать новый заказ
   */
  async createOrder(data: CreateOrderData): Promise<Order> {
    try {
      const response = await apiClient.post<ApiResponse<Order>>(this.baseEndpoint, data);

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при создании заказа');
    } catch (error) {
      console.error('Create Order API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Обновить заказ
   */
  async updateOrder(orderId: string, data: UpdateOrderData): Promise<Order> {
    try {
      const response = await apiClient.put<ApiResponse<Order>>(`${this.baseEndpoint}/${orderId}`, data);

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при обновлении заказа');
    } catch (error) {
      console.error('Update Order API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Удалить заказ
   */
  async deleteOrder(orderId: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`${this.baseEndpoint}/${orderId}`);

      if (!ApiUtils.isSuccess(response)) {
        throw new Error(response.error || 'Ошибка при удалении заказа');
      }
    } catch (error) {
      console.error('Delete Order API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Изменить статус заказа
   */
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    try {
      const response = await apiClient.patch<ApiResponse<Order>>(`${this.baseEndpoint}/${orderId}/status`, { status });

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при обновлении статуса');
    } catch (error) {
      console.error('Update Order Status API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Получить статистику заказов
   */
  async getOrderStats(filters?: { dateFrom?: string; dateTo?: string; projectId?: string }): Promise<OrderStats> {
    try {
      const response = await apiClient.get<ApiResponse<OrderStats>>(`${this.baseEndpoint}/stats`, filters);

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при загрузке статистики');
    } catch (error) {
      console.error('Order Stats API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Получить заказы по проекту
   */
  async getOrdersByProject(projectId: string, filters?: Omit<OrderFilters, 'projectId'>): Promise<OrdersListResponse> {
    try {
      const response = await apiClient.get<ApiResponse<OrdersListResponse>>(
        `${this.baseEndpoint}/project/${projectId}`,
        filters,
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при загрузке заказов проекта');
    } catch (error) {
      console.error('Project Orders API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Экспорт заказов
   */
  async exportOrders(format: 'csv' | 'xlsx' | 'json', filters?: OrderFilters): Promise<Blob> {
    try {
      const response = await fetch(`${apiClient['baseURL']}${this.baseEndpoint}/export?format=${format}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('auth_token') && {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          }),
        },
        body: JSON.stringify(filters || {}),
      });

      if (!response.ok) {
        throw new Error('Ошибка при экспорте заказов');
      }

      return await response.blob();
    } catch (error) {
      console.error('Export Orders API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Создать refund для заказа
   */
  async refundOrder(orderId: string, amount?: number, reason?: string): Promise<Order> {
    try {
      const response = await apiClient.post<ApiResponse<Order>>(`${this.baseEndpoint}/${orderId}/refund`, {
        amount,
        reason,
      });

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при возврате средств');
    } catch (error) {
      console.error('Refund Order API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }
}

export const ordersApi = new OrdersApiService();
export default ordersApi;
