import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TenantMonitoringService } from './tenant-monitoring.service';
import { TenantMonitoringController } from './tenant-monitoring.controller';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TenantModule,
  ],
  controllers: [TenantMonitoringController],
  providers: [TenantMonitoringService],
  exports: [TenantMonitoringService],
})
export class TenantMonitoringModule {}
