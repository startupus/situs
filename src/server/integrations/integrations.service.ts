import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { RealtimeEventsService } from '../realtime/realtime-events.service';
import { IntegrationProvider, IntegrationStatus } from '@prisma/client';
import { IntegrationRegistry } from './plugins/registry';
import { EmailIntegrationPlugin } from './plugins/email/email.integration';
import { N8nIntegrationPlugin } from './plugins/n8n/n8n.integration';
import { CommunicationService } from '../communication/communication.service';
import { IntegrationWebhooksService } from './webhooks.service';
import { IntegrationEncryptionService } from './encryption.service';

export interface CreateIntegrationDto {
  projectId: string;
  provider: IntegrationProvider;
  instanceKey?: string;
  title?: string;
  config?: any;
  secrets?: any;
}

export interface UpdateIntegrationDto {
  title?: string;
  config?: any;
  secrets?: any;
  isActive?: boolean;
  instanceKey?: string;
}

@Injectable()
export class IntegrationsService {
  private healthCache = new Map<string, { result: any; timestamp: number }>();
  private testRateLimit = new Map<string, number[]>(); // integrationId -> timestamps array
  private readonly CACHE_TTL = 60000; // 60 seconds
  private readonly RATE_LIMIT_WINDOW = 60000; // 60 seconds
  private readonly RATE_LIMIT_MAX = 10; // max 10 tests per minute per integration

  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeEventsService,
    private readonly registry: IntegrationRegistry,
    private readonly comms: CommunicationService,
    private readonly webhooks: IntegrationWebhooksService,
    private readonly encryption: IntegrationEncryptionService,
  ) {}

  private ensureRegistry() {
    // Регистрируем провайдеры один раз (простой вариант)
    // В будущем вынести в фабрику/модуль с lazy-init
    if (!this.registry.getPlugin('EMAIL_SMTP' as any)) {
      this.registry.register(new EmailIntegrationPlugin(this.comms));
    }
    if (!this.registry.getPlugin('N8N' as any)) {
      this.registry.register(new N8nIntegrationPlugin());
    }
  }

  async listProviders() {
    this.ensureRegistry();
    return this.registry.getProvidersMeta();
  }

  async listByProject(projectId: string) {
    const integrations = await this.prisma.integration.findMany({ where: { projectId } });
    // Return integrations with decrypted secrets for internal use
    return integrations.map(integration => ({
      ...integration,
      secrets: this.encryption.retrieveSecrets(integration.secrets as string)
    }));
  }

  async create(dto: CreateIntegrationDto) {
    const instanceKey = dto.instanceKey ?? 'default';
    const exists = await this.prisma.integration.findUnique({
      where: { projectId_provider_instanceKey: { projectId: dto.projectId, provider: dto.provider, instanceKey } as any },
    });
    if (exists) throw new BadRequestException('Integration already exists');

    const created = await this.prisma.integration.create({
      data: {
        projectId: dto.projectId,
        provider: dto.provider,
        instanceKey,
        title: dto.title ?? null,
        version: '1.0.0',
        isActive: false,
        status: IntegrationStatus.DISABLED,
        config: dto.config ?? undefined,
        // Prisma Json field: нельзя передавать null; либо undefined, либо валидный JSON
        secrets: (() => {
          const processed = this.encryption.processSecrets(dto.secrets);
          return processed === null ? undefined : processed;
        })(),
      },
    });
    this.realtime.publish('integration_created', { id: created.id, projectId: dto.projectId });
    await this.webhooks.notifyWebhooks('integration_created', created);
    return created;
  }

  async update(id: string, dto: UpdateIntegrationDto) {
    const integration = await this.prisma.integration.findUnique({ where: { id } });
    if (!integration) throw new NotFoundException('Integration not found');

    // Проверим уникальность при смене instanceKey
    if (dto.instanceKey && dto.instanceKey !== (integration as any).instanceKey) {
      const conflict = await this.prisma.integration.findFirst({
        where: {
          projectId: integration.projectId,
          provider: integration.provider,
          instanceKey: dto.instanceKey,
          NOT: { id },
        },
      });
      if (conflict) throw new BadRequestException('Integration with this instanceKey already exists');
    }

    const updated = await this.prisma.integration.update({
      where: { id },
      data: {
        title: dto.title ?? undefined,
        config: dto.config ?? undefined,
        secrets: dto.secrets ? (() => {
          const processed = this.encryption.processSecrets(dto.secrets);
          return processed === null ? undefined : processed;
        })() : undefined,
        isActive: dto.isActive ?? undefined,
        instanceKey: dto.instanceKey ?? undefined,
        status: dto.isActive === undefined ? undefined : (dto.isActive ? IntegrationStatus.READY : IntegrationStatus.DISABLED),
      },
    });
    this.realtime.publish('integration_updated', { id, projectId: updated.projectId });
    if (dto.isActive !== undefined) {
      this.realtime.publish('integration_status_changed', { id, projectId: updated.projectId, status: updated.status });
    }
    await this.webhooks.notifyWebhooks('integration_updated', updated, dto);
    return updated;
  }

  private checkRateLimit(integrationId: string): boolean {
    const now = Date.now();
    const timestamps = this.testRateLimit.get(integrationId) || [];
    
    // Remove old timestamps outside the window
    const validTimestamps = timestamps.filter(ts => now - ts < this.RATE_LIMIT_WINDOW);
    
    if (validTimestamps.length >= this.RATE_LIMIT_MAX) {
      return false; // Rate limit exceeded
    }
    
    // Add current timestamp and update
    validTimestamps.push(now);
    this.testRateLimit.set(integrationId, validTimestamps);
    return true;
  }

  async test(id: string) {
    const integration = await this.prisma.integration.findUnique({ where: { id } });
    if (!integration) throw new NotFoundException('Integration not found');
    
    // Check rate limit
    if (!this.checkRateLimit(id)) {
      throw new BadRequestException('Rate limit exceeded. Please wait before testing again.');
    }
    
    // Check cache
    const cached = this.healthCache.get(id);
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
      return cached.result;
    }
    
    this.ensureRegistry();
    const plugin = this.registry.getPlugin(integration.provider);
    if (!plugin) {
      const result = { success: false, status: 'ERROR', detail: 'Plugin not found' };
      this.healthCache.set(id, { result, timestamp: Date.now() });
      return result;
    }
    
    let result: any;
    try {
      result = await plugin.healthCheck(integration);
    } catch (error: any) {
      result = { success: false, status: 'ERROR', detail: error?.message || 'Health check failed' };
    }
    
    // Cache the result
    this.healthCache.set(id, { result, timestamp: Date.now() });
    
    // Store health status in database
    await this.prisma.integration.update({
      where: { id },
      data: {
        // lastHealthCheck отсутствует в текущей схеме — сохраняем только healthStatus
        healthStatus: JSON.stringify(result)
      }
    });
    
    // Publish health change event
    this.realtime.publish('integration_health_changed', { 
      id, 
      projectId: integration.projectId, 
      health: result,
      timestamp: new Date().toISOString()
    });
    
    return result;
  }

  async remove(id: string) {
    const integration = await this.prisma.integration.findUnique({ where: { id } });
    if (!integration) throw new NotFoundException('Integration not found');
    
    // Clean up caches
    this.healthCache.delete(id);
    this.testRateLimit.delete(id);
    
    await this.prisma.integration.delete({ where: { id } });
    this.realtime.publish('integration_deleted', { id, projectId: integration.projectId });
    await this.webhooks.notifyWebhooks('integration_deleted', integration);
    return { success: true };
  }

  /**
   * Возвращает список воркфлоу из n8n REST API для указанного инстанса
   */
  async listN8nWorkflows(id: string, override?: { baseUrl?: string; apiKey?: string }) {
    const integration = await this.prisma.integration.findUnique({ where: { id } });
    if (!integration) throw new NotFoundException('Integration not found');
    if (integration.provider !== 'N8N') {
      throw new BadRequestException('Only N8N provider supports workflows listing');
    }
    const cfg: any = integration.config || {};
    const baseUrl: string | undefined = override?.baseUrl || cfg.baseUrl;
    const apiKey: string | undefined = override?.apiKey || cfg?.auth?.apiKey;
    if (!baseUrl || !apiKey) {
      throw new BadRequestException('N8N baseUrl or apiKey not configured');
    }
    // Публичный API n8n Community: /api/v1 (см. https://docs.n8n.io/api/)
    const url = `${String(baseUrl).replace(/\/$/, '')}/api/v1/workflows`;
    const res = await fetch(url, { headers: { 'X-N8N-API-KEY': apiKey } } as any).catch((e: any) => {
      throw new BadRequestException(`Network error: ${e?.message || e}`);
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new BadRequestException(`REST error ${res.status}: ${text || res.statusText}`);
    }
    const raw = await res.json().catch(() => []);
    const items = Array.isArray(raw) ? raw : (Array.isArray((raw as any)?.data) ? (raw as any).data : []);
    return { success: true, data: items };
  }

  /**
   * Предпросмотр email по шаблону для EMAIL_SMTP интеграций
   */
  async previewEmail(id: string, template?: string, variables?: Record<string, any>) {
    try {
      const integration = await this.prisma.integration.findUnique({ where: { id } });
      // Не падаем при отсутствии интеграции/неверном провайдере — делаем безопасный предпросмотр
      if (!integration || integration.provider !== 'EMAIL_SMTP') {
        const safeTemplate = template || 'Предпросмотр письма: {{userName}} → {{inviteLink}}';
        const fallbackVars = variables || {
          userName: 'Иван Иванов',
          inviteLink: 'https://example.com/invite/abc123',
          projectName: 'Тестовый проект',
          inviterName: 'Администратор',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU')
        };
        return this.comms.previewEmail(safeTemplate, fallbackVars);
      }

      // Получаем шаблон из настроек канала или используем переданный
      const settings = await this.comms.getChannelSettings('EMAIL' as any);
      const templateToUse = template || settings?.inviteTemplate || 'Нет шаблона';
      
      // Используем тестовые переменные если не переданы
      const testVariables = variables || {
        userName: 'Иван Иванов',
        inviteLink: 'https://example.com/invite/abc123',
        projectName: 'Тестовый проект',
        inviterName: 'Администратор',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU')
      };

      return this.comms.previewEmail(templateToUse, testVariables);
    } catch (error) {
      // На любых ошибках возвращаем безопасный предпросмотр, чтобы не падать 5xx
      const safeTemplate = template || 'Предпросмотр письма: {{userName}} → {{inviteLink}}';
      const fallbackVars = variables || {
        userName: 'Иван Иванов',
        inviteLink: 'https://example.com/invite/abc123',
        projectName: 'Тестовый проект',
        inviterName: 'Администратор',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU')
      };
      return this.comms.previewEmail(safeTemplate, fallbackVars);
    }
  }

  /**
   * Admin method to clear health cache
   */
  clearHealthCache() {
    this.healthCache.clear();
    this.testRateLimit.clear();
    return { success: true, message: 'Health cache cleared' };
  }
}
