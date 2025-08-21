/**
 * Экспорты всех типов системы прав доступа
 * 
 * Централизованное место для импорта типов из любой части приложения
 * 
 * @example
 * import { Permission, PermissionContext, GlobalRole } from './permissions/types';
 */

// Базовые права доступа
import type { CorePermission, ProjectPermission, UserPermission, BasePermission } from './permissions.types';
export type { CorePermission, ProjectPermission, UserPermission, BasePermission };

// Компонентные права
import type { OrdersPermission, AnalyticsPermission, BillingPermission, AgencyPermission, ComponentPermission } from './component-permissions.types';
export type { OrdersPermission, AnalyticsPermission, BillingPermission, AgencyPermission, ComponentPermission };

// Системные права
import type { AccountPermission, ProductPermission, ContentPermission, MenuPermission, ReportsPermission, SystemPermission, SystemPermissions } from './system-permissions.types';
export type { AccountPermission, ProductPermission, ContentPermission, MenuPermission, ReportsPermission, SystemPermission, SystemPermissions };

// Роли и контекст (будут созданы далее)
export type { GlobalRole, ProjectRole, AccountRole, RoleInfo } from './roles.types';
export type { PermissionContext, AccessScope, PermissionCheckResult } from './context.types';

// Объединенный тип всех прав
export type Permission = 
  | BasePermission
  | ComponentPermission 
  | SystemPermissions;

// Специальное право для супер-админа
export type AllPermissions = Permission | '*';