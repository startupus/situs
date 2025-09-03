/**
 * Конфигурация иерархии ролей
 *
 * Компактная версия с четким разделением прав по ролям
 */

import type { Permission, RoleInfo } from '../types';

/** Конфигурация роли BUSINESS */
const BUSINESS_ROLE: RoleInfo = {
  id: 'BUSINESS',
  name: 'Бизнес-пользователь',
  description: 'Управление собственными проектами',
  level: 40,
  limitations: {
    maxProjects: 5,
    maxClients: 0,
    maxStorage: 10000,
    allowedComponents: ['projects', 'orders', 'analytics'],
  },
};

/** Права роли BUSINESS */
const BUSINESS_PERMISSIONS: Permission[] = [
  // Собственные проекты
  'project.create',
  'project.view.own',
  'project.edit.own',
  'project.delete.own',
  'project.publish.own',
  'project.domains.own',
  'project.analytics.own',
  'project.clone',
  'project.export',

  // Собственный профиль
  'user.view.own',
  'user.edit.profile',

  // Контент
  'content.create',
  'content.edit.own',
  'content.delete.own',
  'content.publish.own',

  // Продукты
  'product.create',
  'product.edit.own',
  'product.delete',
  'product.publish',

  // Заказы
  'orders.view.own',
  'orders.create',
  'orders.edit.own',
  'orders.export.own',

  // Аналитика
  'analytics.view.own',
  'analytics.export.own',
  'analytics.realtime.own',

  // Биллинг
  'billing.view.own',
  'billing.manage.own',
];

/** Конфигурация роли AGENCY */
const AGENCY_ROLE: RoleInfo = {
  id: 'AGENCY',
  name: 'Агентство',
  description: 'Управление собственными проектами и проектами клиентов',
  level: 60,
  inheritsFrom: 'BUSINESS',
  limitations: {
    maxProjects: 100,
    maxClients: 50,
    maxStorage: 100000,
    allowedComponents: ['projects', 'users', 'orders', 'analytics', 'billing'],
  },
};

/** Дополнительные права роли AGENCY (к наследуемым от BUSINESS) */
const AGENCY_ADDITIONAL_PERMISSIONS: Permission[] = [
  // Проекты клиентов
  'project.create.unlimited',
  'project.view.clients',
  'project.edit.clients',
  'project.delete.clients',
  'project.publish.clients',
  'project.domains.clients',
  'project.analytics.clients',
  'project.transfer',

  // Управление клиентами
  'user.create.clients',
  'user.edit.clients',
  'user.view.clients',
  'user.manage.permissions.clients',
  'user.impersonate.clients',

  // Агентские права
  'agency.clients.create',
  'agency.clients.manage',
  'agency.projects.transfer',
  'agency.billing.manage',
  'agency.whitelabel',
  'agency.api.access',

  // Расширенная аналитика
  'analytics.view.clients',
  'analytics.custom.create',

  // Биллинг клиентов
  'billing.view.clients',
  'billing.manage.clients',
  'billing.invoices.create',
];

/** Конфигурация роли STAFF */
const STAFF_ROLE: RoleInfo = {
  id: 'STAFF',
  name: 'Персонал',
  description: 'Системные администраторы и поддержка',
  level: 80,
  inheritsFrom: 'AGENCY',
  limitations: {
    maxProjects: -1,
    maxClients: -1,
    maxStorage: -1,
    allowedComponents: ['*'],
  },
};

/** Дополнительные права роли STAFF */
const STAFF_ADDITIONAL_PERMISSIONS: Permission[] = [
  // Глобальные права
  'project.view.all',
  'project.edit.all',
  'project.delete.all',
  'user.view.all',
  'user.create.staff',
  'user.edit.staff',
  'orders.view.all',
  'orders.edit.all',
  'analytics.view.all',
  'analytics.export.all',

  // Системные права
  'system.admin',
  'system.config',
  'system.maintenance',
  'system.backup',
  'system.logs',
  'system.cache',
];

/** Конфигурация роли SUPER_ADMIN */
const SUPER_ADMIN_ROLE: RoleInfo = {
  id: 'SUPER_ADMIN',
  name: 'Супер администратор',
  description: 'Полный контроль над платформой',
  level: 100,
  limitations: {
    maxProjects: -1,
    maxClients: -1,
    maxStorage: -1,
    allowedComponents: ['*'],
  },
};

/** Экспортируемая конфигурация ролей */
export const ROLE_HIERARCHY = {
  BUSINESS: BUSINESS_ROLE,
  AGENCY: AGENCY_ROLE,
  STAFF: STAFF_ROLE,
  SUPER_ADMIN: SUPER_ADMIN_ROLE,
};

/** Экспортируемые права ролей */
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  BUSINESS: BUSINESS_PERMISSIONS,
  AGENCY: [...BUSINESS_PERMISSIONS, ...AGENCY_ADDITIONAL_PERMISSIONS],
  STAFF: [...BUSINESS_PERMISSIONS, ...AGENCY_ADDITIONAL_PERMISSIONS, ...STAFF_ADDITIONAL_PERMISSIONS],
  SUPER_ADMIN: ['*' as unknown as Permission],
};

/**
 * Получает все права роли с учетом наследования
 */
export function getRolePermissions(roleId: string): Permission[] {
  return ROLE_PERMISSIONS[roleId as keyof typeof ROLE_PERMISSIONS] || [];
}

/**
 * Проверяет, имеет ли роль право
 */
export function hasPermission(roleId: string, permission: Permission): boolean {
  const permissions = getRolePermissions(roleId);
  return permissions.includes('*' as Permission) || permissions.includes(permission);
}

/**
 * Получает уровень роли
 */
export function getRoleLevel(roleId: string): number {
  return ROLE_HIERARCHY[roleId as keyof typeof ROLE_HIERARCHY]?.level || 0;
}

/**
 * Проверяет, может ли роль управлять другой ролью
 */
export function canManageRole(managerRoleId: string, targetRoleId: string): boolean {
  const managerLevel = getRoleLevel(managerRoleId);
  const targetLevel = getRoleLevel(targetRoleId);
  return managerLevel > targetLevel;
}
