import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TenantContextService } from './tenant-context.service';

/**
 * Tenant-aware Prisma service that automatically applies tenant filtering
 */
@Injectable()
export class TenantAwarePrismaService extends PrismaClient {
  private readonly logger = new Logger(TenantAwarePrismaService.name);

  constructor(private readonly tenantContextService: TenantContextService) {
    super();
  }

  /**
   * Get tenant-aware Prisma client
   */
  get client() {
    const tenantId = this.tenantContextService.getTenantId();
    if (!tenantId) {
      throw new Error('No tenant context set. Ensure TenantMiddleware is applied.');
    }
    return this;
  }

  /**
   * Create entity with tenant context
   */
  async create<T>(model: string, data: any, options?: { include?: any; select?: any }): Promise<T> {
    const tenantId = this.tenantContextService.getTenantId();
    if (!tenantId) {
      throw new Error('No tenant context set');
    }

    const tenantAwareData = {
      ...data,
      tenantId,
    };

    this.logger.debug(`Creating ${model} with tenant ${tenantId}`);
    return (this as any)[model].create({
      data: tenantAwareData,
      ...options,
    });
  }

  /**
   * Find many entities with tenant filtering
   */
  async findMany<T>(
    model: string,
    where: any = {},
    options?: { include?: any; select?: any; orderBy?: any; take?: number; skip?: number },
  ): Promise<T[]> {
    const tenantId = this.tenantContextService.getTenantId();
    if (!tenantId) {
      throw new Error('No tenant context set');
    }

    const tenantAwareWhere = {
      ...where,
      tenantId,
    };

    this.logger.debug(`Finding ${model} with tenant ${tenantId}`);
    return (this as any)[model].findMany({
      where: tenantAwareWhere,
      ...options,
    });
  }

  /**
   * Find unique entity with tenant filtering
   */
  async findUnique<T>(model: string, where: any, options?: { include?: any; select?: any }): Promise<T | null> {
    const tenantId = this.tenantContextService.getTenantId();
    if (!tenantId) {
      throw new Error('No tenant context set');
    }

    const tenantAwareWhere = {
      ...where,
      tenantId,
    };

    this.logger.debug(`Finding unique ${model} with tenant ${tenantId}`);
    return (this as any)[model].findUnique({
      where: tenantAwareWhere,
      ...options,
    });
  }

  /**
   * Update entity with tenant filtering
   */
  async update<T>(model: string, where: any, data: any, options?: { include?: any; select?: any }): Promise<T> {
    const tenantId = this.tenantContextService.getTenantId();
    if (!tenantId) {
      throw new Error('No tenant context set');
    }

    const tenantAwareWhere = {
      ...where,
      tenantId,
    };

    this.logger.debug(`Updating ${model} with tenant ${tenantId}`);
    return (this as any)[model].update({
      where: tenantAwareWhere,
      data,
      ...options,
    });
  }

  /**
   * Delete entity with tenant filtering
   */
  async delete<T>(model: string, where: any, options?: { include?: any; select?: any }): Promise<T> {
    const tenantId = this.tenantContextService.getTenantId();
    if (!tenantId) {
      throw new Error('No tenant context set');
    }

    const tenantAwareWhere = {
      ...where,
      tenantId,
    };

    this.logger.debug(`Deleting ${model} with tenant ${tenantId}`);
    return (this as any)[model].delete({
      where: tenantAwareWhere,
      ...options,
    });
  }

  /**
   * Count entities with tenant filtering
   */
  async count(model: string, where: any = {}): Promise<number> {
    const tenantId = this.tenantContextService.getTenantId();
    if (!tenantId) {
      throw new Error('No tenant context set');
    }

    const tenantAwareWhere = {
      ...where,
      tenantId,
    };

    this.logger.debug(`Counting ${model} with tenant ${tenantId}`);
    return (this as any)[model].count({
      where: tenantAwareWhere,
    });
  }

  /**
   * Execute raw query with tenant context
   */
  async executeRaw<T = any>(query: string, ...params: any[]): Promise<T> {
    const tenantId = this.tenantContextService.getTenantId();
    if (!tenantId) {
      throw new Error('No tenant context set');
    }

    this.logger.debug(`Executing raw query with tenant ${tenantId}`);
    return this.$queryRawUnsafe(query, ...params);
  }

  /**
   * Execute transaction with tenant context
   */
  async transaction<T>(fn: (prisma: any) => Promise<T>): Promise<T> {
    const tenantId = this.tenantContextService.getTenantId();
    if (!tenantId) {
      throw new Error('No tenant context set');
    }

    this.logger.debug(`Executing transaction with tenant ${tenantId}`);
    return this.$transaction(fn);
  }

  /**
   * Check if entity exists with tenant filtering
   */
  async exists(model: string, where: any = {}): Promise<boolean> {
    const count = await this.count(model, where);
    return count > 0;
  }

  /**
   * Get tenant statistics
   */
  async getTenantStats(): Promise<{
    projects: number;
    products: number;
    users: number;
    media: number;
  }> {
    const tenantId = this.tenantContextService.getTenantId();
    if (!tenantId) {
      throw new Error('No tenant context set');
    }

    const [projects, products, users, media] = await Promise.all([
      this.count('project', {}),
      this.count('product', {}),
      this.count('user', {}),
      this.count('media', {}),
    ]);

    return {
      projects,
      products,
      users,
      media,
    };
  }
}
