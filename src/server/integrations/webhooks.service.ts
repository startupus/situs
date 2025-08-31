import { Injectable, Logger } from '@nestjs/common';
import { Integration } from '@prisma/client';

export interface WebhookPayload {
  event: string;
  timestamp: string;
  integration: {
    id: string;
    projectId: string;
    provider: string;
    instanceKey: string;
    title?: string;
    status: string;
    isActive: boolean;
  };
  changes?: Record<string, any>;
}

export interface WebhookConfig {
  url: string;
  secret?: string;
  events: string[]; // ['integration_created', 'integration_updated', etc.]
  headers?: Record<string, string>;
}

@Injectable()
export class IntegrationWebhooksService {
  private readonly logger = new Logger(IntegrationWebhooksService.name);
  private webhookConfigs: WebhookConfig[] = [];

  /**
   * Register webhook endpoints for integration events
   */
  registerWebhook(config: WebhookConfig) {
    this.webhookConfigs.push(config);
    this.logger.log(`Registered webhook: ${config.url} for events: ${config.events.join(', ')}`);
  }

  /**
   * Send webhook notification for integration changes
   */
  async notifyWebhooks(event: string, integration: Integration, changes?: Record<string, any>) {
    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      integration: {
        id: integration.id,
        projectId: integration.projectId,
        provider: integration.provider,
        instanceKey: integration.instanceKey,
        title: integration.title || undefined,
        status: integration.status,
        isActive: integration.isActive,
      },
      changes
    };

    const relevantWebhooks = this.webhookConfigs.filter(config => 
      config.events.includes(event) || config.events.includes('*')
    );

    if (relevantWebhooks.length === 0) {
      return;
    }

    const promises = relevantWebhooks.map(config => this.sendWebhook(config, payload));
    
    try {
      await Promise.allSettled(promises);
    } catch (error) {
      this.logger.error('Error sending webhooks:', error);
    }
  }

  private async sendWebhook(config: WebhookConfig, payload: WebhookPayload) {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'Situs-Integrations/1.0',
        ...config.headers
      };

      // Add HMAC signature if secret is configured
      if (config.secret) {
        const crypto = require('crypto');
        const signature = crypto
          .createHmac('sha256', config.secret)
          .update(JSON.stringify(payload))
          .digest('hex');
        headers['X-Situs-Signature'] = `sha256=${signature}`;
      }

      const response = await fetch(config.url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      this.logger.log(`Webhook sent successfully to ${config.url} for event ${payload.event}`);
    } catch (error: any) {
      this.logger.error(`Failed to send webhook to ${config.url}:`, error?.message || error);
    }
  }

  /**
   * Get registered webhook configurations (for admin/debugging)
   */
  getWebhookConfigs(): Omit<WebhookConfig, 'secret'>[] {
    return this.webhookConfigs.map(config => ({
      url: config.url,
      events: config.events,
      headers: config.headers
    }));
  }
}