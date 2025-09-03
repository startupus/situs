import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { RealtimeEventsService } from '../realtime/realtime-events.service';
import { IntegrationProvider, IntegrationStatus } from '@prisma/client';
import { IntegrationRegistry } from './plugins/registry';
import { EmailIntegrationPlugin } from './plugins/email/email.integration';
import { N8nIntegrationPlugin } from './plugins/n8n/n8n.integration';
import { CommunicationService } from '../communication/communication.service';

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
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeEventsService,
    private readonly registry: IntegrationRegistry,
    private readonly comms: CommunicationService,
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
    return this.prisma.integration.findMany({ where: { projectId } });
  }

  async create(dto: CreateIntegrationDto) {
    const instanceKey = dto.instanceKey ?? 'default';
    const exists = await this.prisma.integration.findUnique({
      where: {
        projectId_provider_instanceKey: { projectId: dto.projectId, provider: dto.provider, instanceKey } as any,
      },
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
        secrets: dto.secrets ?? undefined,
      },
    });
    this.realtime.publish('integration_created', { id: created.id, projectId: dto.projectId });
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
        secrets: dto.secrets ?? undefined,
        isActive: dto.isActive ?? undefined,
        instanceKey: dto.instanceKey ?? undefined,
        status:
          dto.isActive === undefined ? undefined : dto.isActive ? IntegrationStatus.READY : IntegrationStatus.DISABLED,
      },
    });
    this.realtime.publish('integration_updated', { id, projectId: updated.projectId });
    if (dto.isActive !== undefined) {
      this.realtime.publish('integration_status_changed', { id, projectId: updated.projectId, status: updated.status });
    }
    return updated;
  }

  async test(id: string) {
    const integration = await this.prisma.integration.findUnique({ where: { id } });
    if (!integration) throw new NotFoundException('Integration not found');
    this.ensureRegistry();
    const plugin = this.registry.getPlugin(integration.provider);
    if (!plugin) return { success: false, status: 'ERROR' };
    return plugin.healthCheck(integration);
  }

  async remove(id: string) {
    const integration = await this.prisma.integration.findUnique({ where: { id } });
    if (!integration) throw new NotFoundException('Integration not found');
    await this.prisma.integration.delete({ where: { id } });
    this.realtime.publish('integration_deleted', { id, projectId: integration.projectId });
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
    const items = Array.isArray(raw) ? raw : Array.isArray((raw as any)?.data) ? (raw as any).data : [];
    return { success: true, data: items };
  }
}
