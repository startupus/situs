import { SetMetadata } from '@nestjs/common';
import { Permission, PermissionContext } from '../types/permissions.types';

// Ключи метаданных
export const PERMISSION_KEY = 'permission';
export const PERMISSION_CONTEXT_KEY = 'permission_context';

/**
 * Декоратор для проверки конкретного права доступа
 * 
 * @example
 * @Permission('project.edit.own')
 * @Permission('user.create.clients')
 * @Permission('orders.view.all')
 */
export const Permission = (permission: Permission) => SetMetadata(PERMISSION_KEY, permission);

/**
 * Декоратор для установки контекста проверки прав
 * 
 * @example
 * @PermissionContext({
 *   resource: 'project',
 *   scope: 'own'
 * })
 */
export const PermissionContext = (context: Partial<PermissionContext>) => 
  SetMetadata(PERMISSION_CONTEXT_KEY, context);

/**
 * Комбинированный декоратор для удобства использования
 * 
 * @example
 * @RequirePermission('project.edit.own', { resource: 'project', scope: 'own' })
 */
export const RequirePermission = (
  permission: Permission, 
  context?: Partial<PermissionContext>
) => {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    SetMetadata(PERMISSION_KEY, permission)(target, propertyKey, descriptor);
    if (context) {
      SetMetadata(PERMISSION_CONTEXT_KEY, context)(target, propertyKey, descriptor);
    }
  };
};

/**
 * Декоратор для проверки нескольких прав (любое из них)
 * 
 * @example
 * @AnyPermission(['project.edit.own', 'project.edit.all'])
 */
export const AnyPermission = (permissions: Permission[]) => 
  SetMetadata(PERMISSION_KEY, { type: 'any', permissions });

/**
 * Декоратор для проверки всех прав одновременно
 * 
 * @example
 * @AllPermissions(['project.view.own', 'project.edit.own'])
 */
export const AllPermissions = (permissions: Permission[]) => 
  SetMetadata(PERMISSION_KEY, { type: 'all', permissions });

/**
 * Декоратор для владельцев ресурса
 * 
 * @example
 * @OwnerOnly('project')
 */
export const OwnerOnly = (resourceType: 'project' | 'account' | 'user') => 
  SetMetadata(PERMISSION_KEY, { type: 'owner', resourceType });

/**
 * Декоратор для агентских прав
 * 
 * @example
 * @AgencyAccess('clients')
 */
export const AgencyAccess = (scope: 'clients' | 'own' | 'all') => 
  SetMetadata(PERMISSION_KEY, { type: 'agency', scope });