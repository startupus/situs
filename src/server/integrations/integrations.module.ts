import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { IntegrationsService } from './integrations.service';
import { IntegrationsController } from './integrations.controller';
import { RealtimeModule } from '../realtime/realtime.module';
import { CommunicationModule } from '../communication/communication.module';
import { IntegrationRegistry } from './plugins/registry';
import { IntegrationWebhooksService } from './webhooks.service';
import { IntegrationEncryptionService } from './encryption.service';

@Module({
  imports: [DatabaseModule, CommunicationModule, RealtimeModule, ConfigModule],
  controllers: [IntegrationsController],
  providers: [IntegrationsService, IntegrationRegistry, IntegrationWebhooksService, IntegrationEncryptionService],
  exports: [IntegrationsService, IntegrationRegistry, IntegrationWebhooksService, IntegrationEncryptionService],
})
export class IntegrationsModule {}


