// 🏛️ Component Registry Types
// Типы для централизованного управления компонентами

export interface ComponentMetadata {
  id: string;                    // Уникальный ID компонента
  name: string;                  // Отображаемое имя
  description?: string;          // Описание компонента
  category: ComponentCategory;   // Основная категория
  subcategory: string;          // Подкатегория (buttons, cards, hero, etc.)
  source: ComponentSource;       // Источник компонента
  preview: {
    thumbnail: string;           // URL превью из tailgrids.com
    demo?: string;              // URL демо компонента
    screenshots?: string[];      // Дополнительные скриншоты
  };
  component: {
    path: string;               // Путь к файлу компонента
    props: Record<string, any>; // Дефолтные props
    dependencies?: string[];     // Зависимости компонента
  };
  tags: string[];              // Теги для поиска и фильтрации
  readonly: boolean;           // Можно ли редактировать исходник
  featured?: boolean;          // Рекомендуемый компонент
  popularity?: number;         // Рейтинг популярности
  createdAt: string;          // Дата добавления
  updatedAt: string;          // Дата последнего обновления
}

export type ComponentCategory = 'core' | 'pro' | 'templates' | 'custom';

export type ComponentSource = 'free' | 'pro' | 'templates' | 'ai-generated' | 'user-custom';

export interface ComponentInstance {
  id: string;                  // ID экземпляра
  sourceComponentId: string;   // ID исходного компонента
  name: string;               // Пользовательское имя
  customProps: Record<string, any>; // Кастомные props
  customCode?: string;        // Модифицированный код
  projectId?: string;         // ID проекта
  createdAt: string;
  updatedAt: string;
}

export interface ComponentRegistry {
  version: string;            // Версия реестра
  lastUpdated: string;       // Последнее обновление
  components: ComponentMetadata[];
  categories: {
    [key in ComponentCategory]: {
      label: string;
      icon: string;
      description: string;
      subcategories: string[];
      componentIds: string[];   // ID компонентов в категории
    };
  };
  sources: {
    [key in ComponentSource]: {
      label: string;
      description: string;
      baseUrl?: string;        // Базовый URL для компонентов
      readonly: boolean;
    };
  };
  stats: {
    totalComponents: number;
    componentsByCategory: Record<ComponentCategory, number>;
    componentsBySource: Record<ComponentSource, number>;
  };
}

export interface ComponentSearchQuery {
  query?: string;             // Текстовый поиск
  category?: ComponentCategory;
  subcategory?: string;
  source?: ComponentSource;
  tags?: string[];
  featured?: boolean;
  sortBy?: 'name' | 'popularity' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface ComponentSearchResult {
  components: ComponentMetadata[];
  total: number;
  hasMore: boolean;
}

// События для Component Registry
export interface ComponentRegistryEvents {
  'component:added': ComponentMetadata;
  'component:updated': ComponentMetadata;
  'component:removed': string; // componentId
  'instance:created': ComponentInstance;
  'instance:updated': ComponentInstance;
  'registry:synced': ComponentRegistry;
} 