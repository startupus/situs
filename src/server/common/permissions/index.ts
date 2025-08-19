/**
 * Главный экспорт модуля системы прав доступа
 * 
 * Предоставляет все необходимые компоненты для работы
 * с правами доступа в приложении
 */

// Основной модуль
export { PermissionsModule } from './permissions.module';

// Типы
export type * from './types';

// Сервисы
export * from './services';

// Декораторы
export * from './decorators';

// Guards
export * from './guards';

// Утилиты
export * from './utils';

// Конфигурация (будет создана)
export * from './config';