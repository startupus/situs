/**
 * Типы ролей в многоуровневой системе
 *
 * Определяет все роли пользователей и их иерархию
 */

/** Глобальные роли пользователей */
export type GlobalRole =
  | 'SUPER_ADMIN' // Супер администратор - полный доступ
  | 'STAFF' // Персонал - системное администрирование
  | 'AGENCY' // Агентство - управление клиентами
  | 'BUSINESS'; // Бизнес-пользователь - собственные проекты

/** Роли в проекте */
export type ProjectRole =
  | 'OWNER' // Владелец проекта
  | 'ADMIN' // Администратор проекта
  | 'EDITOR' // Редактор контента
  | 'VIEWER'; // Только просмотр

/** Роли в аккаунте */
export type AccountRole =
  | 'OWNER' // Владелец аккаунта
  | 'ADMIN' // Администратор аккаунта
  | 'MANAGER' // Менеджер
  | 'MEMBER'; // Участник

/** Информация о роли */
export interface RoleInfo {
  id: GlobalRole;
  name: string;
  description: string;
  level: number;
  inheritsFrom?: GlobalRole;
  limitations?: {
    maxProjects?: number;
    maxClients?: number;
    maxStorage?: number;
    allowedComponents?: string[];
  };
}
