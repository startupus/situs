/**
 * Системные права доступа
 *
 * Права для системного администрирования,
 * управления контентом, меню и отчетов
 */

/** Права для аккаунтов */
export type AccountPermission =
  | 'account.create' // Создание аккаунтов
  | 'account.edit.own' // Редактирование собственного аккаунта
  | 'account.edit.all' // Редактирование всех аккаунтов
  | 'account.delete' // Удаление аккаунтов
  | 'account.manage.members' // Управление участниками аккаунта
  | 'account.billing' // Управление биллингом
  | 'account.settings'; // Изменение настроек аккаунта

/** Права для продуктов */
export type ProductPermission =
  | 'product.create' // Создание продуктов
  | 'product.edit.own' // Редактирование собственных продуктов
  | 'product.edit.all' // Редактирование всех продуктов
  | 'product.delete' // Удаление продуктов
  | 'product.publish' // Публикация продуктов
  | 'product.categories' // Управление категориями
  | 'product.items' // Управление товарами
  | 'product.pricing' // Управление ценами
  | 'product.inventory' // Управление складом
  | 'product.seo'; // SEO настройки продуктов

/** Права для контента (страницы, посты) */
export type ContentPermission =
  | 'content.create' // Создание контента
  | 'content.edit.own' // Редактирование собственного контента
  | 'content.edit.all' // Редактирование всего контента
  | 'content.delete.own' // Удаление собственного контента
  | 'content.delete.all' // Удаление всего контента
  | 'content.publish.own' // Публикация собственного контента
  | 'content.publish.all' // Публикация всего контента
  | 'content.moderate' // Модерация контента
  | 'content.seo' // SEO настройки контента
  | 'content.schedule'; // Планирование публикации

/** Права для меню */
export type MenuPermission =
  | 'menu.create' // Создание меню
  | 'menu.edit' // Редактирование меню
  | 'menu.delete' // Удаление меню
  | 'menu.publish' // Публикация пунктов меню
  | 'menu.reorder' // Изменение порядка пунктов
  | 'menu.access' // Управление доступом к пунктам меню
  | 'menu.types'; // Управление типами меню

/** Права для отчетов (общие) */
export type ReportsPermission =
  | 'reports.view.own' // Просмотр собственных отчетов
  | 'reports.view.clients' // Просмотр отчетов клиентов
  | 'reports.view.all' // Просмотр всех отчетов
  | 'reports.create' // Создание отчетов
  | 'reports.export.own' // Экспорт собственных отчетов
  | 'reports.export.clients' // Экспорт отчетов клиентов
  | 'reports.export.all' // Экспорт всех отчетов
  | 'reports.schedule' // Планирование отчетов
  | 'reports.advanced' // Расширенные отчеты
  | 'reports.custom.create'; // Создание кастомных отчетов

/** Системные права */
export type SystemPermission =
  | 'system.admin' // Системное администрирование
  | 'system.config' // Изменение конфигурации
  | 'system.maintenance' // Режим обслуживания
  | 'system.backup' // Создание резервных копий
  | 'system.logs' // Просмотр логов
  | 'system.cache' // Управление кэшем
  | 'system.updates' // Обновления системы
  | 'system.extensions' // Управление расширениями
  | 'system.database'; // Управление базой данных

/** Объединенный тип системных прав */
export type SystemPermissions =
  | AccountPermission
  | ProductPermission
  | ContentPermission
  | MenuPermission
  | ReportsPermission
  | SystemPermission;
