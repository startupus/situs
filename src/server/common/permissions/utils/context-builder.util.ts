/**
 * Утилиты для построения контекста проверки прав
 * 
 * Функции для создания и валидации контекста
 * проверки прав доступа
 */

import type { Permission, PermissionContext, AccessScope } from '../types';

/**
 * Строит контекст проверки прав из HTTP запроса
 */
export function buildContextFromRequest(
  permission: Permission,
  request: any
): PermissionContext {
  const params = request.params || {};
  const query = request.query || {};

  return {
    resource: determineResourceType(permission),
    scope: determineAccessScope(permission),
    action: permission,
    resourceId: params.id || params.projectId || params.accountId,
    projectId: params.projectId || query.projectId,
    accountId: params.accountId || query.accountId,
    clientId: params.clientId || query.clientId,
    agencyId: params.agencyId || query.agencyId,
    component: getComponentFromPermission(permission),
    ownerId: determineOwnerId(request)
  };
}

/**
 * Определяет тип ресурса из права доступа
 */
export function determineResourceType(
  permission: Permission
): PermissionContext['resource'] {
  if (permission.includes('project.')) return 'project';
  if (permission.includes('account.')) return 'account';
  if (permission.includes('user.')) return 'component';
  if (permission.includes('agency.')) return 'agency';
  if (permission.includes('system.')) return 'global';
  
  return 'global';
}

/**
 * Определяет скоуп доступа из права доступа
 */
export function determineAccessScope(permission: Permission): AccessScope {
  if (permission.includes('.all')) return 'global';
  if (permission.includes('.clients')) return 'agency';
  if (permission.includes('.own')) return 'own';
  if (permission.includes('system.')) return 'platform';
  
  return 'own';
}

/**
 * Получает компонент из права доступа
 */
export function getComponentFromPermission(
  permission: Permission
): PermissionContext['component'] {
  if (permission.includes('orders.')) return 'orders';
  if (permission.includes('analytics.')) return 'analytics';
  if (permission.includes('billing.')) return 'billing';
  if (permission.includes('user.')) return 'users';
  if (permission.includes('project.')) return 'projects';
  
  return undefined;
}

/**
 * Определяет ID владельца из запроса
 */
export function determineOwnerId(request: any): string | undefined {
  const user = request.user;
  if (!user) return undefined;
  
  return user.id;
}

/**
 * Валидирует контекст проверки прав
 */
export function validatePermissionContext(context: PermissionContext): boolean {
  // Проверяем обязательные поля
  if (!context.action || !context.resource || !context.scope) {
    return false;
  }

  // Проверяем соответствие ресурса и скоупа
  if (context.resource === 'project' && !context.projectId && context.scope !== 'global') {
    return false;
  }

  if (context.resource === 'account' && !context.accountId && context.scope !== 'global') {
    return false;
  }

  if (context.scope === 'agency' && !context.clientId && !context.agencyId) {
    return false;
  }

  return true;
}

/**
 * Создает минимальный контекст для простой проверки
 */
export function createSimpleContext(
  action: Permission,
  scope: AccessScope = 'own'
): PermissionContext {
  return {
    resource: determineResourceType(action),
    scope,
    action
  };
}

/**
 * Объединяет контексты (переопределение)
 */
export function mergeContexts(
  base: PermissionContext,
  override: Partial<PermissionContext>
): PermissionContext {
  return {
    ...base,
    ...override
  };
}

/**
 * Проверяет, требует ли контекст дополнительных данных
 */
export function requiresAdditionalData(context: PermissionContext): boolean {
  // Если скоуп 'own', но нет ownerId
  if (context.scope === 'own' && !context.ownerId) {
    return true;
  }

  // Если скоуп 'agency', но нет данных об агентстве/клиенте
  if (context.scope === 'agency' && !context.agencyId && !context.clientId) {
    return true;
  }

  // Если ресурс 'project', но нет projectId
  if (context.resource === 'project' && !context.projectId && context.scope !== 'global') {
    return true;
  }

  return false;
}