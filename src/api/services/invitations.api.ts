import { apiClient } from '../client';

export interface Invitation {
  id: string;
  email: string;
  role: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED';
  token: string;
  message?: string;
  channel: 'EMAIL' | 'SMS' | 'TELEGRAM' | 'WHATSAPP' | 'SLACK';
  invitedBy: string;
  acceptedBy?: string;
  expiresAt: string;
  sentAt?: string;
  acceptedAt?: string;
  createdAt: string;
  updatedAt: string;
  invitedByUser?: {
    id: string;
    name: string;
    email: string;
  };
  acceptedByUser?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateInvitationRequest {
  emails: string[];
  role: string;
  message?: string;
  channel: string;
  expiresAt?: string;
}

export interface AcceptInvitationRequest {
  token: string;
  email: string;
  password: string;
  name?: string;
}

export interface InvitationsListResponse {
  data: Invitation[];
  total: number;
  page: number;
  limit: number;
}

export class InvitationsAPI {
  /**
   * Создание приглашений
   */
  static async createInvitations(data: CreateInvitationRequest): Promise<Invitation[]> {
    const response = await apiClient.post('/api/invitations', data);
    return response.data;
  }

  /**
   * Получение списка приглашений
   */
  static async getInvitations(params?: {
    page?: number;
    limit?: number;
    status?: string;
    email?: string;
  }): Promise<InvitationsListResponse> {
    const response = await apiClient.get('/api/invitations', params);
    return response;
  }

  /**
   * Получение приглашения по ID
   */
  static async getInvitation(id: string): Promise<Invitation> {
    const response = await apiClient.get(`/api/invitations/${id}`);
    return response.data;
  }

  /**
   * Получение приглашения по токену (публичный)
   */
  static async getInvitationByToken(token: string): Promise<Invitation> {
    const response = await apiClient.get(`/api/invitations/by-token/${token}`);
    return response;
  }

  /**
   * Принятие приглашения (публичный)
   */
  static async acceptInvitation(data: AcceptInvitationRequest): Promise<{
    user: any;
    invitation: Invitation;
  }> {
    const response = await apiClient.post('/api/invitations/accept', data);
    return response;
  }

  /**
   * Обновление приглашения
   */
  static async updateInvitation(
    id: string,
    data: {
      status?: string;
      message?: string;
      expiresAt?: string;
    },
  ): Promise<Invitation> {
    const response = await apiClient.patch(`/api/invitations/${id}`, data);
    return response.data;
  }

  /**
   * Отмена приглашения
   */
  static async cancelInvitation(id: string): Promise<Invitation> {
    const response = await apiClient.post(`/api/invitations/${id}/cancel`);
    return response.data;
  }

  /**
   * Повторная отправка приглашения
   */
  static async resendInvitation(id: string): Promise<Invitation> {
    const response = await apiClient.post(`/api/invitations/${id}/resend`);
    return response.data;
  }

  /**
   * Удаление приглашения
   */
  static async deleteInvitation(id: string): Promise<void> {
    await apiClient.delete(`/api/invitations/${id}`);
  }
}
