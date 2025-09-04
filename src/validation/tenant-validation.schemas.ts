import { z } from 'zod';
import { TenantStatus, TenantRole, TenantPermission } from '../types/tenant';

/**
 * Tenant validation schemas using Zod
 */

export const TenantIdSchema = z
  .string()
  .min(2, 'Tenant ID must be at least 2 characters')
  .max(50, 'Tenant ID must be at most 50 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Tenant ID can only contain letters, numbers, hyphens, and underscores');

export const TenantNameSchema = z
  .string()
  .min(1, 'Tenant name is required')
  .max(100, 'Tenant name must be at most 100 characters');

export const TenantSlugSchema = z
  .string()
  .min(2, 'Tenant slug must be at least 2 characters')
  .max(50, 'Tenant slug must be at most 50 characters')
  .regex(/^[a-z0-9-]+$/, 'Tenant slug can only contain lowercase letters, numbers, and hyphens');

export const TenantDomainSchema = z.string().url('Invalid domain format').optional().or(z.literal(''));

export const TenantStatusSchema = z.nativeEnum(TenantStatus);

export const TenantRoleSchema = z.nativeEnum(TenantRole);

export const TenantPermissionSchema = z.nativeEnum(TenantPermission);

export const TenantSettingsSchema = z.object({
  theme: z
    .object({
      primaryColor: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format')
        .optional(),
      secondaryColor: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format')
        .optional(),
      logo: z.string().url('Invalid logo URL').optional(),
    })
    .optional(),
  features: z
    .object({
      multiLanguage: z.boolean().optional(),
      customDomain: z.boolean().optional(),
      advancedAnalytics: z.boolean().optional(),
    })
    .optional(),
  branding: z
    .object({
      companyName: z.string().max(100).optional(),
      supportEmail: z.string().email('Invalid email format').optional(),
      customCss: z.string().max(10000, 'CSS too large').optional(),
    })
    .optional(),
});

export const TenantLimitsSchema = z.object({
  projects: z.number().int().min(0, 'Projects limit must be non-negative'),
  products: z.number().int().min(0, 'Products limit must be non-negative'),
  users: z.number().int().min(0, 'Users limit must be non-negative'),
  storage: z.number().int().min(0, 'Storage limit must be non-negative'),
  bandwidth: z.number().int().min(0, 'Bandwidth limit must be non-negative'),
  apiCalls: z.number().int().min(0, 'API calls limit must be non-negative'),
});

export const CreateTenantSchema = z.object({
  id: TenantIdSchema,
  name: TenantNameSchema,
  slug: TenantSlugSchema,
  domain: TenantDomainSchema,
  customDomain: TenantDomainSchema,
  settings: TenantSettingsSchema.optional(),
  limits: TenantLimitsSchema.optional(),
});

export const UpdateTenantSchema = z.object({
  name: TenantNameSchema.optional(),
  slug: TenantSlugSchema.optional(),
  domain: TenantDomainSchema,
  customDomain: TenantDomainSchema,
  status: TenantStatusSchema.optional(),
  settings: TenantSettingsSchema.optional(),
  limits: TenantLimitsSchema.optional(),
});

export const TenantUserSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
  role: TenantRoleSchema,
  permissions: z.array(TenantPermissionSchema).optional(),
});

export const TenantContextSchema = z.object({
  tenantId: TenantIdSchema,
  userId: z.string().uuid('Invalid user ID format').optional(),
  projectId: z.string().uuid('Invalid project ID format').optional(),
  accountId: z.string().uuid('Invalid account ID format').optional(),
  role: TenantRoleSchema.optional(),
  permissions: z.array(TenantPermissionSchema).optional(),
  metadata: z.record(z.any()).optional(),
});

export const TenantResolutionRequestSchema = z.object({
  host: z.string().optional(),
  headers: z.record(z.string()).optional(),
  path: z.string().optional(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']).optional(),
  query: z.record(z.any()).optional(),
});

export const TenantValidationOptionsSchema = z.object({
  validateAccess: z.boolean().optional(),
  includePermissions: z.boolean().optional(),
  includeMetadata: z.boolean().optional(),
  cache: z.boolean().optional(),
  cacheTtl: z.number().int().min(0).optional(),
});

// Type exports
export type CreateTenantInput = z.infer<typeof CreateTenantSchema>;
export type UpdateTenantInput = z.infer<typeof UpdateTenantSchema>;
export type TenantUserInput = z.infer<typeof TenantUserSchema>;
export type TenantContextInput = z.infer<typeof TenantContextSchema>;
export type TenantResolutionRequestInput = z.infer<typeof TenantResolutionRequestSchema>;
export type TenantValidationOptionsInput = z.infer<typeof TenantValidationOptionsSchema>;
