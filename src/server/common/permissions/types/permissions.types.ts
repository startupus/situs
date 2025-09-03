/**
 * Базовые типы прав доступа
 *
 * Содержит определения всех прав в системе,
 * организованных по категориям для удобства управления
 */

/** Базовые права (универсальные для всех компонентов) */
export type CorePermission =
  | 'core.admin' // Административный доступ к компоненту
  | 'core.manage' // Управление компонентом
  | 'core.create' // Создание контента
  | 'core.edit' // Редактирование любого контента
  | 'core.edit.own' // Редактирование собственного контента
  | 'core.edit.clients' // Редактирование контента клиентов (для агентств)
  | 'core.edit.state' // Изменение состояния (публикация/снятие с публикации)
  | 'core.delete' // Удаление контента
  | 'core.delete.own' // Удаление собственного контента
  | 'core.delete.clients' // Удаление контента клиентов (для агентств)
  | 'core.view' // Просмотр контента
  | 'core.view.own' // Просмотр собственного контента
  | 'core.view.clients'; // Просмотр контента клиентов

/** Права для проектов/сайтов (многосайтовая специфика) */
export type ProjectPermission =
  | 'project.create' // Создание проектов
  | 'project.create.unlimited' // Создание неограниченного количества проектов
  | 'project.edit.own' // Редактирование собственных проектов
  | 'project.edit.clients' // Редактирование проектов клиентов (агентство)
  | 'project.edit.all' // Редактирование всех проектов (глобальный админ)
  | 'project.view.own' // Просмотр собственных проектов
  | 'project.view.clients' // Просмотр проектов клиентов
  | 'project.view.all' // Просмотр всех проектов в системе
  | 'project.publish.own' // Публикация собственных проектов
  | 'project.publish.clients' // Публикация проектов клиентов
  | 'project.publish.all' // Публикация любых проектов
  | 'project.delete.own' // Удаление собственных проектов
  | 'project.delete.clients' // Удаление проектов клиентов
  | 'project.delete.all' // Удаление любых проектов
  | 'project.transfer' // Передача проектов другим пользователям
  | 'project.clone' // Клонирование проектов
  | 'project.export' // Экспорт проектов
  | 'project.import' // Импорт проектов
  | 'project.settings.basic' // Базовые настройки проектов
  | 'project.settings.advanced' // Расширенные настройки
  | 'project.domains.own' // Управление доменами собственных проектов
  | 'project.domains.clients' // Управление доменами проектов клиентов
  | 'project.domains.all' // Управление всеми доменами
  | 'project.access.manage' // Управление доступом к проектам
  | 'project.billing' // Управление биллингом проектов
  | 'project.analytics.own' // Аналитика собственных проектов
  | 'project.analytics.clients' // Аналитика проектов клиентов
  | 'project.analytics.all'; // Аналитика всех проектов

/** Права для пользователей (с учетом агентской модели) */
export type UserPermission =
  | 'user.create.clients' // Создание пользователей-клиентов
  | 'user.create.staff' // Создание сотрудников
  | 'user.create.all' // Создание любых пользователей
  | 'user.edit.profile' // Редактирование собственного профиля
  | 'user.edit.clients' // Редактирование пользователей-клиентов
  | 'user.edit.staff' // Редактирование сотрудников
  | 'user.edit.all' // Редактирование всех пользователей
  | 'user.view.own' // Просмотр собственного профиля
  | 'user.view.clients' // Просмотр пользователей-клиентов
  | 'user.view.staff' // Просмотр сотрудников
  | 'user.view.all' // Просмотр всех пользователей
  | 'user.delete.clients' // Удаление пользователей-клиентов
  | 'user.delete.staff' // Удаление сотрудников
  | 'user.delete.all' // Удаление любых пользователей
  | 'user.manage.permissions.clients' // Управление правами клиентов
  | 'user.manage.permissions.staff' // Управление правами сотрудников
  | 'user.manage.permissions.all' // Управление правами всех пользователей
  | 'user.impersonate.clients' // Вход под клиентами
  | 'user.impersonate.staff' // Вход под сотрудниками
  | 'user.impersonate.all' // Вход под любыми пользователями
  | 'user.export.clients' // Экспорт данных клиентов
  | 'user.export.all' // Экспорт всех данных пользователей
  | 'user.ban.clients' // Блокировка клиентов
  | 'user.ban.all' // Блокировка любых пользователей
  | 'user.activate.clients' // Активация клиентов
  | 'user.activate.all'; // Активация любых пользователей

/** Объединенный тип всех базовых прав */
export type BasePermission = CorePermission | ProjectPermission | UserPermission;
