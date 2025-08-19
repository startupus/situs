/**
 * Конфигурация ролей с иерархией и наследованием прав
 * Адаптирована для многосайтовой платформы Situs
 */

import { RoleDefinition, Permission, AccessScope } from '../types/permissions.types';

export const ROLE_HIERARCHY: Record<string, RoleDefinition> = {
  // СУПЕР АДМИНИСТРАТОР - полный контроль над всей системой
  SUPER_ADMIN: {
    id: 'SUPER_ADMIN',
    name: 'Супер администратор',
    description: 'Полный контроль над всей платформой Situs',
    level: 100,
    permissions: ['*'] as Permission[], // Все права
    scopes: ['global', 'platform', 'agency', 'account', 'project', 'component'],
    limitations: {
      maxProjects: -1,     // Неограниченно
      maxClients: -1,      // Неограниченно
      maxStorage: -1,      // Неограниченно
      allowedComponents: ['*'] // Все компоненты
    }
  },

  // ПЕРСОНАЛ - системные администраторы и поддержка
  STAFF: {
    id: 'STAFF',
    name: 'Персонал',
    description: 'Системные администраторы и служба поддержки',
    level: 80,
    inheritsFrom: 'BUSINESS', // Наследует права бизнес-пользователя
    permissions: [
      // Системные права
      'system.admin',
      'system.config',
      'system.maintenance',
      'system.backup',
      'system.logs',
      'system.cache',
      'system.updates',
      
      // Управление пользователями
      'user.view.all',
      'user.edit.all',
      'user.create.all',
      'user.delete.all',
      'user.manage.permissions.all',
      'user.ban.all',
      'user.activate.all',
      'user.export.all',
      'user.impersonate.all',
      
      // Управление проектами
      'project.view.all',
      'project.edit.all',
      'project.delete.all',
      'project.publish.all',
      'project.domains.all',
      'project.analytics.all',
      
      // Управление аккаунтами
      'account.edit.all',
      'account.delete',
      'account.billing',
      
      // Отчеты и аналитика
      'analytics.view.all',
      'analytics.export.all',
      'analytics.realtime.all',
      'analytics.advanced.all',
      'reports.view.all',
      'reports.export.all',
      'reports.advanced',
      
      // Заказы
      'orders.view.all',
      'orders.edit.all',
      'orders.reports.all',
      'orders.export.all',
      
      // Биллинг
      'billing.view.all',
      'billing.manage.all',
      'billing.reports.all'
    ] as Permission[],
    scopes: ['global', 'platform', 'agency', 'account', 'project', 'component'],
    limitations: {
      maxProjects: -1,
      maxClients: -1,
      maxStorage: -1,
      allowedComponents: ['*']
    }
  },

  // АГЕНТСТВО - управление клиентами и их проектами
  AGENCY: {
    id: 'AGENCY',
    name: 'Агентство',
    description: 'Агентство с клиентами - управление собственными и клиентскими проектами',
    level: 60,
    inheritsFrom: 'BUSINESS',
    permissions: [
      // Собственные права бизнес-пользователя наследуются автоматически
      
      // Специальные права агентства
      'agency.clients.create',
      'agency.clients.manage',
      'agency.clients.delete',
      'agency.projects.transfer',
      'agency.billing.manage',
      'agency.reports.consolidated',
      'agency.whitelabel',
      'agency.api.access',
      'agency.bulk.operations',
      
      // Управление клиентами
      'user.create.clients',
      'user.edit.clients',
      'user.view.clients',
      'user.delete.clients',
      'user.manage.permissions.clients',
      'user.ban.clients',
      'user.activate.clients',
      'user.export.clients',
      'user.impersonate.clients',
      
      // Проекты клиентов
      'project.create.unlimited',
      'project.view.clients',
      'project.edit.clients',
      'project.delete.clients',
      'project.publish.clients',
      'project.domains.clients',
      'project.analytics.clients',
      'project.transfer',
      'project.clone',
      'project.export',
      'project.import',
      
      // Контент клиентов
      'core.view.clients',
      'core.edit.clients',
      'core.delete.clients',
      'content.edit.all',
      'content.publish.all',
      'content.delete.all',
      
      // Аналитика и отчеты клиентов
      'analytics.view.clients',
      'analytics.export.clients',
      'analytics.realtime.clients',
      'analytics.advanced.clients',
      'reports.view.clients',
      'reports.export.clients',
      
      // Заказы клиентов
      'orders.view.clients',
      'orders.edit.clients',
      'orders.delete.clients',
      'orders.reports.clients',
      'orders.export.clients',
      
      // Биллинг клиентов
      'billing.view.clients',
      'billing.manage.clients',
      'billing.reports.clients',
      
      // Продукты клиентов
      'product.edit.all',
      'product.delete',
      'product.publish',
      'product.categories',
      'product.items',
      'product.pricing'
    ] as Permission[],
    scopes: ['agency', 'account', 'project', 'component'],
    limitations: {
      maxProjects: 100,    // До 100 проектов
      maxClients: 50,      // До 50 клиентов
      maxStorage: 100000,  // 100GB
      allowedComponents: ['projects', 'users', 'orders', 'analytics', 'billing']
    }
  },

  // БИЗНЕС - обычный бизнес-пользователь
  BUSINESS: {
    id: 'BUSINESS',
    name: 'Бизнес-пользователь',
    description: 'Обычный пользователь платформы - управление собственными проектами',
    level: 40,
    permissions: [
      // Базовые права
      'core.create',
      'core.edit.own',
      'core.delete.own',
      'core.view.own',
      
      // Собственные проекты
      'project.create',
      'project.view.own',
      'project.edit.own',
      'project.delete.own',
      'project.publish.own',
      'project.domains.own',
      'project.settings.basic',
      'project.analytics.own',
      'project.export',
      'project.clone',
      
      // Собственный профиль
      'user.edit.profile',
      'user.view.own',
      
      // Собственный аккаунт
      'account.edit.own',
      'account.billing',
      
      // Контент
      'content.create',
      'content.edit.own',
      'content.delete.own',
      'content.publish.own',
      'content.seo',
      
      // Продукты
      'product.create',
      'product.edit.own',
      'product.delete',
      'product.publish',
      'product.categories',
      'product.items',
      'product.pricing',
      'product.inventory',
      'product.seo',
      
      // Меню
      'menu.create',
      'menu.edit',
      'menu.delete',
      'menu.publish',
      'menu.reorder',
      'menu.access',
      'menu.types',
      
      // Собственная аналитика
      'analytics.view.own',
      'analytics.export.own',
      'analytics.realtime.own',
      'analytics.dashboard.customize',
      
      // Собственные заказы
      'orders.view.own',
      'orders.create',
      'orders.edit.own',
      'orders.export.own',
      'orders.reports.own',
      'orders.status.change',
      
      // Собственный биллинг
      'billing.view.own',
      'billing.manage.own',
      'billing.reports.own',
      
      // Отчеты
      'reports.view.own',
      'reports.create',
      'reports.export.own'
    ] as Permission[],
    scopes: ['account', 'project', 'own'],
    limitations: {
      maxProjects: 5,      // До 5 проектов
      maxClients: 0,       // Нет клиентов
      maxStorage: 10000,   // 10GB
      allowedComponents: ['projects', 'orders', 'analytics']
    }
  }
};

// Функция для получения всех прав роли с учетом наследования
export function getRolePermissions(roleId: string): Permission[] {
  const role = ROLE_HIERARCHY[roleId];
  if (!role) return [];
  
  // Если есть специальное право "*", возвращаем все права
  if (role.permissions.includes('*' as Permission)) {
    return ['*'] as Permission[];
  }
  
  let permissions = [...role.permissions];
  
  // Добавляем права от родительской роли
  if (role.inheritsFrom && ROLE_HIERARCHY[role.inheritsFrom]) {
    const parentPermissions = getRolePermissions(role.inheritsFrom);
    permissions = [...permissions, ...parentPermissions];
  }
  
  // Убираем дубликаты
  return [...new Set(permissions)];
}

// Функция для проверки, имеет ли роль определенное право
export function hasPermission(roleId: string, permission: Permission): boolean {
  const permissions = getRolePermissions(roleId);
  
  // Если есть право "*", то все права разрешены
  if (permissions.includes('*' as Permission)) {
    return true;
  }
  
  return permissions.includes(permission);
}

// Функция для получения уровня роли
export function getRoleLevel(roleId: string): number {
  const role = ROLE_HIERARCHY[roleId];
  return role?.level || 0;
}

// Функция для проверки, может ли роль A управлять ролью B
export function canManageRole(managerRoleId: string, targetRoleId: string): boolean {
  const managerLevel = getRoleLevel(managerRoleId);
  const targetLevel = getRoleLevel(targetRoleId);
  
  return managerLevel > targetLevel;
}

// Функция для получения доступных скоупов роли
export function getRoleScopes(roleId: string): AccessScope[] {
  const role = ROLE_HIERARCHY[roleId];
  return role?.scopes || [];
}

// Функция для получения ограничений роли
export function getRoleLimitations(roleId: string) {
  const role = ROLE_HIERARCHY[roleId];
  return role?.limitations || {};
}