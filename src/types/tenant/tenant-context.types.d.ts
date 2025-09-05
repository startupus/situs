/**
 * Tenant context type definitions
 */
import { TenantRole, TenantPermission } from './tenant.types';
export interface TenantContext {
  tenantId: string;
  userId?: string;
  projectId?: string;
  accountId?: string;
  role?: TenantRole;
  permissions?: TenantPermission[];
  metadata?: Record<string, any>;
}
export interface TenantContextRequest {
  tenant: TenantContext;
  user?: {
    id: string;
    email: string;
    role: TenantRole;
    permissions: TenantPermission[];
  };
}
export interface TenantAwareEntity {
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface TenantAwareUser extends TenantAwareEntity {
  userId: string;
  role: TenantRole;
  permissions: TenantPermission[];
  lastActiveAt?: Date;
}
export interface TenantAwareProject extends TenantAwareEntity {
  projectId: string;
  name: string;
  description?: string;
  ownerId: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';
}
export interface TenantAwareProduct extends TenantAwareEntity {
  productId: string;
  projectId: string;
  name: string;
  type: 'WEBSITE' | 'ECOMMERCE' | 'BLOG' | 'LANDING' | 'API' | 'ADMIN';
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
}
export interface TenantContextOptions {
  validateAccess?: boolean;
  includePermissions?: boolean;
  includeMetadata?: boolean;
  cache?: boolean;
  cacheTtl?: number;
}
export interface TenantContextResult<T = any> {
  context: TenantContext;
  data?: T;
  success: boolean;
  error?: string;
  metadata?: {
    resolutionMethod: 'subdomain' | 'header' | 'path' | 'jwt' | 'default';
    confidence: 'high' | 'medium' | 'low';
    cached: boolean;
    executionTime: number;
  };
}
//# sourceMappingURL=tenant-context.types.d.ts.map
