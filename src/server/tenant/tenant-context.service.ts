import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface TenantContext {
  tenantId: string;
  userId?: string;
  projectId?: string;
  accountId?: string;
}

@Injectable()
export class TenantContextService {
  private readonly logger = new Logger(TenantContextService.name);
  private readonly tenantContext = new Map<string, TenantContext>();

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Set tenant context for current request
   */
  async setTenantContext(
    tenantId: string,
    userId?: string,
    projectId?: string,
    accountId?: string
  ): Promise<void> {
    try {
      // Validate tenant exists and user has access
      if (userId) {
        const hasAccess = await this.validateTenantAccess(userId, tenantId);
        if (!hasAccess) {
          throw new Error(`User ${userId} does not have access to tenant ${tenantId}`);
        }
      }

      // Set PostgreSQL session variable for RLS
      await this.prisma.$executeRaw`SELECT set_tenant_context(${tenantId})`;

      // Store context in memory for current request
      const context: TenantContext = {
        tenantId,
        userId,
        projectId,
        accountId,
      };

      this.tenantContext.set(this.getContextKey(), context);
      
      this.logger.debug(`Tenant context set: ${tenantId}`, { context });
    } catch (error) {
      this.logger.error(`Failed to set tenant context: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get current tenant context
   */
  getCurrentTenantContext(): TenantContext | null {
    return this.tenantContext.get(this.getContextKey()) || null;
  }

  /**
   * Get current tenant ID
   */
  getCurrentTenantId(): string | null {
    const context = this.getCurrentTenantContext();
    return context?.tenantId || null;
  }

  /**
   * Get current user ID
   */
  getCurrentUserId(): string | null {
    const context = this.getCurrentTenantContext();
    return context?.userId || null;
  }

  /**
   * Get current project ID
   */
  getCurrentProjectId(): string | null {
    const context = this.getCurrentTenantContext();
    return context?.projectId || null;
  }

  /**
   * Get current account ID
   */
  getCurrentAccountId(): string | null {
    const context = this.getCurrentTenantContext();
    return context?.accountId || null;
  }

  /**
   * Clear tenant context
   */
  clearTenantContext(): void {
    this.tenantContext.delete(this.getContextKey());
    this.logger.debug('Tenant context cleared');
  }

  /**
   * Validate user has access to tenant
   */
  private async validateTenantAccess(userId: string, tenantId: string): Promise<boolean> {
    try {
      const result = await this.prisma.$queryRaw<[{ validate_tenant_access: boolean }]>`
        SELECT validate_tenant_access(${userId}, ${tenantId}) as validate_tenant_access
      `;
      
      return result[0]?.validate_tenant_access || false;
    } catch (error) {
      this.logger.error(`Failed to validate tenant access: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * Get context key for current request
   * In a real application, this would use request ID or similar
   */
  private getContextKey(): string {
    // For now, use a simple key. In production, use request ID
    return 'current_request';
  }

  /**
   * Create tenant-aware Prisma client
   */
  getTenantAwarePrisma() {
    const tenantId = this.getCurrentTenantId();
    if (!tenantId) {
      throw new Error('No tenant context set');
    }

    return this.prisma;
  }

  /**
   * Execute query with tenant context
   */
  async executeWithTenantContext<T>(
    tenantId: string,
    operation: (prisma: PrismaService) => Promise<T>
  ): Promise<T> {
    const originalContext = this.getCurrentTenantContext();
    
    try {
      await this.setTenantContext(tenantId);
      return await operation(this.prisma);
    } finally {
      if (originalContext) {
        await this.setTenantContext(
          originalContext.tenantId,
          originalContext.userId,
          originalContext.projectId,
          originalContext.accountId
        );
      } else {
        this.clearTenantContext();
      }
    }
  }
}
