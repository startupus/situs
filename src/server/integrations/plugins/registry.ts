import { IntegrationProvider } from '@prisma/client';
import { IntegrationMeta, IntegrationPlugin } from './integration.types';

export class IntegrationRegistry {
  private providers = new Map<IntegrationProvider, IntegrationPlugin>();

  register(plugin: IntegrationPlugin) {
    this.providers.set(plugin.getMeta().key, plugin);
  }

  getProvidersMeta(): IntegrationMeta[] {
    return Array.from(this.providers.values()).map((p) => p.getMeta());
  }

  getPlugin(key: IntegrationProvider): IntegrationPlugin | undefined {
    return this.providers.get(key);
  }
}
