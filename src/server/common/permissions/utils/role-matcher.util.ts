/**
 * Утилиты для работы с ролями
 * 
 * Функции для сопоставления ролей, проверки иерархии
 * и определения уровней доступа
 */

import type { GlobalRole, ProjectRole, AccountRole } from '../types';

/** Уровни глобальных ролей */
const GLOBAL_ROLE_LEVELS: Record<GlobalRole, number> = {
  SUPER_ADMIN: 100,
  STAFF: 80,
  AGENCY: 60,
  BUSINESS: 40
};

/** Уровни ролей проекта */
const PROJECT_ROLE_LEVELS: Record<ProjectRole, number> = {
  OWNER: 100,
  ADMIN: 80,
  EDITOR: 60,
  VIEWER: 40
};

/** Уровни ролей аккаунта */
const ACCOUNT_ROLE_LEVELS: Record<AccountRole, number> = {
  OWNER: 100,
  ADMIN: 80,
  MANAGER: 60,
  MEMBER: 40
};

/**
 * Получает уровень глобальной роли
 */
export function getGlobalRoleLevel(role: GlobalRole): number {
  return GLOBAL_ROLE_LEVELS[role] || 0;
}

/**
 * Получает уровень роли проекта
 */
export function getProjectRoleLevel(role: ProjectRole): number {
  return PROJECT_ROLE_LEVELS[role] || 0;
}

/**
 * Получает уровень роли аккаунта
 */
export function getAccountRoleLevel(role: AccountRole): number {
  return ACCOUNT_ROLE_LEVELS[role] || 0;
}

/**
 * Проверяет, может ли роль A управлять ролью B
 */
export function canManageRole(managerRole: GlobalRole, targetRole: GlobalRole): boolean {
  const managerLevel = getGlobalRoleLevel(managerRole);
  const targetLevel = getGlobalRoleLevel(targetRole);
  
  return managerLevel > targetLevel;
}

/**
 * Проверяет, имеет ли роль достаточный уровень
 */
export function hasMinimumRoleLevel(
  userRole: GlobalRole, 
  requiredRole: GlobalRole
): boolean {
  const userLevel = getGlobalRoleLevel(userRole);
  const requiredLevel = getGlobalRoleLevel(requiredRole);
  
  return userLevel >= requiredLevel;
}

/**
 * Получает все роли, которые может управлять данная роль
 */
export function getManageableRoles(managerRole: GlobalRole): GlobalRole[] {
  const managerLevel = getGlobalRoleLevel(managerRole);
  
  return (Object.keys(GLOBAL_ROLE_LEVELS) as GlobalRole[])
    .filter(role => GLOBAL_ROLE_LEVELS[role] < managerLevel);
}

/**
 * Проверяет, является ли роль агентской
 */
export function isAgencyRole(role: GlobalRole): boolean {
  return role === 'AGENCY' || getGlobalRoleLevel(role) >= getGlobalRoleLevel('AGENCY');
}

/**
 * Проверяет, является ли роль административной
 */
export function isAdminRole(role: GlobalRole): boolean {
  return role === 'STAFF' || role === 'SUPER_ADMIN';
}

/**
 * Получает название роли для отображения
 */
export function getRoleDisplayName(role: GlobalRole): string {
  const names: Record<GlobalRole, string> = {
    SUPER_ADMIN: 'Супер администратор',
    STAFF: 'Персонал',
    AGENCY: 'Агентство',
    BUSINESS: 'Бизнес-пользователь'
  };
  
  return names[role] || role;
}

/**
 * Получает описание роли
 */
export function getRoleDescription(role: GlobalRole): string {
  const descriptions: Record<GlobalRole, string> = {
    SUPER_ADMIN: 'Полный контроль над всей платформой',
    STAFF: 'Системные администраторы и служба поддержки',
    AGENCY: 'Агентство с клиентами - управление собственными и клиентскими проектами',
    BUSINESS: 'Обычный пользователь - управление собственными проектами'
  };
  
  return descriptions[role] || '';
}