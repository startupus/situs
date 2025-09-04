import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TenantContext } from '../../types/tenant/tenant-context.types';

export interface TenantInfo {
  id: string;
  method: 'subdomain' | 'header' | 'path' | 'jwt' | 'default';
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Decorator to extract tenant information from request
 */
export const Tenant = createParamDecorator(
  (data: keyof TenantInfo | undefined, ctx: ExecutionContext): TenantInfo | string => {
    const request = ctx.switchToHttp().getRequest();
    const tenant = request.tenant as TenantInfo;

    if (!tenant) {
      throw new Error('No tenant context found. Ensure TenantMiddleware is applied.');
    }

    return data ? tenant[data] : tenant;
  },
);

/**
 * Decorator to extract current tenant ID
 */
export const TenantId = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest();
  const tenant = request.tenant as TenantInfo;

  if (!tenant?.id) {
    throw new Error('No tenant ID found. Ensure TenantMiddleware is applied.');
  }

  return tenant.id;
});

/**
 * Decorator to extract tenant resolution method
 */
export const TenantMethod = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest();
  const tenant = request.tenant as TenantInfo;

  if (!tenant?.method) {
    throw new Error('No tenant method found. Ensure TenantMiddleware is applied.');
  }

  return tenant.method;
});

/**
 * Decorator to extract tenant confidence level
 */
export const TenantConfidence = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest();
  const tenant = request.tenant as TenantInfo;

  if (!tenant?.confidence) {
    throw new Error('No tenant confidence found. Ensure TenantMiddleware is applied.');
  }

  return tenant.confidence;
});

/**
 * Decorator to extract current tenant context
 */
export const CurrentTenant = createParamDecorator((data: unknown, ctx: ExecutionContext): TenantContext => {
  const request = ctx.switchToHttp().getRequest();
  const tenantContext = (request.tenantContext || null) as TenantContext | null;

  if (!tenantContext) {
    throw new Error('No tenant context found. Ensure TenantMiddleware is applied.');
  }

  return tenantContext;
});
