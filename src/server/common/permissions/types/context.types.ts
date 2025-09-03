/**
 * Контекстные типы для проверки прав доступа
 *
 * Определяет контекст, в котором проверяются права,
 * и результаты проверки
 */

import type { Permission } from './index';

/** Уровни доступа в многосайтовой системе */
export type AccessScope =
  | 'global' // Глобальный доступ ко всей системе
  | 'platform' // Доступ к платформенным функциям
  | 'agency' // Доступ к функциям агентства (клиенты + собственные проекты)
  | 'account' // Доступ к аккаунту (собственные проекты + участие в других)
  | 'project' // Доступ к конкретному проекту/сайту
  | 'component' // Доступ только к определенному компоненту
  | 'own'; // Доступ только к собственному контенту

/** Расширенный контекст для проверки прав (многоуровневый) */
export interface PermissionContext {
  /** Тип ресурса */
  resource: 'global' | 'platform' | 'agency' | 'account' | 'project' | 'component';

  /** ID ресурса */
  resourceId?: string;

  /** ID владельца ресурса */
  ownerId?: string;

  /** ID клиента (для агентских отношений) */
  clientId?: string;

  /** ID агентства */
  agencyId?: string;

  /** ID аккаунта */
  accountId?: string;

  /** ID проекта */
  projectId?: string;

  /** Компонент системы */
  component?: 'orders' | 'analytics' | 'billing' | 'users' | 'projects';

  /** Проверяемое действие */
  action: Permission;

  /** Скоуп доступа */
  scope: AccessScope;
}

/** Результат проверки прав */
export interface PermissionCheckResult {
  /** Разрешен ли доступ */
  allowed: boolean;

  /** Причина отказа (если доступ запрещен) */
  reason?: string;

  /** Требуемая роль */
  requiredRole?: string;

  /** Недостающие права */
  missingPermissions?: Permission[];

  /** Контекст проверки */
  context?: PermissionContext;
}

/** Конфигурация проверки прав */
export interface PermissionCheckConfig {
  /** Проверять владение ресурсом */
  checkOwnership?: boolean;

  /** Проверять агентские отношения */
  checkAgencyRelations?: boolean;

  /** Проверять членство в аккаунте */
  checkAccountMembership?: boolean;

  /** Проверять доступ к проекту */
  checkProjectAccess?: boolean;

  /** Строгая проверка (не разрешать доступ по умолчанию) */
  strict?: boolean;
}
