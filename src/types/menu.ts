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
 * Языковая версия пункта меню
 */
export interface MenuItemLanguageVersion {
  language: string;       // "ru-RU", "en-GB", "es-ES"
  title: string;          // "Каталог товаров" / "Product Catalog"
  alias: string;          // "catalog" / "catalog-en"
  externalUrl?: string;   // Может отличаться для разных языков
  
  // SEO метаданные для конкретного языка
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  
  // CSS и стили для конкретного языка
  cssClass?: string;
  menuImage?: string;
  
  // Параметры для конкретного языка
  parameters?: Partial<MenuParameters>;
}

/**
 * Пункт меню (аналог menuitem в Joomla) с поддержкой мультиязычности
 */
export interface MenuItemData {
  id: string;
  title: string;          // "Каталог товаров" (основной язык)
  alias: string;          // "catalog" (основной язык)
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
  externalUrl?: string;   // Для type = URL (основной язык)
  
  // Настройки отображения
  isPublished: boolean;
  accessLevel: AccessLevel;
  language: string;       // Основной язык: "*", "ru-RU", "en-GB"
  
  // Мультиязычность - языковые версии
  languageVersions?: MenuItemLanguageVersion[];
  
  // Параметры (JSON как в Joomla)
  parameters: MenuParameters;
  
  // SEO метаданные (основной язык)
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  
  // CSS и стили (основной язык)
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
 * Поддерживаемые языки системы
 */
export const SUPPORTED_LANGUAGES = [
  { code: '*', name: 'Все языки', flag: '🌐' },
  { code: 'ru-RU', name: 'Русский', flag: '🇷🇺' },
  { code: 'en-GB', name: 'English', flag: '🇬🇧' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
] as const;

export type SupportedLanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

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
  languageVersions?: MenuItemLanguageVersion[];
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

/**
 * Утилиты для работы с мультиязычными пунктами меню
 */
export class MenuItemLanguageUtils {
  /**
   * Получить языковую версию пункта меню
   */
  static getLanguageVersion(
    item: MenuItemData, 
    languageCode: string
  ): MenuItemLanguageVersion | null {
    if (!item.languageVersions) return null;
    return item.languageVersions.find(v => v.language === languageCode) || null;
  }

  /**
   * Получить локализованные данные пункта меню для конкретного языка
   */
  static getLocalizedMenuItem(
    item: MenuItemData, 
    languageCode: string
  ): MenuItemData {
    const version = this.getLanguageVersion(item, languageCode);
    
    if (!version) {
      return item; // Возвращаем основную версию
    }

    // Объединяем основные данные с языковой версией
    return {
      ...item,
      title: version.title || item.title,
      alias: version.alias || item.alias,
      externalUrl: version.externalUrl || item.externalUrl,
      metaTitle: version.metaTitle || item.metaTitle,
      metaDescription: version.metaDescription || item.metaDescription,
      metaKeywords: version.metaKeywords || item.metaKeywords,
      cssClass: version.cssClass || item.cssClass,
      menuImage: version.menuImage || item.menuImage,
      parameters: version.parameters ? 
        { ...item.parameters, ...version.parameters } : 
        item.parameters
    };
  }

  /**
   * Добавить или обновить языковую версию
   */
  static setLanguageVersion(
    item: MenuItemData, 
    version: MenuItemLanguageVersion
  ): MenuItemData {
    const versions = item.languageVersions || [];
    const existingIndex = versions.findIndex(v => v.language === version.language);
    
    if (existingIndex >= 0) {
      versions[existingIndex] = version;
    } else {
      versions.push(version);
    }

    return {
      ...item,
      languageVersions: versions
    };
  }

  /**
   * Удалить языковую версию
   */
  static removeLanguageVersion(
    item: MenuItemData, 
    languageCode: string
  ): MenuItemData {
    if (!item.languageVersions) return item;
    
    return {
      ...item,
      languageVersions: item.languageVersions.filter(v => v.language !== languageCode)
    };
  }

  /**
   * Получить список доступных языков для пункта меню
   */
  static getAvailableLanguages(item: MenuItemData): string[] {
    const languages = [item.language];
    if (item.languageVersions) {
      languages.push(...item.languageVersions.map(v => v.language));
    }
    return [...new Set(languages)].filter(lang => lang !== '*');
  }

  /**
   * Проверить, есть ли языковая версия для конкретного языка
   */
  static hasLanguageVersion(item: MenuItemData, languageCode: string): boolean {
    if (item.language === languageCode) return true;
    return item.languageVersions?.some(v => v.language === languageCode) || false;
  }
}