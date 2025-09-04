import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantResolutionService, TenantResolutionResult } from './tenant-resolution.service';
import { TenantContextService } from './tenant-context.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantMiddleware.name);

  constructor(
    private readonly tenantResolutionService: TenantResolutionService,
    private readonly tenantContextService: TenantContextService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract user ID from JWT token if available
      const userId = this.extractUserIdFromRequest(req);

      // Resolve tenant from request
      const tenantResult: TenantResolutionResult = await this.tenantResolutionService.resolveTenant(req);

      this.logger.debug(
        `Tenant resolved: ${tenantResult.tenantId} (${tenantResult.method}, ${tenantResult.confidence})`,
      );

      // Set tenant context
      this.tenantContextService.setTenantContext({
        tenantId: tenantResult.tenantId,
        userId,
      });

      // Add tenant info to request for downstream use
      req['tenant'] = {
        id: tenantResult.tenantId,
        method: tenantResult.method,
        confidence: tenantResult.confidence,
      };
      // Also expose full tenant context for decorators expecting it
      req['tenantContext'] = this.tenantContextService.getTenantContext() || undefined;

      // Add tenant info to response headers for debugging
      res.setHeader('X-Tenant-ID', tenantResult.tenantId);
      res.setHeader('X-Tenant-Method', tenantResult.method);
      res.setHeader('X-Tenant-Confidence', tenantResult.confidence);

      next();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(`Tenant middleware error: ${err.message}`, err.stack);

      // Fallback to default tenant
      try {
        await this.tenantContextService.setTenantContext({ tenantId: 'default' });
        req['tenant'] = {
          id: 'default',
          method: 'default',
          confidence: 'low',
        };
        req['tenantContext'] = this.tenantContextService.getTenantContext() || undefined;
        next();
      } catch (fallbackError) {
        const ferr = fallbackError instanceof Error ? fallbackError : new Error(String(fallbackError));
        this.logger.error(`Fallback tenant setup failed: ${ferr.message}`, ferr.stack);
        res.status(500).json({
          error: 'Tenant resolution failed',
          message: 'Unable to determine tenant context',
        });
      }
    }
  }

  /**
   * Extract user ID from JWT token in Authorization header
   */
  private extractUserIdFromRequest(req: Request): string | undefined {
    try {
      const authHeader = req.get('Authorization');
      if (!authHeader?.startsWith('Bearer ')) return undefined;

      const token = authHeader.substring(7);
      const payload = this.decodeJWT(token);

      return payload?.userId || payload?.sub;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.debug(`Failed to extract user ID from token: ${err.message}`);
      return undefined;
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
