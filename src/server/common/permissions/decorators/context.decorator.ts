import { SetMetadata } from '@nestjs/common';
import type { PermissionContext } from '../types';

/**
 * Декораторы для установки контекста проверки прав
 */

/**
 * Декоратор для установки контекста проверки прав
 * 
 * @example
 * @PermissionContext({ resource: 'project', scope: 'own' })
 */
export const PermissionContext = (context: Partial<PermissionContext>) => 
  SetMetadata('permission_context', context);

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
export const AgencyAccess = (scope: 'clients' | 'own' | 'all') => 
  SetMetadata('permission', { type: 'agency', scope });

/**
 * Комбинированный декоратор для удобства
 * 
 * @example
 * @RequirePermission('project.edit.own', { resource: 'project', scope: 'own' })
 */
export const RequirePermission = (
  permission: Permission, 
  context?: Partial<PermissionContext>
) => {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    SetMetadata('permission', permission)(target, propertyKey, descriptor);
    if (context) {
      SetMetadata('permission_context', context)(target, propertyKey, descriptor);
    }
  };
};