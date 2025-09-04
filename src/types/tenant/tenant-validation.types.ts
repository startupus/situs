/**
 * Tenant validation type definitions
 */

import { TenantRole, TenantPermission } from './tenant.types';

export interface TenantValidationRule {
  name: string;
  description: string;
  validate: (context: TenantValidationContext) => Promise<TenantValidationResult>;
  priority: number;
  enabled: boolean;
}

export interface TenantValidationContext {
  tenantId: string;
  userId?: string;
  action: string;
  resource?: string;
  metadata?: Record<string, any>;
}

export interface TenantValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  metadata?: Record<string, any>;
}

export interface TenantAccessValidation {
  hasAccess: boolean;
  reason?: string;
  requiredRole?: TenantRole;
  requiredPermissions?: TenantPermission[];
  userRole?: TenantRole;
  userPermissions?: TenantPermission[];
}

export interface TenantResourceAccess {
  resourceType: string;
  resourceId: string;
  action: string;
  allowed: boolean;
  reason?: string;
  conditions?: Record<string, any>;
}

export interface TenantQuotaValidation {
  resource: string;
  current: number;
  limit: number;
  exceeded: boolean;
  percentage: number;
}

export interface TenantSecurityValidation {
  secure: boolean;
  issues: SecurityIssue[];
  recommendations: string[];
}

export interface SecurityIssue {
  type: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  recommendation: string;
  affectedResources?: string[];
}

export interface TenantComplianceValidation {
  compliant: boolean;
  standards: ComplianceStandard[];
  violations: ComplianceViolation[];
}

export interface ComplianceStandard {
  name: string;
  version: string;
  compliant: boolean;
  score: number;
}

export interface ComplianceViolation {
  standard: string;
  rule: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  remediation: string;
}

export interface TenantValidationReport {
  tenantId: string;
  timestamp: Date;
  overall: {
    valid: boolean;
    score: number;
    issues: number;
  };
  validations: {
    access: TenantAccessValidation;
    quota: TenantQuotaValidation[];
    security: TenantSecurityValidation;
    compliance: TenantComplianceValidation;
  };
  recommendations: string[];
  nextReview?: Date;
}
