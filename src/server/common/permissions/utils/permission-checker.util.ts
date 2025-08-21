/**
 * Утилиты для проверки прав доступа
 * 
 * Чистые функции для проверки различных типов прав
 * без зависимостей от внешних сервисов
 */

import type { Permission, GlobalRole } from '../types';

/**
 * Проверяет, требует ли действие проверки владения ресурсом
 */
export function isOwnershipRequired(action: Permission): boolean {
  return action.includes('.own') || 
         action.includes('.delete') || 
         action.includes('.edit');
}

/**
 * Проверяет, является ли действие клиентским (для агентств)
 */
export function isClientAction(action: Permission): boolean {
  return action.includes('.clients') || action.includes('.all');
}

/**
 * Проверяет, является ли действие глобальным (для админов)
 */
export function isGlobalAction(action: Permission): boolean {
  return action.includes('.all') || 
         action.includes('system.') ||
         action.includes('core.admin');
}

/**
 * Получает требуемую роль для действия
 */
export function getRequiredRole(action: Permission): GlobalRole {
  if (isGlobalAction(action)) {
    return 'STAFF';
  }
  
  if (isClientAction(action)) {
    return 'AGENCY';
  }
  
  return 'BUSINESS';
}

/**
 * Проверяет, поддерживает ли право работу с клиентами
 */
export function supportsClientScope(permission: Permission): boolean {
  const clientPermissions = [
    'project.view.clients',
    'project.edit.clients',
    'project.delete.clients',
    'user.view.clients',
    'user.edit.clients',
    'orders.view.clients',
    'analytics.view.clients',
    'billing.view.clients'
  ];
  
  return clientPermissions.includes(permission) || permission.includes('.clients');
}

/**
 * Получает категорию права
 */
export function getPermissionCategory(permission: Permission): string {
  if (permission.includes('project.')) return 'projects';
  if (permission.includes('user.')) return 'users';
  if (permission.includes('orders.')) return 'orders';
  if (permission.includes('analytics.')) return 'analytics';
  if (permission.includes('billing.')) return 'billing';
  if (permission.includes('system.')) return 'system';
  if (permission.includes('agency.')) return 'agency';
  if (permission.includes('core.')) return 'core';
  
  return 'unknown';
}

/**
 * Проверяет, является ли право системным
 */
export function isSystemPermission(permission: Permission): boolean {
  return permission.includes('system.') || 
         permission.includes('core.admin') ||
         (permission as unknown as string) === '*';
}

/**
 * Получает уровень важности права (для сортировки)
 */
export function getPermissionLevel(permission: Permission): number {
  if ((permission as unknown as string) === '*') return 1000;
  if (permission.includes('system.')) return 900;
  if (permission.includes('.all')) return 800;
  if (permission.includes('.clients')) return 600;
  if (permission.includes('.own')) return 400;
  
  return 200;
}