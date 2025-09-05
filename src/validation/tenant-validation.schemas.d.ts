import { z } from 'zod';
import { TenantStatus, TenantRole, TenantPermission } from '../types/tenant';
/**
 * Tenant validation schemas using Zod
 */
export declare const TenantIdSchema: z.ZodString;
export declare const TenantNameSchema: z.ZodString;
export declare const TenantSlugSchema: z.ZodString;
export declare const TenantDomainSchema: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<''>]>;
export declare const TenantStatusSchema: z.ZodNativeEnum<typeof TenantStatus>;
export declare const TenantRoleSchema: z.ZodNativeEnum<typeof TenantRole>;
export declare const TenantPermissionSchema: z.ZodNativeEnum<typeof TenantPermission>;
export declare const TenantSettingsSchema: z.ZodObject<
  {
    theme: z.ZodOptional<
      z.ZodObject<
        {
          primaryColor: z.ZodOptional<z.ZodString>;
          secondaryColor: z.ZodOptional<z.ZodString>;
          logo: z.ZodOptional<z.ZodString>;
        },
        'strip',
        z.ZodTypeAny,
        {
          primaryColor?: string;
          secondaryColor?: string;
          logo?: string;
        },
        {
          primaryColor?: string;
          secondaryColor?: string;
          logo?: string;
        }
      >
    >;
    features: z.ZodOptional<
      z.ZodObject<
        {
          multiLanguage: z.ZodOptional<z.ZodBoolean>;
          customDomain: z.ZodOptional<z.ZodBoolean>;
          advancedAnalytics: z.ZodOptional<z.ZodBoolean>;
        },
        'strip',
        z.ZodTypeAny,
        {
          customDomain?: boolean;
          multiLanguage?: boolean;
          advancedAnalytics?: boolean;
        },
        {
          customDomain?: boolean;
          multiLanguage?: boolean;
          advancedAnalytics?: boolean;
        }
      >
    >;
    branding: z.ZodOptional<
      z.ZodObject<
        {
          companyName: z.ZodOptional<z.ZodString>;
          supportEmail: z.ZodOptional<z.ZodString>;
          customCss: z.ZodOptional<z.ZodString>;
        },
        'strip',
        z.ZodTypeAny,
        {
          companyName?: string;
          supportEmail?: string;
          customCss?: string;
        },
        {
          companyName?: string;
          supportEmail?: string;
          customCss?: string;
        }
      >
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    theme?: {
      primaryColor?: string;
      secondaryColor?: string;
      logo?: string;
    };
    features?: {
      customDomain?: boolean;
      multiLanguage?: boolean;
      advancedAnalytics?: boolean;
    };
    branding?: {
      companyName?: string;
      supportEmail?: string;
      customCss?: string;
    };
  },
  {
    theme?: {
      primaryColor?: string;
      secondaryColor?: string;
      logo?: string;
    };
    features?: {
      customDomain?: boolean;
      multiLanguage?: boolean;
      advancedAnalytics?: boolean;
    };
    branding?: {
      companyName?: string;
      supportEmail?: string;
      customCss?: string;
    };
  }
>;
export declare const TenantLimitsSchema: z.ZodObject<
  {
    projects: z.ZodNumber;
    products: z.ZodNumber;
    users: z.ZodNumber;
    storage: z.ZodNumber;
    bandwidth: z.ZodNumber;
    apiCalls: z.ZodNumber;
  },
  'strip',
  z.ZodTypeAny,
  {
    users?: number;
    projects?: number;
    products?: number;
    storage?: number;
    bandwidth?: number;
    apiCalls?: number;
  },
  {
    users?: number;
    projects?: number;
    products?: number;
    storage?: number;
    bandwidth?: number;
    apiCalls?: number;
  }
>;
export declare const CreateTenantSchema: z.ZodObject<
  {
    id: z.ZodString;
    name: z.ZodString;
    slug: z.ZodString;
    domain: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<''>]>;
    customDomain: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<''>]>;
    settings: z.ZodOptional<
      z.ZodObject<
        {
          theme: z.ZodOptional<
            z.ZodObject<
              {
                primaryColor: z.ZodOptional<z.ZodString>;
                secondaryColor: z.ZodOptional<z.ZodString>;
                logo: z.ZodOptional<z.ZodString>;
              },
              'strip',
              z.ZodTypeAny,
              {
                primaryColor?: string;
                secondaryColor?: string;
                logo?: string;
              },
              {
                primaryColor?: string;
                secondaryColor?: string;
                logo?: string;
              }
            >
          >;
          features: z.ZodOptional<
            z.ZodObject<
              {
                multiLanguage: z.ZodOptional<z.ZodBoolean>;
                customDomain: z.ZodOptional<z.ZodBoolean>;
                advancedAnalytics: z.ZodOptional<z.ZodBoolean>;
              },
              'strip',
              z.ZodTypeAny,
              {
                customDomain?: boolean;
                multiLanguage?: boolean;
                advancedAnalytics?: boolean;
              },
              {
                customDomain?: boolean;
                multiLanguage?: boolean;
                advancedAnalytics?: boolean;
              }
            >
          >;
          branding: z.ZodOptional<
            z.ZodObject<
              {
                companyName: z.ZodOptional<z.ZodString>;
                supportEmail: z.ZodOptional<z.ZodString>;
                customCss: z.ZodOptional<z.ZodString>;
              },
              'strip',
              z.ZodTypeAny,
              {
                companyName?: string;
                supportEmail?: string;
                customCss?: string;
              },
              {
                companyName?: string;
                supportEmail?: string;
                customCss?: string;
              }
            >
          >;
        },
        'strip',
        z.ZodTypeAny,
        {
          theme?: {
            primaryColor?: string;
            secondaryColor?: string;
            logo?: string;
          };
          features?: {
            customDomain?: boolean;
            multiLanguage?: boolean;
            advancedAnalytics?: boolean;
          };
          branding?: {
            companyName?: string;
            supportEmail?: string;
            customCss?: string;
          };
        },
        {
          theme?: {
            primaryColor?: string;
            secondaryColor?: string;
            logo?: string;
          };
          features?: {
            customDomain?: boolean;
            multiLanguage?: boolean;
            advancedAnalytics?: boolean;
          };
          branding?: {
            companyName?: string;
            supportEmail?: string;
            customCss?: string;
          };
        }
      >
    >;
    limits: z.ZodOptional<
      z.ZodObject<
        {
          projects: z.ZodNumber;
          products: z.ZodNumber;
          users: z.ZodNumber;
          storage: z.ZodNumber;
          bandwidth: z.ZodNumber;
          apiCalls: z.ZodNumber;
        },
        'strip',
        z.ZodTypeAny,
        {
          users?: number;
          projects?: number;
          products?: number;
          storage?: number;
          bandwidth?: number;
          apiCalls?: number;
        },
        {
          users?: number;
          projects?: number;
          products?: number;
          storage?: number;
          bandwidth?: number;
          apiCalls?: number;
        }
      >
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    id?: string;
    name?: string;
    slug?: string;
    domain?: string;
    customDomain?: string;
    settings?: {
      theme?: {
        primaryColor?: string;
        secondaryColor?: string;
        logo?: string;
      };
      features?: {
        customDomain?: boolean;
        multiLanguage?: boolean;
        advancedAnalytics?: boolean;
      };
      branding?: {
        companyName?: string;
        supportEmail?: string;
        customCss?: string;
      };
    };
    limits?: {
      users?: number;
      projects?: number;
      products?: number;
      storage?: number;
      bandwidth?: number;
      apiCalls?: number;
    };
  },
  {
    id?: string;
    name?: string;
    slug?: string;
    domain?: string;
    customDomain?: string;
    settings?: {
      theme?: {
        primaryColor?: string;
        secondaryColor?: string;
        logo?: string;
      };
      features?: {
        customDomain?: boolean;
        multiLanguage?: boolean;
        advancedAnalytics?: boolean;
      };
      branding?: {
        companyName?: string;
        supportEmail?: string;
        customCss?: string;
      };
    };
    limits?: {
      users?: number;
      projects?: number;
      products?: number;
      storage?: number;
      bandwidth?: number;
      apiCalls?: number;
    };
  }
>;
export declare const UpdateTenantSchema: z.ZodObject<
  {
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    domain: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<''>]>;
    customDomain: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<''>]>;
    status: z.ZodOptional<z.ZodNativeEnum<typeof TenantStatus>>;
    settings: z.ZodOptional<
      z.ZodObject<
        {
          theme: z.ZodOptional<
            z.ZodObject<
              {
                primaryColor: z.ZodOptional<z.ZodString>;
                secondaryColor: z.ZodOptional<z.ZodString>;
                logo: z.ZodOptional<z.ZodString>;
              },
              'strip',
              z.ZodTypeAny,
              {
                primaryColor?: string;
                secondaryColor?: string;
                logo?: string;
              },
              {
                primaryColor?: string;
                secondaryColor?: string;
                logo?: string;
              }
            >
          >;
          features: z.ZodOptional<
            z.ZodObject<
              {
                multiLanguage: z.ZodOptional<z.ZodBoolean>;
                customDomain: z.ZodOptional<z.ZodBoolean>;
                advancedAnalytics: z.ZodOptional<z.ZodBoolean>;
              },
              'strip',
              z.ZodTypeAny,
              {
                customDomain?: boolean;
                multiLanguage?: boolean;
                advancedAnalytics?: boolean;
              },
              {
                customDomain?: boolean;
                multiLanguage?: boolean;
                advancedAnalytics?: boolean;
              }
            >
          >;
          branding: z.ZodOptional<
            z.ZodObject<
              {
                companyName: z.ZodOptional<z.ZodString>;
                supportEmail: z.ZodOptional<z.ZodString>;
                customCss: z.ZodOptional<z.ZodString>;
              },
              'strip',
              z.ZodTypeAny,
              {
                companyName?: string;
                supportEmail?: string;
                customCss?: string;
              },
              {
                companyName?: string;
                supportEmail?: string;
                customCss?: string;
              }
            >
          >;
        },
        'strip',
        z.ZodTypeAny,
        {
          theme?: {
            primaryColor?: string;
            secondaryColor?: string;
            logo?: string;
          };
          features?: {
            customDomain?: boolean;
            multiLanguage?: boolean;
            advancedAnalytics?: boolean;
          };
          branding?: {
            companyName?: string;
            supportEmail?: string;
            customCss?: string;
          };
        },
        {
          theme?: {
            primaryColor?: string;
            secondaryColor?: string;
            logo?: string;
          };
          features?: {
            customDomain?: boolean;
            multiLanguage?: boolean;
            advancedAnalytics?: boolean;
          };
          branding?: {
            companyName?: string;
            supportEmail?: string;
            customCss?: string;
          };
        }
      >
    >;
    limits: z.ZodOptional<
      z.ZodObject<
        {
          projects: z.ZodNumber;
          products: z.ZodNumber;
          users: z.ZodNumber;
          storage: z.ZodNumber;
          bandwidth: z.ZodNumber;
          apiCalls: z.ZodNumber;
        },
        'strip',
        z.ZodTypeAny,
        {
          users?: number;
          projects?: number;
          products?: number;
          storage?: number;
          bandwidth?: number;
          apiCalls?: number;
        },
        {
          users?: number;
          projects?: number;
          products?: number;
          storage?: number;
          bandwidth?: number;
          apiCalls?: number;
        }
      >
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    name?: string;
    slug?: string;
    domain?: string;
    customDomain?: string;
    settings?: {
      theme?: {
        primaryColor?: string;
        secondaryColor?: string;
        logo?: string;
      };
      features?: {
        customDomain?: boolean;
        multiLanguage?: boolean;
        advancedAnalytics?: boolean;
      };
      branding?: {
        companyName?: string;
        supportEmail?: string;
        customCss?: string;
      };
    };
    status?: TenantStatus;
    limits?: {
      users?: number;
      projects?: number;
      products?: number;
      storage?: number;
      bandwidth?: number;
      apiCalls?: number;
    };
  },
  {
    name?: string;
    slug?: string;
    domain?: string;
    customDomain?: string;
    settings?: {
      theme?: {
        primaryColor?: string;
        secondaryColor?: string;
        logo?: string;
      };
      features?: {
        customDomain?: boolean;
        multiLanguage?: boolean;
        advancedAnalytics?: boolean;
      };
      branding?: {
        companyName?: string;
        supportEmail?: string;
        customCss?: string;
      };
    };
    status?: TenantStatus;
    limits?: {
      users?: number;
      projects?: number;
      products?: number;
      storage?: number;
      bandwidth?: number;
      apiCalls?: number;
    };
  }
>;
export declare const TenantUserSchema: z.ZodObject<
  {
    userId: z.ZodString;
    role: z.ZodNativeEnum<typeof TenantRole>;
    permissions: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof TenantPermission>, 'many'>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    userId?: string;
    role?: TenantRole;
    permissions?: TenantPermission[];
  },
  {
    userId?: string;
    role?: TenantRole;
    permissions?: TenantPermission[];
  }
>;
export declare const TenantContextSchema: z.ZodObject<
  {
    tenantId: z.ZodString;
    userId: z.ZodOptional<z.ZodString>;
    projectId: z.ZodOptional<z.ZodString>;
    accountId: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodNativeEnum<typeof TenantRole>>;
    permissions: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof TenantPermission>, 'many'>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    projectId?: string;
    userId?: string;
    role?: TenantRole;
    accountId?: string;
    tenantId?: string;
    permissions?: TenantPermission[];
    metadata?: Record<string, any>;
  },
  {
    projectId?: string;
    userId?: string;
    role?: TenantRole;
    accountId?: string;
    tenantId?: string;
    permissions?: TenantPermission[];
    metadata?: Record<string, any>;
  }
>;
export declare const TenantResolutionRequestSchema: z.ZodObject<
  {
    host: z.ZodOptional<z.ZodString>;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    path: z.ZodOptional<z.ZodString>;
    method: z.ZodOptional<z.ZodEnum<['GET', 'POST', 'PUT', 'DELETE', 'PATCH']>>;
    query: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    query?: Record<string, any>;
    host?: string;
    headers?: Record<string, string>;
    path?: string;
    method?: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
  },
  {
    query?: Record<string, any>;
    host?: string;
    headers?: Record<string, string>;
    path?: string;
    method?: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
  }
>;
export declare const TenantValidationOptionsSchema: z.ZodObject<
  {
    validateAccess: z.ZodOptional<z.ZodBoolean>;
    includePermissions: z.ZodOptional<z.ZodBoolean>;
    includeMetadata: z.ZodOptional<z.ZodBoolean>;
    cache: z.ZodOptional<z.ZodBoolean>;
    cacheTtl: z.ZodOptional<z.ZodNumber>;
  },
  'strip',
  z.ZodTypeAny,
  {
    validateAccess?: boolean;
    includePermissions?: boolean;
    includeMetadata?: boolean;
    cache?: boolean;
    cacheTtl?: number;
  },
  {
    validateAccess?: boolean;
    includePermissions?: boolean;
    includeMetadata?: boolean;
    cache?: boolean;
    cacheTtl?: number;
  }
>;
export type CreateTenantInput = z.infer<typeof CreateTenantSchema>;
export type UpdateTenantInput = z.infer<typeof UpdateTenantSchema>;
export type TenantUserInput = z.infer<typeof TenantUserSchema>;
export type TenantContextInput = z.infer<typeof TenantContextSchema>;
export type TenantResolutionRequestInput = z.infer<typeof TenantResolutionRequestSchema>;
export type TenantValidationOptionsInput = z.infer<typeof TenantValidationOptionsSchema>;
//# sourceMappingURL=tenant-validation.schemas.d.ts.map
