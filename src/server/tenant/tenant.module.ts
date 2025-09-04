import { Module } from '@nestjs/common';
import { TenantContextService } from './tenant-context.service';
import { TenantResolutionService } from './tenant-resolution.service';
import { TenantMiddleware } from './tenant.middleware';
import { TenantAwarePrismaService } from './tenant-aware-prisma.service';
import { TenantController } from './tenant.controller';
import { ValidationModule } from '../../validation/validation.module';

@Module({
  imports: [ValidationModule],
  controllers: [TenantController],
  providers: [TenantContextService, TenantResolutionService, TenantMiddleware, TenantAwarePrismaService],
  exports: [TenantContextService, TenantResolutionService, TenantMiddleware, TenantAwarePrismaService],
})
export class TenantModule {}
