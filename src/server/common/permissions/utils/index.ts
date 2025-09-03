/**
 * Экспорты утилит системы прав доступа
 *
 * Централизованное место для импорта всех утилит
 */

// Утилиты проверки прав
export {
  isOwnershipRequired,
  isClientAction,
  isGlobalAction,
  getRequiredRole,
  supportsClientScope,
  getPermissionCategory,
  isSystemPermission,
  getPermissionLevel,
} from './permission-checker.util';

// Утилиты работы с ролями
export {
  getGlobalRoleLevel,
  getProjectRoleLevel,
  getAccountRoleLevel,
  canManageRole,
  hasMinimumRoleLevel,
  getManageableRoles,
  isAgencyRole,
  isAdminRole,
  getRoleDisplayName,
  getRoleDescription,
} from './role-matcher.util';

// Утилиты контекста
export {
  buildContextFromRequest,
  determineResourceType,
  determineAccessScope,
  getComponentFromPermission,
  determineOwnerId,
  validatePermissionContext,
  createSimpleContext,
  mergeContexts,
  requiresAdditionalData,
} from './context-builder.util';
