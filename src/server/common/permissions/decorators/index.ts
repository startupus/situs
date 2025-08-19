/**
 * Экспорты декораторов системы прав доступа
 */

// Основные декораторы прав
export {
  Permission,
  AnyPermission,
  AllPermissions,
  PERMISSION_KEY
} from './permission.decorator';

// Контекстные декораторы
export {
  PermissionContext,
  OwnerOnly,
  AgencyAccess,
  RequirePermission,
  PERMISSION_CONTEXT_KEY
} from './context.decorator';

// Совместимость со старыми декораторами (временно)
export {
  Roles,
  Scopes,
  ROLES_KEY,
  SCOPES_KEY
} from '../../decorators/roles.decorator';