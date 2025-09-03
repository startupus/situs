import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { TenantContextService } from './tenant-context.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  private readonly logger = new Logger(TenantGuard.name);

  constructor(private readonly tenantContextService: TenantContextService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tenant = request.tenant;

    if (!tenant) {
      this.logger.warn('No tenant context found in request');
      throw new ForbiddenException('Tenant context required');
    }

    const tenantId = tenant.id;
    const userId = this.extractUserIdFromRequest(request);

    if (!tenantId) {
      this.logger.warn('No tenant ID found in request');
      throw new ForbiddenException('Tenant ID required');
    }

    // Validate tenant access if user is authenticated
    if (userId) {
      const hasAccess = await this.validateUserTenantAccess(userId, tenantId);
      if (!hasAccess) {
        this.logger.warn(`User ${userId} does not have access to tenant ${tenantId}`);
        throw new ForbiddenException('Access denied to tenant');
      }
    }

    // Validate tenant confidence level
    if (tenant.confidence === 'low') {
      this.logger.warn(`Low confidence tenant resolution: ${tenantId}`);
      // Allow but log warning
    }

    return true;
  }

  /**
   * Extract user ID from request
   */
  private extractUserIdFromRequest(request: any): string | null {
    // Try to get from JWT token
    const authHeader = request.headers?.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const payload = this.decodeJWT(token);
        return payload?.userId || payload?.sub || null;
      } catch (error) {
        this.logger.debug(`Failed to extract user ID from token: ${error.message}`);
      }
    }

    // Try to get from request body or query params
    return request.body?.userId || request.query?.userId || null;
  }

  /**
   * Validate user has access to tenant
   */
  private async validateUserTenantAccess(userId: string, tenantId: string): Promise<boolean> {
    try {
      // This would typically check against a user-tenant mapping table
      // For now, we'll use the tenant context service validation
      const currentTenantId = this.tenantContextService.getCurrentTenantId();
      return currentTenantId === tenantId;
    } catch (error) {
      this.logger.error(`Failed to validate user tenant access: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * Decode JWT token (simplified version)
   */
  private decodeJWT(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = parts[1];
      const decoded = Buffer.from(payload, 'base64url').toString('utf-8');
      return JSON.parse(decoded);
    } catch (error) {
      return null;
    }
  }
}

/**
 * Guard for high-confidence tenant resolution only
 */
@Injectable()
export class HighConfidenceTenantGuard extends TenantGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tenant = request.tenant;

    if (!tenant || tenant.confidence !== 'high') {
      throw new ForbiddenException('High confidence tenant resolution required');
    }

    return super.canActivate(context);
  }
}

/**
 * Guard for specific tenant access
 */
@Injectable()
export class SpecificTenantGuard implements CanActivate {
  private readonly logger = new Logger(SpecificTenantGuard.name);

  constructor(private readonly allowedTenants: string[]) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tenant = request.tenant;

    if (!tenant) {
      throw new ForbiddenException('Tenant context required');
    }

    if (!this.allowedTenants.includes(tenant.id)) {
      this.logger.warn(`Access denied to tenant ${tenant.id}. Allowed: ${this.allowedTenants.join(', ')}`);
      throw new ForbiddenException('Access denied to tenant');
    }

    return true;
  }
}
