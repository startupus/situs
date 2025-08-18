/**
 * TypeScript интерфейсы для универсальной системы меню
 * Основано на архитектуре Joomla CMS
 */

export type MenuItemType = 'COMPONENT' | 'SEPARATOR' | 'HEADING' | 'URL';
export type AccessLevel = 'PUBLIC' | 'REGISTERED' | 'SPECIAL' | 'CUSTOM';
export type ComponentType = 'Website' | 'Store' | 'Blog' | 'Landing';

/**
 * Тип меню (аналог menutype в Joomla)
 */
export interface MenuTypeData {
  id: string;
  name: string;           // "main", "footer", "sidebar"
  title: string;          // "Главное меню"
  description?: string;
  isActive: boolean;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Пункт меню (аналог menuitem в Joomla)
 */
export interface MenuItemData {
  id: string;
  title: string;          // "Каталог товаров"
  alias: string;          // "catalog"
  type: MenuItemType;
  
  // Иерархия (как в Joomla)
  level: number;          // 1, 2, 3...
  parentId?: string;
  children?: MenuItemData[];
  orderIndex: number;
  
  // Привязка к компоненту (универсальная как в Joomla)
  component?: ComponentType;
  view?: string;          // "page", "category", "item", "list"
  layout?: string;        // "default", "blog", "grid", "form"
  targetId?: string;      // pageId, categoryId, itemId
  externalUrl?: string;   // Для type = URL
  
  // Настройки отображения
  isPublished: boolean;
  accessLevel: AccessLevel;
  language: string;       // "*", "ru-RU", "en-GB"
  
  // Параметры (JSON как в Joomla)
  parameters: MenuParameters;
  
  // SEO метаданные
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  
  // CSS и стили
  cssClass?: string;
  menuImage?: string;
  
  // Связи
  menuTypeId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Параметры пункта меню (аналог getParams() в Joomla)
 */
export interface MenuParameters {
  // Базовые параметры отображения
  menu_show?: boolean;        // Показывать в меню
  menu_image?: string;        // Изображение пункта
  css_class?: string;         // CSS класс
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;              // rel атрибут для ссылок
  
  // Параметры по типам компонентов
  website?: WebsiteMenuParameters;
  store?: StoreMenuParameters;
  blog?: BlogMenuParameters;
  landing?: LandingMenuParameters;
}

/**
 * Параметры для компонента Website
 */
export interface WebsiteMenuParameters {
  showBreadcrumbs?: boolean;
  showTitle?: boolean;
  showLastModified?: boolean;
  customCSS?: string;
  showSidebar?: boolean;
  sidebarPosition?: 'left' | 'right';
}

/**
 * Параметры для компонента Store
 */
export interface StoreMenuParameters {
  itemsPerPage?: number;
  showFilters?: boolean;
  showSorting?: boolean;
  sortBy?: 'name' | 'price' | 'date' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  showImages?: boolean;
  showPrices?: boolean;
  showDescription?: boolean;
  gridColumns?: number;
}

/**
 * Параметры для компонента Blog
 */
export interface BlogMenuParameters {
  showAuthor?: boolean;
  showDate?: boolean;
  showTags?: boolean;
  showCategories?: boolean;
  showExcerpt?: boolean;
  excerptLength?: number;
  showReadMore?: boolean;
  postsPerPage?: number;
}

/**
 * Параметры для компонента Landing
 */
export interface LandingMenuParameters {
  variant?: string;
  theme?: string;
  customData?: Record<string, any>;
  showHeader?: boolean;
  showFooter?: boolean;
  trackingCode?: string;
}

/**
 * Lookup таблица для роутинга (аналог Joomla)
 */
export interface MenuLookup {
  [viewLayout: string]: {
    [targetId: number]: string; // MenuItem.id
  };
}

/**
 * Результат поиска активного пункта меню
 */
export interface ActiveMenuResult {
  menuItem?: MenuItemData;
  breadcrumbs: MenuItemData[];
  isExactMatch: boolean;
}

/**
 * Фильтры для получения пунктов меню
 */
export interface MenuItemFilters {
  menuTypeId?: string;
  language?: string;
  level?: number;
  parentId?: string;
  component?: ComponentType;
  accessLevel?: AccessLevel;
  isPublished?: boolean;
}

/**
 * Данные для создания пункта меню
 */
export interface CreateMenuItemRequest {
  title: string;
  alias: string;
  type: MenuItemType;
  level?: number;
  parentId?: string;
  component?: ComponentType;
  view?: string;
  layout?: string;
  targetId?: string;
  externalUrl?: string;
  accessLevel?: AccessLevel;
  language?: string;
  parameters?: Partial<MenuParameters>;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  cssClass?: string;
  menuImage?: string;
  menuTypeId: string;
}

export interface CreateMenuTypeRequest {
  name: string;
  title: string;
  description?: string;
  isActive: boolean;
  projectId: string;
}

/**
 * Данные для обновления пункта меню
 */
export interface UpdateMenuItemRequest extends Partial<CreateMenuItemRequest> {
  id: string;
}

/**
 * Данные для изменения порядка пунктов меню
 */
export interface ReorderMenuItemsRequest {
  items: Array<{
    id: string;
    orderIndex: number;
    level: number;
    parentId?: string;
  }>;
}

/**
 * Ответ API с пунктами меню
 */
export interface MenuItemsResponse {
  success: boolean;
  data: MenuItemData[];
  total?: number;
  page?: number;
  limit?: number;
}

/**
 * Ответ API с типами меню
 */
export interface MenuTypesResponse {
  success: boolean;
  data: MenuTypeData[];
}