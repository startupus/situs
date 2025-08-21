/**
 * Главный экспорт модуля системы прав доступа
 * 
 * Предоставляет все необходимые компоненты для работы
 * с правами доступа в приложении
 */

// Основной модуль
export { PermissionsModule } from './permissions.module';

// Типы
export type { 
  CorePermission,
  ProjectPermission,
  UserPermission,
  BasePermission,
  OrdersPermission,
  AnalyticsPermission,
  BillingPermission,
  AgencyPermission,
  ComponentPermission,
  AccountPermission,
  ProductPermission,
  ContentPermission,
  MenuPermission,
  ReportsPermission,
  SystemPermission,
  SystemPermissions,
  GlobalRole,
  ProjectRole,
  AccountRole,
  RoleInfo,
  PermissionContext,
  AccessScope,
  PermissionCheckResult,
  Permission,
  AllPermissions
} from './types';

// Сервисы
export * from './services';

// Декораторы
export * from './decorators';

// Guards
export * from './guards';

// Утилиты
// Утилиты (избегаем дублирующих имён при ре-экспорте)
export {
  isOwnershipRequired,
  isClientAction,
  isGlobalAction,
  getRequiredRole,
  supportsClientScope,
  getPermissionCategory,
  isSystemPermission,
  getPermissionLevel,
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
  buildContextFromRequest,
  determineResourceType,
  determineAccessScope,
  getComponentFromPermission,
  determineOwnerId,
  validatePermissionContext,
  createSimpleContext,
  mergeContexts,
  requiresAdditionalData
} from './utils';

// Конфигурация (будет создана)
export * from './config';