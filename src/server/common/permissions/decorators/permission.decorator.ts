import { SetMetadata } from '@nestjs/common';
import type { Permission, PermissionContext } from '../types';

// Ключи метаданных
export const PERMISSION_KEY = 'permission';
export const PERMISSION_CONTEXT_KEY = 'permission_context';

/**
 * Декоратор для проверки конкретного права доступа
 * 
 * @example
 * @Permission('project.edit.own')
 */
export const Permission = (permission: Permission) => 
  SetMetadata(PERMISSION_KEY, permission);

/**
 * Декоратор для проверки любого из прав (OR)
 * 
 * @example
 * @AnyPermission(['project.edit.own', 'project.edit.clients'])
 */
export const AnyPermission = (permissions: Permission[]) => 
  SetMetadata(PERMISSION_KEY, { type: 'any', permissions });

/**
 * Декоратор для проверки всех прав одновременно (AND)
 * 
 * @example
 * @AllPermissions(['project.view.own', 'project.edit.own'])
 */
export const AllPermissions = (permissions: Permission[]) => 
  SetMetadata(PERMISSION_KEY, { type: 'all', permissions });