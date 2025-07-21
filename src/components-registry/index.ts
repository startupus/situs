// 🏛️ Component Registry System - Main Export

// Экспорт типов (переименовываем ComponentRegistry интерфейс для избежания конфликта)
export type {
  ComponentMetadata,
  ComponentInstance,
  ComponentSearchQuery,
  ComponentSearchResult,
  ComponentCategory,
  ComponentSource,
  ComponentRegistryEvents,
  ComponentRegistry as IComponentRegistry
} from './types';

// Экспорт класса ComponentRegistry
export { ComponentRegistry, componentRegistry } from './ComponentRegistry';

// Re-export singleton для удобства
export { componentRegistry as registry } from './ComponentRegistry';

// Утилитарные функции для быстрого доступа
export const getRegistry = () => import('./ComponentRegistry').then(m => m.componentRegistry.getRegistry());
export const searchComponents = (query: any) => import('./ComponentRegistry').then(m => m.componentRegistry.searchComponents(query)); 