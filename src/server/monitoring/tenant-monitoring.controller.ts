import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as ApiResponseDecorator, ApiBearerAuth } from '@nestjs/swagger';
import { TenantMonitoringService, TenantMetrics, TenantAlert } from './tenant-monitoring.service';
import { TenantGuard } from '../tenant/tenant.guard';
import { CurrentTenant } from '../tenant/tenant.decorator';
import { TenantContext } from '../../types/tenant/tenant-context.types';
import { ApiResponse } from '../../types/shared/api.types';
import { Logger } from '@nestjs/common';

@ApiTags('Tenant Monitoring')
@ApiBearerAuth()
@Controller('monitoring')
@UseInterceptors(ClassSerializerInterceptor)
export class TenantMonitoringController {
  private readonly logger = new Logger(TenantMonitoringController.name);

  constructor(private readonly monitoringService: TenantMonitoringService) {}

  @Get('metrics')
  @UseGuards(TenantGuard)
  @ApiOperation({ summary: 'Get current tenant metrics' })
  @ApiResponseDecorator({ status: 200, description: 'Tenant metrics retrieved successfully' })
  async getCurrentTenantMetrics(@CurrentTenant() tenantContext: TenantContext): Promise<ApiResponse<TenantMetrics>> {
    this.logger.log(`Fetching metrics for tenant: ${tenantContext.tenantId}`);

    try {
      const metrics = await this.monitoringService.getCurrentTenantMetrics();

      if (!metrics) {
        return {
          success: false,
          data: undefined,
          message: 'No metrics available for current tenant',
          statusCode: HttpStatus.NOT_FOUND,
        };
      }

      return {
        success: true,
        data: metrics,
        message: 'Tenant metrics retrieved successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(`Failed to get metrics for tenant ${tenantContext.tenantId}`, err);
      return {
        success: false,
        data: undefined,
        message: 'Failed to retrieve tenant metrics',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  @Get('alerts')
  @UseGuards(TenantGuard)
  @ApiOperation({ summary: 'Get current tenant alerts' })
  @ApiResponseDecorator({ status: 200, description: 'Tenant alerts retrieved successfully' })
  async getCurrentTenantAlerts(@CurrentTenant() tenantContext: TenantContext): Promise<ApiResponse<TenantAlert[]>> {
    this.logger.log(`Fetching alerts for tenant: ${tenantContext.tenantId}`);

    try {
      const alerts = await this.monitoringService.getCurrentTenantAlerts();

      return {
        success: true,
        data: alerts,
        message: 'Tenant alerts retrieved successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(`Failed to get alerts for tenant ${tenantContext.tenantId}`, err);
      return {
        success: false,
        data: [],
        message: 'Failed to retrieve tenant alerts',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  @Post('alerts/:alertId/resolve')
  @UseGuards(TenantGuard)
  @ApiOperation({ summary: 'Resolve a tenant alert' })
  @ApiResponseDecorator({ status: 200, description: 'Alert resolved successfully' })
  async resolveAlert(
    @CurrentTenant() tenantContext: TenantContext,
    @Param('alertId') alertId: string,
  ): Promise<ApiResponse<{ alertId: string; resolved: boolean }>> {
    this.logger.log(`Resolving alert ${alertId} for tenant: ${tenantContext.tenantId}`);

    try {
      await this.monitoringService.resolveAlert(alertId);

      return {
        success: true,
        data: { alertId, resolved: true },
        message: 'Alert resolved successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error(`Failed to resolve alert ${alertId} for tenant ${tenantContext.tenantId}`, error);
      return {
        success: false,
        data: { alertId, resolved: false },
        message: 'Failed to resolve alert',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  @Get('health')
  @UseGuards(TenantGuard)
  @ApiOperation({ summary: 'Get tenant health status' })
  @ApiResponseDecorator({ status: 200, description: 'Tenant health status retrieved successfully' })
  async getTenantHealth(
    @CurrentTenant() tenantContext: TenantContext,
  ): Promise<ApiResponse<{ status: 'HEALTHY' | 'WARNING' | 'CRITICAL'; score: number; message: string }>> {
    this.logger.log(`Checking health for tenant: ${tenantContext.tenantId}`);

    try {
      const metrics = await this.monitoringService.getCurrentTenantMetrics();

      if (!metrics) {
        return {
          success: false,
          data: undefined,
          message: 'No health data available for current tenant',
          statusCode: HttpStatus.NOT_FOUND,
        };
      }

      let status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
      let message: string;

      if (metrics.healthScore >= 80) {
        status = 'HEALTHY';
        message = 'Tenant is operating normally';
      } else if (metrics.healthScore >= 50) {
        status = 'WARNING';
        message = 'Tenant has some performance issues';
      } else {
        status = 'CRITICAL';
        message = 'Tenant requires immediate attention';
      }

      return {
        success: true,
        data: { status, score: metrics.healthScore, message },
        message: 'Tenant health status retrieved successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(`Failed to get health for tenant ${tenantContext.tenantId}`, err);
      return {
        success: false,
        data: undefined,
        message: 'Failed to retrieve tenant health status',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  @Post('metrics/refresh')
  @UseGuards(TenantGuard)
  @ApiOperation({ summary: 'Force refresh tenant metrics' })
  @ApiResponseDecorator({ status: 200, description: 'Metrics refreshed successfully' })
  async refreshTenantMetrics(@CurrentTenant() tenantContext: TenantContext): Promise<ApiResponse<TenantMetrics>> {
    this.logger.log(`Refreshing metrics for tenant: ${tenantContext.tenantId}`);

    try {
      const metrics = await this.monitoringService.collectMetricsForTenant(tenantContext.tenantId);

      return {
        success: true,
        data: metrics,
        message: 'Tenant metrics refreshed successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(`Failed to refresh metrics for tenant ${tenantContext.tenantId}`, err);
      return {
        success: false,
        data: undefined,
        message: 'Failed to refresh tenant metrics',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
