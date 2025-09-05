'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.TenantValidationOptionsSchema =
  exports.TenantResolutionRequestSchema =
  exports.TenantContextSchema =
  exports.TenantUserSchema =
  exports.UpdateTenantSchema =
  exports.CreateTenantSchema =
  exports.TenantLimitsSchema =
  exports.TenantSettingsSchema =
  exports.TenantPermissionSchema =
  exports.TenantRoleSchema =
  exports.TenantStatusSchema =
  exports.TenantDomainSchema =
  exports.TenantSlugSchema =
  exports.TenantNameSchema =
  exports.TenantIdSchema =
    void 0;
const zod_1 = require('zod');
const tenant_1 = require('../types/tenant');
/**
 * Tenant validation schemas using Zod
 */
exports.TenantIdSchema = zod_1.z
  .string()
  .min(2, 'Tenant ID must be at least 2 characters')
  .max(50, 'Tenant ID must be at most 50 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Tenant ID can only contain letters, numbers, hyphens, and underscores');
exports.TenantNameSchema = zod_1.z
  .string()
  .min(1, 'Tenant name is required')
  .max(100, 'Tenant name must be at most 100 characters');
exports.TenantSlugSchema = zod_1.z
  .string()
  .min(2, 'Tenant slug must be at least 2 characters')
  .max(50, 'Tenant slug must be at most 50 characters')
  .regex(/^[a-z0-9-]+$/, 'Tenant slug can only contain lowercase letters, numbers, and hyphens');
exports.TenantDomainSchema = zod_1.z.string().url('Invalid domain format').optional().or(zod_1.z.literal(''));
exports.TenantStatusSchema = zod_1.z.nativeEnum(tenant_1.TenantStatus);
exports.TenantRoleSchema = zod_1.z.nativeEnum(tenant_1.TenantRole);
exports.TenantPermissionSchema = zod_1.z.nativeEnum(tenant_1.TenantPermission);
exports.TenantSettingsSchema = zod_1.z.object({
  theme: zod_1.z
    .object({
      primaryColor: zod_1.z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format')
        .optional(),
      secondaryColor: zod_1.z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format')
        .optional(),
      logo: zod_1.z.string().url('Invalid logo URL').optional(),
    })
    .optional(),
  features: zod_1.z
    .object({
      multiLanguage: zod_1.z.boolean().optional(),
      customDomain: zod_1.z.boolean().optional(),
      advancedAnalytics: zod_1.z.boolean().optional(),
    })
    .optional(),
  branding: zod_1.z
    .object({
      companyName: zod_1.z.string().max(100).optional(),
      supportEmail: zod_1.z.string().email('Invalid email format').optional(),
      customCss: zod_1.z.string().max(10000, 'CSS too large').optional(),
    })
    .optional(),
});
exports.TenantLimitsSchema = zod_1.z.object({
  projects: zod_1.z.number().int().min(0, 'Projects limit must be non-negative'),
  products: zod_1.z.number().int().min(0, 'Products limit must be non-negative'),
  users: zod_1.z.number().int().min(0, 'Users limit must be non-negative'),
  storage: zod_1.z.number().int().min(0, 'Storage limit must be non-negative'),
  bandwidth: zod_1.z.number().int().min(0, 'Bandwidth limit must be non-negative'),
  apiCalls: zod_1.z.number().int().min(0, 'API calls limit must be non-negative'),
});
exports.CreateTenantSchema = zod_1.z.object({
  id: exports.TenantIdSchema,
  name: exports.TenantNameSchema,
  slug: exports.TenantSlugSchema,
  domain: exports.TenantDomainSchema,
  customDomain: exports.TenantDomainSchema,
  settings: exports.TenantSettingsSchema.optional(),
  limits: exports.TenantLimitsSchema.optional(),
});
exports.UpdateTenantSchema = zod_1.z.object({
  name: exports.TenantNameSchema.optional(),
  slug: exports.TenantSlugSchema.optional(),
  domain: exports.TenantDomainSchema,
  customDomain: exports.TenantDomainSchema,
  status: exports.TenantStatusSchema.optional(),
  settings: exports.TenantSettingsSchema.optional(),
  limits: exports.TenantLimitsSchema.optional(),
});
exports.TenantUserSchema = zod_1.z.object({
  userId: zod_1.z.string().uuid('Invalid user ID format'),
  role: exports.TenantRoleSchema,
  permissions: zod_1.z.array(exports.TenantPermissionSchema).optional(),
});
exports.TenantContextSchema = zod_1.z.object({
  tenantId: exports.TenantIdSchema,
  userId: zod_1.z.string().uuid('Invalid user ID format').optional(),
  projectId: zod_1.z.string().uuid('Invalid project ID format').optional(),
  accountId: zod_1.z.string().uuid('Invalid account ID format').optional(),
  role: exports.TenantRoleSchema.optional(),
  permissions: zod_1.z.array(exports.TenantPermissionSchema).optional(),
  metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.TenantResolutionRequestSchema = zod_1.z.object({
  host: zod_1.z.string().optional(),
  headers: zod_1.z.record(zod_1.z.string()).optional(),
  path: zod_1.z.string().optional(),
  method: zod_1.z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']).optional(),
  query: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.TenantValidationOptionsSchema = zod_1.z.object({
  validateAccess: zod_1.z.boolean().optional(),
  includePermissions: zod_1.z.boolean().optional(),
  includeMetadata: zod_1.z.boolean().optional(),
  cache: zod_1.z.boolean().optional(),
  cacheTtl: zod_1.z.number().int().min(0).optional(),
});
