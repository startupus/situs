/**
 * Core tenant type definitions
 */
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  customDomain?: string;
  status: TenantStatus;
  settings: TenantSettings;
  limits: TenantLimits;
  createdAt: Date;
  updatedAt: Date;
}
export declare enum TenantStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
}
export interface TenantSettings {
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    logo?: string;
  };
  features?: {
    multiLanguage?: boolean;
    customDomain?: boolean;
    advancedAnalytics?: boolean;
  };
  branding?: {
    companyName?: string;
    supportEmail?: string;
    customCss?: string;
  };
}
export interface TenantLimits {
  projects: number;
  products: number;
  users: number;
  storage: number;
  bandwidth: number;
  apiCalls: number;
}
export interface TenantUser {
  id: string;
  tenantId: string;
  userId: string;
  role: TenantRole;
  permissions: TenantPermission[];
  joinedAt: Date;
  lastActiveAt?: Date;
}
export declare enum TenantRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}
export declare enum TenantPermission {
  CREATE_PROJECT = 'CREATE_PROJECT',
  EDIT_PROJECT = 'EDIT_PROJECT',
  DELETE_PROJECT = 'DELETE_PROJECT',
  VIEW_PROJECT = 'VIEW_PROJECT',
  INVITE_USERS = 'INVITE_USERS',
  MANAGE_USERS = 'MANAGE_USERS',
  VIEW_USERS = 'VIEW_USERS',
  MANAGE_SETTINGS = 'MANAGE_SETTINGS',
  VIEW_SETTINGS = 'VIEW_SETTINGS',
  MANAGE_BILLING = 'MANAGE_BILLING',
  VIEW_BILLING = 'VIEW_BILLING',
}
export interface TenantSubscription {
  id: string;
  tenantId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
  metadata?: Record<string, any>;
}
export declare enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  INCOMPLETE = 'INCOMPLETE',
  INCOMPLETE_EXPIRED = 'INCOMPLETE_EXPIRED',
  PAST_DUE = 'PAST_DUE',
  TRIALING = 'TRIALING',
  UNPAID = 'UNPAID',
}
//# sourceMappingURL=tenant.types.d.ts.map
