import { apiClient } from '../../api/client';

export type IntegrationProviderKey = 'EMAIL_SMTP' | 'WEBHOOK_GENERIC' | 'N8N';

export interface IntegrationProviderMeta {
  key: IntegrationProviderKey;
  name: string;
  category: string;
  version: string;
  capabilities: Record<string, boolean>;
}

export interface IntegrationInstance {
  id: string;
  projectId: string;
  provider: IntegrationProviderKey;
  instanceKey: string;
  title?: string;
  version?: string;
  isActive: boolean;
  status: 'READY' | 'DISABLED' | 'ERROR';
  config?: any;
  secrets?: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIntegrationRequest {
  projectId: string;
  provider: IntegrationProviderKey;
  instanceKey?: string;
  title?: string;
  config?: any;
  secrets?: any;
}

export interface UpdateIntegrationRequest {
  title?: string;
  config?: any;
  secrets?: any;
  isActive?: boolean;
  instanceKey?: string;
}

class IntegrationsApiService {
  private readonly base = '/api/integrations';

  async listProviders(): Promise<IntegrationProviderMeta[]> {
    return apiClient.get<IntegrationProviderMeta[]>(`${this.base}/providers`);
  }

  async listByProject(projectId: string): Promise<IntegrationInstance[]> {
    return apiClient.get<IntegrationInstance[]>(`${this.base}`, { projectId });
  }

  async create(req: CreateIntegrationRequest): Promise<IntegrationInstance> {
    return apiClient.post<IntegrationInstance>(this.base, req);
  }

  async update(id: string, req: UpdateIntegrationRequest): Promise<IntegrationInstance> {
    return apiClient.patch<IntegrationInstance>(`${this.base}/${id}`, req);
  }

  async test(id: string): Promise<{ success: boolean; status: string; detail?: string }> {
    return apiClient.post(`${this.base}/${id}/test`, {});
  }

  async listN8nWorkflows(id: string, baseUrl?: string, apiKey?: string): Promise<any[]> {
    const params: Record<string,string> = {};
    if (baseUrl) params.baseUrl = baseUrl;
    if (apiKey) params.apiKey = apiKey;
    const query = Object.keys(params).length ? `?${new URLSearchParams(params).toString()}` : '';
    const res = await apiClient.get<{ success: boolean; data: any[] }>(`${this.base}/${id}/n8n/workflows${query}`);
    return (res as any).data || [];
  }

  async remove(id: string): Promise<{ success: boolean }> {
    return apiClient.delete(`${this.base}/${id}`);
  }

  async previewEmail(id: string, template?: string, variables?: Record<string, any>): Promise<{ success: boolean; preview?: string; error?: string }> {
    return apiClient.post(`${this.base}/${id}/email/preview`, { template, variables });
  }
}

export const integrationsApi = new IntegrationsApiService();


