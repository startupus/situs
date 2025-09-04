import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { TenantContextService } from './tenant-context.service';

export interface TenantResolutionResult {
  tenantId: string;
  method: 'subdomain' | 'header' | 'path' | 'jwt' | 'default';
  confidence: 'high' | 'medium' | 'low';
}

@Injectable()
export class TenantResolutionService {
  private readonly logger = new Logger(TenantResolutionService.name);
  private readonly tenantCache = new Map<string, { tenantId: string; expires: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(private readonly tenantContextService: TenantContextService) {}

  /**
   * Resolve tenant from request using multi-method approach
   * Priority: Subdomain > Header > Path > JWT > Default
   */
  async resolveTenant(request: Request): Promise<TenantResolutionResult> {
    try {
      // Method 1: Subdomain resolution (highest priority)
      const subdomainResult = this.resolveFromSubdomain(request);
      if (subdomainResult) {
        this.logger.debug(`Tenant resolved from subdomain: ${subdomainResult.tenantId}`);
        return subdomainResult;
      }

      // Method 2: Header resolution
      const headerResult = this.resolveFromHeader(request);
      if (headerResult) {
        this.logger.debug(`Tenant resolved from header: ${headerResult.tenantId}`);
        return headerResult;
      }

      // Method 3: Path resolution
      const pathResult = this.resolveFromPath(request);
      if (pathResult) {
        this.logger.debug(`Tenant resolved from path: ${pathResult.tenantId}`);
        return pathResult;
      }

      // Method 4: JWT token resolution
      const jwtResult = await this.resolveFromJWT(request);
      if (jwtResult) {
        this.logger.debug(`Tenant resolved from JWT: ${jwtResult.tenantId}`);
        return jwtResult;
      }

      // Method 5: Default tenant fallback
      const defaultResult = this.resolveDefaultTenant();
      this.logger.debug(`Tenant resolved from default: ${defaultResult.tenantId}`);
      return defaultResult;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(`Failed to resolve tenant: ${err.message}`, err.stack);
      return this.resolveDefaultTenant();
    }
  }

  /**
   * Resolve tenant from subdomain (tenant.situs.com)
   */
  private resolveFromSubdomain(request: Request): TenantResolutionResult | null {
    const host = request.get('host');
    if (!host) return null;

    const subdomain = this.extractSubdomain(host);
    if (!subdomain || subdomain === 'www' || subdomain === 'app') return null;

    // Validate subdomain format
    if (!this.isValidTenantId(subdomain)) return null;

    return {
      tenantId: subdomain,
      method: 'subdomain',
      confidence: 'high',
    };
  }

  /**
   * Resolve tenant from X-Tenant-ID header
   */
  private resolveFromHeader(request: Request): TenantResolutionResult | null {
    const tenantId = request.get('X-Tenant-ID');
    if (!tenantId || !this.isValidTenantId(tenantId)) return null;

    return {
      tenantId,
      method: 'header',
      confidence: 'high',
    };
  }

  /**
   * Resolve tenant from path (/tenant/tenant-id/...)
   */
  private resolveFromPath(request: Request): TenantResolutionResult | null {
    const path = request.path;
    const tenantPathMatch = path.match(/^\/tenant\/([^\/]+)/);

    if (!tenantPathMatch) return null;

    const tenantId = tenantPathMatch[1];
    if (!this.isValidTenantId(tenantId)) return null;

    return {
      tenantId,
      method: 'path',
      confidence: 'medium',
    };
  }

  /**
   * Resolve tenant from JWT token
   */
  private async resolveFromJWT(request: Request): Promise<TenantResolutionResult | null> {
    try {
      const authHeader = request.get('Authorization');
      if (!authHeader?.startsWith('Bearer ')) return null;

      const token = authHeader.substring(7);
      const payload = this.decodeJWT(token);

      if (!payload?.tenantId || !this.isValidTenantId(payload.tenantId)) return null;

      return {
        tenantId: payload.tenantId,
        method: 'jwt',
        confidence: 'high',
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.warn(`Failed to decode JWT: ${err.message}`);
      return null;
    }
  }

  /**
   * Resolve default tenant
   */
  private resolveDefaultTenant(): TenantResolutionResult {
    return {
      tenantId: 'default',
      method: 'default',
      confidence: 'low',
    };
  }

  /**
   * Extract subdomain from host
   */
  private extractSubdomain(host: string): string | null {
    const parts = host.split('.');
    if (parts.length < 3) return null;

    return parts[0];
  }

  /**
   * Validate tenant ID format
   */
  private isValidTenantId(tenantId: string): boolean {
    // Allow alphanumeric, hyphens, underscores
    const tenantIdRegex = /^[a-zA-Z0-9_-]+$/;
    return tenantIdRegex.test(tenantId) && tenantId.length >= 2 && tenantId.length <= 50;
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

  /**
   * Cache tenant resolution result
   */
  private cacheTenantResult(key: string, tenantId: string): void {
    this.tenantCache.set(key, {
      tenantId,
      expires: Date.now() + this.CACHE_TTL,
    });
  }

  /**
   * Get cached tenant result
   */
  private getCachedTenantResult(key: string): string | null {
    const cached = this.tenantCache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expires) {
      this.tenantCache.delete(key);
      return null;
    }

    return cached.tenantId;
  }

  /**
   * Clear tenant cache
   */
  clearCache(): void {
    this.tenantCache.clear();
    this.logger.debug('Tenant cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.tenantCache.size,
      entries: Array.from(this.tenantCache.keys()),
    };
  }
}
