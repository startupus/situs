import { Integration, IntegrationProvider } from '@prisma/client';
import { IntegrationMeta, IntegrationPlugin, HealthStatus } from '../integration.types';
import { CommunicationService } from '../../../communication/communication.service';

export class EmailIntegrationPlugin implements IntegrationPlugin {
  constructor(private readonly comms: CommunicationService) {}

  getMeta(): IntegrationMeta {
    return {
      key: 'EMAIL_SMTP' as IntegrationProvider,
      name: 'Email (SMTP)',
      category: 'EMAIL',
      version: '1.0.0',
      capabilities: { sendMessage: true, healthCheck: true },
    };
  }

  async healthCheck(instance: Integration): Promise<HealthStatus> {
    try {
      const settings = await this.comms.getChannelSettings('EMAIL' as any);
      if (!settings?.enabled) {
        return { success: false, status: 'ERROR', detail: 'EMAIL channel disabled' };
      }
      // Мини‑проверка: наличие host/port
      const ok = !!(settings.config && (settings.config as any).host);
      return { success: ok, status: ok ? 'READY' : 'ERROR', detail: ok ? 'OK' : 'No SMTP host' };
    } catch (e: any) {
      return { success: false, status: 'ERROR', detail: e?.message || 'Health check error' };
    }
  }
}
