/**
 * Система прав доступа по образцу Joomla ACL
 * 
 * Включает базовые права (core.*) и специфичные права для каждого компонента
 */

// Базовые права (как в Joomla)
export type CorePermission = 
  | 'core.admin'        // Административный доступ к компоненту
  | 'core.manage'       // Управление компонентом (доступ к административным функциям)
  | 'core.create'       // Создание контента
  | 'core.edit'         // Редактирование любого контента
  | 'core.edit.own'     // Редактирование собственного контента
  | 'core.edit.state'   // Изменение состояния (публикация/снятие с публикации)
  | 'core.delete'       // Удаление контента
  | 'core.delete.own';  // Удаление собственного контента

// Права для проектов
export type ProjectPermission =
  | 'project.create'      // Создание проектов
  | 'project.edit.own'    // Редактирование собственных проектов
  | 'project.edit.all'    // Редактирование всех проектов
  | 'project.publish'     // Публикация проектов
  | 'project.delete.own'  // Удаление собственных проектов
  | 'project.delete.all'  // Удаление любых проектов
  | 'project.manage'      // Полное управление проектами
  | 'project.settings'    // Изменение настроек проектов
  | 'project.domains'     // Управление доменами проектов
  | 'project.access';     // Управление доступом к проектам

// Права для пользователей
export type UserPermission =
  | 'user.create'           // Создание пользователей
  | 'user.edit.profile'     // Редактирование собственного профиля
  | 'user.edit.all'         // Редактирование всех пользователей
  | 'user.delete'           // Удаление пользователей
  | 'user.manage.permissions' // Управление правами пользователей
  | 'user.impersonate'      // Вход под другим пользователем
  | 'user.view.all'         // Просмотр всех пользователей
  | 'user.export'           // Экспорт данных пользователей
  | 'user.ban'              // Блокировка пользователей
  | 'user.activate';        // Активация пользователей

// Права для аккаунтов
export type AccountPermission =
  | 'account.create'        // Создание аккаунтов
  | 'account.edit.own'      // Редактирование собственного аккаунта
  | 'account.edit.all'      // Редактирование всех аккаунтов
  | 'account.delete'        // Удаление аккаунтов
  | 'account.manage.members' // Управление участниками аккаунта
  | 'account.billing'       // Управление биллингом
  | 'account.settings';     // Изменение настроек аккаунта

// Права для продуктов
export type ProductPermission =
  | 'product.create'        // Создание продуктов
  | 'product.edit.own'      // Редактирование собственных продуктов
  | 'product.edit.all'      // Редактирование всех продуктов
  | 'product.delete'        // Удаление продуктов
  | 'product.publish'       // Публикация продуктов
  | 'product.categories'    // Управление категориями
  | 'product.items'         // Управление товарами
  | 'product.pricing'       // Управление ценами
  | 'product.inventory'     // Управление складом
  | 'product.seo';          // SEO настройки продуктов

// Права для контента (страницы, посты)
export type ContentPermission =
  | 'content.create'        // Создание контента
  | 'content.edit.own'      // Редактирование собственного контента
  | 'content.edit.all'      // Редактирование всего контента
  | 'content.delete.own'    // Удаление собственного контента
  | 'content.delete.all'    // Удаление всего контента
  | 'content.publish.own'   // Публикация собственного контента
  | 'content.publish.all'   // Публикация всего контента
  | 'content.moderate'      // Модерация контента
  | 'content.seo'           // SEO настройки контента
  | 'content.schedule';     // Планирование публикации

// Права для меню
export type MenuPermission =
  | 'menu.create'           // Создание меню
  | 'menu.edit'             // Редактирование меню
  | 'menu.delete'           // Удаление меню
  | 'menu.publish'          // Публикация пунктов меню
  | 'menu.reorder'          // Изменение порядка пунктов
  | 'menu.access'           // Управление доступом к пунктам меню
  | 'menu.types';           // Управление типами меню

// Права для отчетов и аналитики
export type ReportsPermission =
  | 'reports.view'          // Просмотр отчетов
  | 'reports.create'        // Создание отчетов
  | 'reports.export'        // Экспорт отчетов
  | 'reports.advanced'      // Расширенные отчеты
  | 'analytics.view'        // Просмотр аналитики
  | 'analytics.export'      // Экспорт аналитики
  | 'analytics.realtime';   // Просмотр real-time аналитики

// Системные права
export type SystemPermission =
  | 'system.admin'          // Системное администрирование
  | 'system.config'         // Изменение конфигурации
  | 'system.maintenance'    // Режим обслуживания
  | 'system.backup'         // Создание резервных копий
  | 'system.logs'           // Просмотр логов
  | 'system.cache'          // Управление кэшем
  | 'system.updates'        // Обновления системы
  | 'system.extensions'     // Управление расширениями
  | 'system.database';      // Управление базой данных

// Объединенный тип всех прав
export type Permission = 
  | CorePermission 
  | ProjectPermission 
  | UserPermission 
  | AccountPermission 
  | ProductPermission 
  | ContentPermission 
  | MenuPermission 
  | ReportsPermission 
  | SystemPermission;

// Интерфейс для описания права
export interface PermissionDefinition {
  id: Permission;
  name: string;
  description: string;
  category: 'core' | 'project' | 'user' | 'account' | 'product' | 'content' | 'menu' | 'reports' | 'system';
  level: 'basic' | 'advanced' | 'admin' | 'super';
}

// Группы прав для удобства управления
export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

// Контекст для проверки прав
export interface PermissionContext {
  resource: 'global' | 'project' | 'account' | 'user';
  resourceId?: string;
  ownerId?: string;
  action: Permission;
}