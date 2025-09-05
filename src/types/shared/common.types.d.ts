/**
 * Common type definitions
 */
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface TenantAwareEntity extends BaseEntity {
  tenantId: string;
}
export interface UserAwareEntity extends BaseEntity {
  createdBy: string;
  updatedBy?: string;
}
export interface TenantUserAwareEntity extends TenantAwareEntity, UserAwareEntity {}
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
  fields?: string[];
}
export interface FilterParams {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'like' | 'ilike' | 'between';
  value: any;
}
export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}
export interface QueryParams extends PaginationParams, SearchParams {
  filters?: FilterParams[];
  sorts?: SortParams[];
}
export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';
  changes?: Record<
    string,
    {
      old: any;
      new: any;
    }
  >;
  userId: string;
  tenantId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}
export interface SystemConfig {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description?: string;
  tenantId?: string;
  isPublic: boolean;
  updatedAt: Date;
}
export interface FeatureFlag {
  key: string;
  enabled: boolean;
  description?: string;
  tenantId?: string;
  userId?: string;
  conditions?: Record<string, any>;
  expiresAt?: Date;
}
export interface HealthCheck {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  message?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}
export interface Metrics {
  name: string;
  value: number;
  unit: string;
  tags: Record<string, string>;
  timestamp: Date;
}
export interface ErrorDetails {
  code: string;
  message: string;
  stack?: string;
  context?: Record<string, any>;
  timestamp: Date;
  userId?: string;
  tenantId?: string;
  requestId?: string;
}
//# sourceMappingURL=common.types.d.ts.map
