/**
 * Компонентно-специфичные права доступа
 * 
 * Права для отдельных компонентов системы:
 * - Заказы
 * - Аналитика  
 * - Биллинг
 * - Агентские функции
 */

/** Компонентно-специфичные права: ЗАКАЗЫ */
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

/** Компонентно-специфичные права: АНАЛИТИКА */
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

/** Компонентно-специфичные права: БИЛЛИНГ */
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

/** Специальные права для агентств */
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

/** Объединенный тип компонентных прав */
export type ComponentPermission = 
  | OrdersPermission
  | AnalyticsPermission
  | BillingPermission
  | AgencyPermission;