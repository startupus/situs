import { z } from 'zod';

// Tenant Metrics Schema
export const TenantMetricsSchema = z.object({
  tenantId: z.string(),
  activeUsers: z.number().min(0),
  totalProjects: z.number().min(0),
  totalPages: z.number().min(0),
  storageUsed: z.number().min(0),
  lastActivity: z.date(),
  healthScore: z.number().min(0).max(100),
});

export type TenantMetrics = z.infer<typeof TenantMetricsSchema>;

// Tenant Alert Schema
export const TenantAlertTypeSchema = z.enum(['PERFORMANCE', 'STORAGE', 'SECURITY', 'BILLING']);
export const TenantAlertSeveritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

export const TenantAlertSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  type: TenantAlertTypeSchema,
  severity: TenantAlertSeveritySchema,
  message: z.string(),
  timestamp: z.date(),
  resolved: z.boolean(),
  metadata: z.record(z.any()).optional(),
});

export type TenantAlert = z.infer<typeof TenantAlertSchema>;
export type TenantAlertType = z.infer<typeof TenantAlertTypeSchema>;
export type TenantAlertSeverity = z.infer<typeof TenantAlertSeveritySchema>;

// Tenant Health Schema
export const TenantHealthStatusSchema = z.enum(['HEALTHY', 'WARNING', 'CRITICAL']);

export const TenantHealthSchema = z.object({
  status: TenantHealthStatusSchema,
  score: z.number().min(0).max(100),
  message: z.string(),
});

export type TenantHealth = z.infer<typeof TenantHealthSchema>;
export type TenantHealthStatus = z.infer<typeof TenantHealthStatusSchema>;

// API Request/Response Schemas
export const GetTenantMetricsRequestSchema = z.object({
  tenantId: z.string().optional(),
});

export const GetTenantAlertsRequestSchema = z.object({
  tenantId: z.string().optional(),
  type: TenantAlertTypeSchema.optional(),
  severity: TenantAlertSeveritySchema.optional(),
  resolved: z.boolean().optional(),
});

export const ResolveAlertRequestSchema = z.object({
  alertId: z.string(),
});

export const RefreshMetricsRequestSchema = z.object({
  tenantId: z.string().optional(),
});

// Export types
export type GetTenantMetricsRequest = z.infer<typeof GetTenantMetricsRequestSchema>;
export type GetTenantAlertsRequest = z.infer<typeof GetTenantAlertsRequestSchema>;
export type ResolveAlertRequest = z.infer<typeof ResolveAlertRequestSchema>;
export type RefreshMetricsRequest = z.infer<typeof RefreshMetricsRequestSchema>;
