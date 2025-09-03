/**
 * Support API Service
 * Система поддержки, тикеты и FAQ
 */

import { apiClient, ApiResponse, ApiUtils } from '../client';

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'new' | 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  userId: string;
  userName: string;
  userEmail: string;
  assignedTo?: string;
  assignedToName?: string;
  tags: string[];
  attachments: TicketAttachment[];
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
}

export interface TicketAttachment {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  uploadedAt: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  authorType: 'user' | 'support' | 'system';
  content: string;
  isInternal: boolean;
  attachments: TicketAttachment[];
  createdAt: string;
}

export interface CreateTicketData {
  title: string;
  description: string;
  category: string;
  priority?: SupportTicket['priority'];
  tags?: string[];
  attachments?: File[];
}

export interface UpdateTicketData {
  title?: string;
  description?: string;
  status?: SupportTicket['status'];
  priority?: SupportTicket['priority'];
  category?: string;
  assignedTo?: string;
  tags?: string[];
}

export interface TicketFilters {
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
  assignedTo?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  sortBy?: 'created' | 'updated' | 'priority' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface TicketsListResponse {
  tickets: SupportTicket[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    totalTickets: number;
    newTickets: number;
    openTickets: number;
    pendingTickets: number;
    resolvedTickets: number;
    closedTickets: number;
  };
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  viewCount: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface FAQCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
  order: number;
  faqCount: number;
}

export interface SupportStats {
  totalTickets: number;
  averageResponseTime: number; // в часах
  averageResolutionTime: number; // в часах
  satisfactionRating: number; // 1-5
  ticketsByStatus: {
    status: string;
    count: number;
  }[];
  ticketsByCategory: {
    category: string;
    count: number;
  }[];
  responseTimeByPeriod: {
    date: string;
    averageTime: number;
  }[];
}

class SupportApiService {
  private readonly baseEndpoint = '/api/support';

  /**
   * Получить список тикетов
   */
  async getTickets(filters?: TicketFilters): Promise<TicketsListResponse> {
    try {
      const response = await apiClient.get<ApiResponse<TicketsListResponse>>(`${this.baseEndpoint}/tickets`, filters);

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при загрузке тикетов');
    } catch (error) {
      console.error('Tickets API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Получить отдельный тикет
   */
  async getTicket(ticketId: string): Promise<SupportTicket> {
    try {
      const response = await apiClient.get<ApiResponse<SupportTicket>>(`${this.baseEndpoint}/tickets/${ticketId}`);

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Тикет не найден');
    } catch (error) {
      console.error('Get Ticket API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Создать новый тикет
   */
  async createTicket(data: CreateTicketData): Promise<SupportTicket> {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);

      if (data.priority) formData.append('priority', data.priority);
      if (data.tags) formData.append('tags', JSON.stringify(data.tags));

      if (data.attachments) {
        data.attachments.forEach((file, index) => {
          formData.append(`attachment_${index}`, file);
        });
      }

      const response = await apiClient.upload<ApiResponse<SupportTicket>>(`${this.baseEndpoint}/tickets`, formData);

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при создании тикета');
    } catch (error) {
      console.error('Create Ticket API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Обновить тикет
   */
  async updateTicket(ticketId: string, data: UpdateTicketData): Promise<SupportTicket> {
    try {
      const response = await apiClient.put<ApiResponse<SupportTicket>>(
        `${this.baseEndpoint}/tickets/${ticketId}`,
        data,
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при обновлении тикета');
    } catch (error) {
      console.error('Update Ticket API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Добавить сообщение к тикету
   */
  async addMessage(
    ticketId: string,
    content: string,
    isInternal: boolean = false,
    attachments?: File[],
  ): Promise<TicketMessage> {
    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('isInternal', isInternal.toString());

      if (attachments) {
        attachments.forEach((file, index) => {
          formData.append(`attachment_${index}`, file);
        });
      }

      const response = await apiClient.upload<ApiResponse<TicketMessage>>(
        `${this.baseEndpoint}/tickets/${ticketId}/messages`,
        formData,
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при добавлении сообщения');
    } catch (error) {
      console.error('Add Message API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Назначить тикет агенту
   */
  async assignTicket(ticketId: string, agentId: string): Promise<SupportTicket> {
    try {
      const response = await apiClient.patch<ApiResponse<SupportTicket>>(
        `${this.baseEndpoint}/tickets/${ticketId}/assign`,
        { assignedTo: agentId },
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при назначении тикета');
    } catch (error) {
      console.error('Assign Ticket API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Изменить статус тикета
   */
  async updateTicketStatus(ticketId: string, status: SupportTicket['status']): Promise<SupportTicket> {
    try {
      const response = await apiClient.patch<ApiResponse<SupportTicket>>(
        `${this.baseEndpoint}/tickets/${ticketId}/status`,
        { status },
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при обновлении статуса');
    } catch (error) {
      console.error('Update Ticket Status API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Получить FAQ
   */
  async getFAQ(category?: string): Promise<FAQ[]> {
    try {
      const params = category ? { category } : undefined;
      const response = await apiClient.get<ApiResponse<FAQ[]>>(`${this.baseEndpoint}/faq`, params);

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при загрузке FAQ');
    } catch (error) {
      console.error('FAQ API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Получить категории FAQ
   */
  async getFAQCategories(): Promise<FAQCategory[]> {
    try {
      const response = await apiClient.get<ApiResponse<FAQCategory[]>>(`${this.baseEndpoint}/faq/categories`);

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при загрузке категорий');
    } catch (error) {
      console.error('FAQ Categories API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Поиск в FAQ
   */
  async searchFAQ(query: string): Promise<FAQ[]> {
    try {
      const response = await apiClient.get<ApiResponse<FAQ[]>>(`${this.baseEndpoint}/faq/search`, { q: query });

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка поиска');
    } catch (error) {
      console.error('FAQ Search API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Получить статистику поддержки
   */
  async getSupportStats(dateFrom?: string, dateTo?: string): Promise<SupportStats> {
    try {
      const params = { dateFrom, dateTo };
      const response = await apiClient.get<ApiResponse<SupportStats>>(`${this.baseEndpoint}/stats`, params);

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при загрузке статистики');
    } catch (error) {
      console.error('Support Stats API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Получить мои тикеты (для текущего пользователя)
   */
  async getMyTickets(filters?: Omit<TicketFilters, 'userId'>): Promise<TicketsListResponse> {
    try {
      const response = await apiClient.get<ApiResponse<TicketsListResponse>>(
        `${this.baseEndpoint}/my-tickets`,
        filters,
      );

      if (ApiUtils.isSuccess(response)) {
        return response.data;
      }

      throw new Error(response.error || 'Ошибка при загрузке тикетов');
    } catch (error) {
      console.error('My Tickets API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }

  /**
   * Отправить отзыв о качестве поддержки
   */
  async submitFeedback(ticketId: string, rating: number, comment?: string): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<void>>(`${this.baseEndpoint}/tickets/${ticketId}/feedback`, {
        rating,
        comment,
      });

      if (!ApiUtils.isSuccess(response)) {
        throw new Error(response.error || 'Ошибка при отправке отзыва');
      }
    } catch (error) {
      console.error('Submit Feedback API Error:', error);
      throw new Error(ApiUtils.handleError(error));
    }
  }
}

export const supportApi = new SupportApiService();
export default supportApi;
