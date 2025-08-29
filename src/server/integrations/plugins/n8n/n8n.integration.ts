import { Integration, IntegrationProvider } from '@prisma/client';
import { HealthStatus, IntegrationMeta, IntegrationPlugin } from '../integration.types';

/**
 * N8nIntegrationPlugin
 * Минимальная реализация провайдера N8N: метаданные + healthCheck по конфигу.
 * В следующих итерациях будет добавлен trigger(actionKey, payload) и верификация через webhook/API.
 */
export class N8nIntegrationPlugin implements IntegrationPlugin {
  getMeta(): IntegrationMeta {
    return {
      key: IntegrationProvider.N8N,
      name: 'n8n',
      category: 'AUTOMATION',
      version: '1.0.0',
      capabilities: { healthCheck: true },
    };
  }

  async healthCheck(instance: Integration): Promise<HealthStatus> {
    try {
      const config: any = instance.config || {};
      const baseUrl: string | undefined = config.baseUrl;
      if (!baseUrl) {
        return { success: false, status: 'ERROR', detail: 'N8N baseUrl is not configured' };
      }
      // Базовая валидация URL
      new URL(baseUrl);
      // Если указан apiKey — пробуем обратиться к /rest/workflows (n8n REST API)
      const apiKey: string | undefined = config?.auth?.apiKey;
      if (typeof fetch === 'function' && apiKey) {
        // Публичный API n8n: /api/v1 (см. https://docs.n8n.io/api/)
        const url = `${baseUrl.replace(/\/$/, '')}/api/v1/workflows?limit=1`;
        const res = await fetch(url, { headers: { 'X-N8N-API-KEY': apiKey } } as any).catch((e: any) => {
          throw new Error(`Network error: ${e?.message || e}`);
        });
        if (res.ok) {
          return { success: true, status: 'READY', detail: 'REST API reachable' };
        }
        if (res.status === 401 || res.status === 403) {
          return { success: false, status: 'ERROR', detail: `REST auth failed (${res.status})` };
        }
        return { success: false, status: 'ERROR', detail: `REST error (${res.status})` };
      }
      // Без apiKey проверяем только валидность baseUrl
      return { success: true, status: 'READY', detail: 'Base URL configured' };
    } catch (e: any) {
      return { success: false, status: 'ERROR', detail: e?.message || 'Invalid configuration' };
    }
  }
}


