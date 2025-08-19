/**
 * Экспорты всех типов системы прав доступа
 * 
 * Централизованное место для импорта типов из любой части приложения
 * 
 * @example
 * import { Permission, PermissionContext, GlobalRole } from './permissions/types';
 */

// Базовые права доступа
export type {
  CorePermission,
  ProjectPermission,
  UserPermission,
  BasePermission
} from './permissions.types';

// Компонентные права
export type {
  OrdersPermission,
  AnalyticsPermission,
  BillingPermission,
  AgencyPermission,
  ComponentPermission
} from './component-permissions.types';

// Системные права
export type {
  AccountPermission,
  ProductPermission,
  ContentPermission,
  MenuPermission,
  ReportsPermission,
  SystemPermission,
  SystemPermissions
} from './system-permissions.types';

// Роли и контекст (будут созданы далее)
export type { GlobalRole, ProjectRole, AccountRole } from './roles.types';
export type { PermissionContext, AccessScope, PermissionCheckResult } from './context.types';

// Объединенный тип всех прав
export type Permission = 
  | BasePermission
  | ComponentPermission 
  | SystemPermissions;

// Специальное право для супер-админа
export type AllPermissions = Permission | '*';