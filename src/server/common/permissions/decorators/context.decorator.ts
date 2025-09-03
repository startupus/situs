import { SetMetadata } from '@nestjs/common';
import type { PermissionContext as PermissionContextType, Permission } from '../types';

/**
 * Декораторы для установки контекста проверки прав
 */

/**
 * Декоратор для установки контекста проверки прав
 *
 * @example
 * @PermissionContext({ resource: 'project', scope: 'own' })
 */
export const PERMISSION_CONTEXT_KEY = 'permission_context';
export const SetPermissionContext = (context: Partial<PermissionContextType>) =>
  SetMetadata(PERMISSION_CONTEXT_KEY, context);

/**
 * Декоратор для владельцев ресурса
 *
 * @example
 * @OwnerOnly('project')
 */
export const OwnerOnly = (resourceType: 'project' | 'account' | 'user') =>
  SetMetadata('permission', { type: 'owner', resourceType });

/**
 * Декоратор для агентских прав
 *
 * @example
 * @AgencyAccess('clients')
 */
export const AgencyAccess = (scope: 'clients' | 'own' | 'all') => SetMetadata('permission', { type: 'agency', scope });

/**
 * Комбинированный декоратор для удобства
 *
 * @example
 * @RequirePermission('project.edit.own', { resource: 'project', scope: 'own' })
 */
export const RequirePermission = (permission: Permission, context?: Partial<PermissionContextType>) => {
  return (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
    (SetMetadata('permission', permission) as any)(target as any, propertyKey as any, descriptor as any);
    if (context) {
      (SetMetadata('permission_context', context) as any)(target as any, propertyKey as any, descriptor as any);
    }
  };
};
