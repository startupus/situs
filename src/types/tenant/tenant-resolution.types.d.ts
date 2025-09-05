/**
 * Tenant resolution type definitions
 */
export interface TenantResolutionResult {
  tenantId: string;
  method: TenantResolutionMethod;
  confidence: TenantResolutionConfidence;
  metadata?: TenantResolutionMetadata;
}
export declare enum TenantResolutionMethod {
  SUBDOMAIN = 'subdomain',
  HEADER = 'header',
  PATH = 'path',
  JWT = 'jwt',
  DEFAULT = 'default',
}
export declare enum TenantResolutionConfidence {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}
export interface TenantResolutionMetadata {
  subdomain?: string;
  headerName?: string;
  pathSegment?: string;
  jwtPayload?: Record<string, any>;
  fallbackReason?: string;
  validationErrors?: string[];
}
export interface TenantResolutionOptions {
  methods?: TenantResolutionMethod[];
  priority?: TenantResolutionMethod[];
  fallbackToDefault?: boolean;
  validateTenant?: boolean;
  cache?: boolean;
  cacheTtl?: number;
}
export interface TenantResolutionContext {
  request: {
    host?: string;
    headers: Record<string, string>;
    path: string;
    method: string;
    query: Record<string, any>;
  };
  user?: {
    id: string;
    tenantId?: string;
  };
  session?: {
    tenantId?: string;
  };
}
export interface TenantValidationResult {
  isValid: boolean;
  tenantId: string;
  errors: string[];
  warnings: string[];
  metadata?: {
    exists: boolean;
    active: boolean;
    accessible: boolean;
    userHasAccess: boolean;
  };
}
export interface TenantCacheEntry {
  tenantId: string;
  expires: number;
  metadata?: Record<string, any>;
}
export interface TenantResolutionStats {
  totalResolutions: number;
  methodStats: Record<TenantResolutionMethod, number>;
  confidenceStats: Record<TenantResolutionConfidence, number>;
  averageResolutionTime: number;
  cacheHitRate: number;
  errorRate: number;
}
//# sourceMappingURL=tenant-resolution.types.d.ts.map
