import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TenantContextService } from './tenant-context.service';
import { TenantAwarePrismaService } from './tenant-aware-prisma.service';
import { TenantGuard } from './tenant.guard';
import { Tenant, TenantId, TenantMethod } from './tenant.decorator';
import { ValidationService } from '../../validation/validation.service';
import {
  CreateTenantSchema,
  UpdateTenantSchema,
  CreateTenantInput,
  UpdateTenantInput,
} from '../../validation/tenant-validation.schemas';

@ApiTags('Tenant Management')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('api/tenant')
export class TenantController {
  constructor(
    private readonly tenantContextService: TenantContextService,
    private readonly tenantAwarePrisma: TenantAwarePrismaService,
    private readonly validationService: ValidationService,
  ) {}

  @Get('info')
  @ApiOperation({ summary: 'Get current tenant information' })
  @ApiResponse({ status: 200, description: 'Tenant information retrieved successfully' })
  async getTenantInfo(@Tenant() tenant: any, @TenantId() tenantId: string, @TenantMethod() method: string) {
    return {
      tenantId,
      method,
      confidence: tenant.confidence,
      context: this.tenantContextService.getTenantContext(),
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get tenant statistics' })
  @ApiResponse({ status: 200, description: 'Tenant statistics retrieved successfully' })
  async getTenantStats() {
    const stats = await this.tenantAwarePrisma.getTenantStats();
    return {
      success: true,
      data: stats,
      timestamp: new Date(),
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create new tenant' })
  @ApiResponse({ status: 201, description: 'Tenant created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createTenant(@Body() createTenantDto: CreateTenantInput) {
    // Validate input
    const validation = this.validationService.validate(CreateTenantSchema, createTenantDto);
    if (!validation.success) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: validation.errors,
        },
      };
    }

    try {
      const tenant = await this.tenantAwarePrisma.create('tenant', validation.data);
      return {
        success: true,
        data: tenant,
        message: 'Tenant created successfully',
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      return {
        success: false,
        error: {
          code: 'CREATE_ERROR',
          message: 'Failed to create tenant',
          details: err.message,
        },
      };
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update tenant' })
  @ApiResponse({ status: 200, description: 'Tenant updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async updateTenant(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantInput) {
    // Validate input
    const validation = this.validationService.validate(UpdateTenantSchema, updateTenantDto);
    if (!validation.success) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: validation.errors,
        },
      };
    }

    try {
      const tenant = await this.tenantAwarePrisma.update('tenant', { id }, validation.data);
      return {
        success: true,
        data: tenant,
        message: 'Tenant updated successfully',
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      return {
        success: false,
        error: {
          code: 'UPDATE_ERROR',
          message: 'Failed to update tenant',
          details: err.message,
        },
      };
    }
  }

  @Get('projects')
  @ApiOperation({ summary: 'Get tenant projects' })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
  async getTenantProjects(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    try {
      const where = search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {};

      const [projects, total] = await Promise.all([
        this.tenantAwarePrisma.findMany('project', where, {
          take: limit,
          skip: (page - 1) * limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.tenantAwarePrisma.count('project', where),
      ]);

      return {
        success: true,
        data: projects,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrevious: page > 1,
        },
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      return {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch projects',
          details: err.message,
        },
      };
    }
  }

  @Get('users')
  @ApiOperation({ summary: 'Get tenant users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async getTenantUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('role') role?: string,
  ) {
    try {
      const where = role ? { role } : {};

      const [users, total] = await Promise.all([
        this.tenantAwarePrisma.findMany('user', where, {
          take: limit,
          skip: (page - 1) * limit,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            username: true,
            email: true,
            globalRole: true,
            status: true,
            createdAt: true,
          },
        }),
        this.tenantAwarePrisma.count('user', where),
      ]);

      return {
        success: true,
        data: users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrevious: page > 1,
        },
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      return {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch users',
          details: err.message,
        },
      };
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete tenant' })
  @ApiResponse({ status: 204, description: 'Tenant deleted successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async deleteTenant(@Param('id') id: string) {
    try {
      await this.tenantAwarePrisma.delete('tenant', { id });
      return {
        success: true,
        message: 'Tenant deleted successfully',
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      return {
        success: false,
        error: {
          code: 'DELETE_ERROR',
          message: 'Failed to delete tenant',
          details: err.message,
        },
      };
    }
  }
}
