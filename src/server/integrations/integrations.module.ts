import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { IntegrationsService } from './integrations.service';
import { IntegrationsController } from './integrations.controller';
import { RealtimeEventsService } from '../realtime/realtime-events.service';
import { CommunicationModule } from '../communication/communication.module';
import { IntegrationRegistry } from './plugins/registry';

@Module({
  imports: [DatabaseModule, CommunicationModule],
  controllers: [IntegrationsController],
  providers: [IntegrationsService, RealtimeEventsService, IntegrationRegistry],
  exports: [IntegrationsService, IntegrationRegistry],
})
export class IntegrationsModule {}


