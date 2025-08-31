import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { IntegrationsService } from './integrations.service';
import { IntegrationsController } from './integrations.controller';
import { RealtimeModule } from '../realtime/realtime.module';
import { CommunicationModule } from '../communication/communication.module';
import { IntegrationRegistry } from './plugins/registry';

@Module({
  imports: [DatabaseModule, CommunicationModule, RealtimeModule],
  controllers: [IntegrationsController],
  providers: [IntegrationsService, IntegrationRegistry],
  exports: [IntegrationsService, IntegrationRegistry],
})
export class IntegrationsModule {}


