import { Integration, IntegrationProvider } from '@prisma/client';

export interface IntegrationCapabilityMap {
  sendMessage?: boolean;
  importData?: boolean;
  exportData?: boolean;
  healthCheck?: boolean;
}

export interface IntegrationMeta {
  key: IntegrationProvider;
  name: string;
  category: string;
  version: string;
  capabilities: IntegrationCapabilityMap;
}

export interface HealthStatus {
  success: boolean;
  status: 'READY' | 'DISABLED' | 'ERROR';
  detail?: string;
}

export interface IntegrationPlugin {
  getMeta(): IntegrationMeta;
  healthCheck(instance: Integration): Promise<HealthStatus>;
}


