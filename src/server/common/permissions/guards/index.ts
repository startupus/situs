/**
 * Экспорты guards системы прав доступа
 */

export { PermissionGuard } from './permission.guard';

// Старые guards для совместимости
export { RolesGuard } from '../../guards/roles.guard';
export { PoliciesGuard } from '../../guards/policies.guard';