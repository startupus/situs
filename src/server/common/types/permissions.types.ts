/**
 * Многоуровневая система прав доступа для многосайтовой платформы Situs
 * 
 * Адаптирована под специфику:
 * - Глобальное управление системой
 * - Управление собственными проектами/сайтами
 * - Управление проектами клиентов (для агентств)
 * - Компонентно-специфичные права (только заказы, только аналитика и т.д.)
 * - Мультиарендность с изоляцией данных
 */

// Уровни доступа в многосайтовой системе
export type AccessScope = 
  | 'global'            // Глобальный доступ ко всей системе
  | 'platform'          // Доступ к платформенным функциям
  | 'agency'            // Доступ к функциям агентства (клиенты + собственные проекты)
  | 'account'           // Доступ к аккаунту (собственные проекты + участие в других)
  | 'project'           // Доступ к конкретному проекту/сайту
  | 'component'         // Доступ только к определенному компоненту
  | 'own';              // Доступ только к собственному контенту

// Базовые права (адаптированные для многосайтовости)
export type CorePermission = 
  | 'core.admin'        // Административный доступ к компоненту
  | 'core.manage'       // Управление компонентом
  | 'core.create'       // Создание контента
  | 'core.edit'         // Редактирование любого контента
  | 'core.edit.own'     // Редактирование собственного контента
  | 'core.edit.clients' // Редактирование контента клиентов (для агентств)
  | 'core.edit.state'   // Изменение состояния (публикация/снятие с публикации)
  | 'core.delete'       // Удаление контента
  | 'core.delete.own'   // Удаление собственного контента
  | 'core.delete.clients' // Удаление контента клиентов (для агентств)
  | 'core.view'         // Просмотр контента
  | 'core.view.own'     // Просмотр собственного контента
  | 'core.view.clients'; // Просмотр контента клиентов

// Права для проектов/сайтов (многосайтовая специфика)
export type ProjectPermission =
  | 'project.create'          // Создание проектов
  | 'project.create.unlimited' // Создание неограниченного количества проектов
  | 'project.edit.own'        // Редактирование собственных проектов
  | 'project.edit.clients'    // Редактирование проектов клиентов (агентство)
  | 'project.edit.all'        // Редактирование всех проектов (глобальный админ)
  | 'project.view.own'        // Просмотр собственных проектов
  | 'project.view.clients'    // Просмотр проектов клиентов
  | 'project.view.all'        // Просмотр всех проектов в системе
  | 'project.publish.own'     // Публикация собственных проектов
  | 'project.publish.clients' // Публикация проектов клиентов
  | 'project.publish.all'     // Публикация любых проектов
  | 'project.delete.own'      // Удаление собственных проектов
  | 'project.delete.clients'  // Удаление проектов клиентов
  | 'project.delete.all'      // Удаление любых проектов
  | 'project.transfer'        // Передача проектов другим пользователям
  | 'project.clone'           // Клонирование проектов
  | 'project.export'          // Экспорт проектов
  | 'project.import'          // Импорт проектов
  | 'project.settings.basic'  // Базовые настройки проектов
  | 'project.settings.advanced' // Расширенные настройки
  | 'project.domains.own'     // Управление доменами собственных проектов
  | 'project.domains.clients' // Управление доменами проектов клиентов
  | 'project.domains.all'     // Управление всеми доменами
  | 'project.access.manage'   // Управление доступом к проектам
  | 'project.billing'         // Управление биллингом проектов
  | 'project.analytics.own'   // Аналитика собственных проектов
  | 'project.analytics.clients' // Аналитика проектов клиентов
  | 'project.analytics.all';  // Аналитика всех проектов

// Права для пользователей (с учетом агентской модели)
export type UserPermission =
  | 'user.create.clients'     // Создание пользователей-клиентов
  | 'user.create.staff'       // Создание сотрудников
  | 'user.create.all'         // Создание любых пользователей
  | 'user.edit.profile'       // Редактирование собственного профиля
  | 'user.edit.clients'       // Редактирование пользователей-клиентов
  | 'user.edit.staff'         // Редактирование сотрудников
  | 'user.edit.all'           // Редактирование всех пользователей
  | 'user.view.own'           // Просмотр собственного профиля
  | 'user.view.clients'       // Просмотр пользователей-клиентов
  | 'user.view.staff'         // Просмотр сотрудников
  | 'user.view.all'           // Просмотр всех пользователей
  | 'user.delete.clients'     // Удаление пользователей-клиентов
  | 'user.delete.staff'       // Удаление сотрудников
  | 'user.delete.all'         // Удаление любых пользователей
  | 'user.manage.permissions.clients' // Управление правами клиентов
  | 'user.manage.permissions.staff'   // Управление правами сотрудников
  | 'user.manage.permissions.all'     // Управление правами всех пользователей
  | 'user.impersonate.clients' // Вход под клиентами
  | 'user.impersonate.staff'   // Вход под сотрудниками
  | 'user.impersonate.all'     // Вход под любыми пользователями
  | 'user.export.clients'      // Экспорт данных клиентов
  | 'user.export.all'          // Экспорт всех данных пользователей
  | 'user.ban.clients'         // Блокировка клиентов
  | 'user.ban.all'             // Блокировка любых пользователей
  | 'user.activate.clients'    // Активация клиентов
  | 'user.activate.all';       // Активация любых пользователей

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

// Компонентно-специфичные права: ЗАКАЗЫ
export type OrdersPermission =
  | 'orders.view.own'         // Просмотр собственных заказов
  | 'orders.view.clients'     // Просмотр заказов клиентов
  | 'orders.view.all'         // Просмотр всех заказов в системе
  | 'orders.create'           // Создание заказов
  | 'orders.edit.own'         // Редактирование собственных заказов
  | 'orders.edit.clients'     // Редактирование заказов клиентов
  | 'orders.edit.all'         // Редактирование всех заказов
  | 'orders.delete.own'       // Удаление собственных заказов
  | 'orders.delete.clients'   // Удаление заказов клиентов
  | 'orders.delete.all'       // Удаление всех заказов
  | 'orders.status.change'    // Изменение статуса заказов
  | 'orders.refund'           // Оформление возвратов
  | 'orders.export.own'       // Экспорт собственных заказов
  | 'orders.export.clients'   // Экспорт заказов клиентов
  | 'orders.export.all'       // Экспорт всех заказов
  | 'orders.reports.own'      // Отчеты по собственным заказам
  | 'orders.reports.clients'  // Отчеты по заказам клиентов
  | 'orders.reports.all';     // Отчеты по всем заказам

// Компонентно-специфичные права: АНАЛИТИКА
export type AnalyticsPermission =
  | 'analytics.view.own'      // Аналитика собственных проектов
  | 'analytics.view.clients'  // Аналитика проектов клиентов
  | 'analytics.view.all'      // Аналитика всех проектов
  | 'analytics.export.own'    // Экспорт собственной аналитики
  | 'analytics.export.clients' // Экспорт аналитики клиентов
  | 'analytics.export.all'    // Экспорт всей аналитики
  | 'analytics.realtime.own'  // Real-time аналитика собственных проектов
  | 'analytics.realtime.clients' // Real-time аналитика клиентов
  | 'analytics.realtime.all'  // Real-time аналитика всех проектов
  | 'analytics.advanced.own'  // Расширенная аналитика собственных проектов
  | 'analytics.advanced.clients' // Расширенная аналитика клиентов
  | 'analytics.advanced.all'  // Расширенная аналитика всех проектов
  | 'analytics.custom.create' // Создание кастомных отчетов
  | 'analytics.dashboard.customize'; // Настройка дашбордов

// Компонентно-специфичные права: БИЛЛИНГ
export type BillingPermission =
  | 'billing.view.own'        // Просмотр собственного биллинга
  | 'billing.view.clients'    // Просмотр биллинга клиентов
  | 'billing.view.all'        // Просмотр всего биллинга
  | 'billing.manage.own'      // Управление собственным биллингом
  | 'billing.manage.clients'  // Управление биллингом клиентов
  | 'billing.manage.all'      // Управление всем биллингом
  | 'billing.invoices.create' // Создание счетов
  | 'billing.invoices.send'   // Отправка счетов
  | 'billing.payments.process' // Обработка платежей
  | 'billing.subscriptions.manage' // Управление подписками
  | 'billing.reports.own'     // Отчеты по собственному биллингу
  | 'billing.reports.clients' // Отчеты по биллингу клиентов
  | 'billing.reports.all';    // Отчеты по всему биллингу

// Права для отчетов (общие)
export type ReportsPermission =
  | 'reports.view.own'        // Просмотр собственных отчетов
  | 'reports.view.clients'    // Просмотр отчетов клиентов
  | 'reports.view.all'        // Просмотр всех отчетов
  | 'reports.create'          // Создание отчетов
  | 'reports.export.own'      // Экспорт собственных отчетов
  | 'reports.export.clients'  // Экспорт отчетов клиентов
  | 'reports.export.all'      // Экспорт всех отчетов
  | 'reports.schedule'        // Планирование отчетов
  | 'reports.advanced'        // Расширенные отчеты
  | 'reports.custom.create';  // Создание кастомных отчетов

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

// Специальные права для агентств
export type AgencyPermission =
  | 'agency.clients.create'     // Создание клиентов
  | 'agency.clients.manage'     // Управление клиентами
  | 'agency.clients.delete'     // Удаление клиентов
  | 'agency.projects.transfer'  // Передача проектов клиентам
  | 'agency.billing.manage'     // Управление биллингом клиентов
  | 'agency.reports.consolidated' // Консолидированные отчеты
  | 'agency.whitelabel'         // White-label функции
  | 'agency.reseller'           // Права реселлера
  | 'agency.api.access'         // API доступ для интеграций
  | 'agency.bulk.operations';   // Массовые операции

// Объединенный тип всех прав
export type Permission = 
  | CorePermission 
  | ProjectPermission 
  | UserPermission 
  | AccountPermission 
  | ProductPermission 
  | ContentPermission 
  | MenuPermission 
  | OrdersPermission
  | AnalyticsPermission
  | BillingPermission
  | ReportsPermission 
  | AgencyPermission
  | SystemPermission;

// Интерфейс для описания права
export interface PermissionDefinition {
  id: Permission;
  name: string;
  description: string;
  category: 'core' | 'project' | 'user' | 'account' | 'product' | 'content' | 'menu' | 'orders' | 'analytics' | 'billing' | 'reports' | 'agency' | 'system';
  level: 'basic' | 'advanced' | 'admin' | 'super';
  scope: AccessScope;
  requiresOwnership?: boolean; // Требует ли право проверки владения ресурсом
  clientRelated?: boolean;     // Связано ли право с клиентами (для агентств)
}

// Группы прав для удобства управления
export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  scope: AccessScope;
  targetRole?: 'SUPER_ADMIN' | 'STAFF' | 'AGENCY' | 'BUSINESS';
}

// Расширенный контекст для проверки прав (многоуровневый)
export interface PermissionContext {
  resource: 'global' | 'platform' | 'agency' | 'account' | 'project' | 'component';
  resourceId?: string;
  ownerId?: string;
  clientId?: string;        // ID клиента (для агентских отношений)
  agencyId?: string;        // ID агентства
  accountId?: string;       // ID аккаунта
  projectId?: string;       // ID проекта
  component?: 'orders' | 'analytics' | 'billing' | 'users' | 'projects';
  action: Permission;
  scope: AccessScope;
}

// Результат проверки прав
export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
  requiredRole?: string;
  missingPermissions?: Permission[];
  context?: PermissionContext;
}

// Роль с правами и ограничениями
export interface RoleDefinition {
  id: 'SUPER_ADMIN' | 'STAFF' | 'AGENCY' | 'BUSINESS';
  name: string;
  description: string;
  level: number;
  permissions: Permission[];
  inheritsFrom?: 'SUPER_ADMIN' | 'STAFF' | 'AGENCY' | 'BUSINESS';
  limitations?: {
    maxProjects?: number;
    maxClients?: number;
    maxStorage?: number;
    allowedComponents?: string[];
  };
  scopes: AccessScope[];
}