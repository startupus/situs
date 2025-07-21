// Типы данных для редактора Редактус

export interface ComponentProps {
  [key: string]: any;
}

export interface ComponentPosition {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface PageComponent {
  id: string;
  type: string;
  name: string;
  content: string;
  props: ComponentProps;
  position: ComponentPosition;
  parentId?: string; // для вложенных компонентов
  order: number; // порядок в контейнере
  createdAt: string;
  updatedAt: string;
}

export interface PageData {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  description?: string;
  components: PageComponent[];
  metadata: {
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    socialImage?: string;
    canonicalUrl?: string;
  };
  settings: {
    template?: string;
    theme?: string;
    language: string;
    isPrivate: boolean;
    password?: string;
    publishAt?: string;
    expireAt?: string;
  };
  createdAt: string;
  updatedAt: string;
  authorId?: string;
}

export interface ComponentLibraryItem {
  id: string;
  name: string;
  type: string;
  category: string;
  description: string;
  preview: string; // URL или base64
  defaultProps: ComponentProps;
  schema: {
    props: Array<{
      name: string;
      type: 'string' | 'number' | 'boolean' | 'color' | 'image' | 'select';
      label: string;
      defaultValue?: any;
      options?: string[]; // для select
      required?: boolean;
    }>;
  };
  tags: string[];
  isCustom: boolean;
}

export interface EditorState {
  currentPageId?: string;
  selectedComponentId?: string;
  draggedComponent?: ComponentLibraryItem;
  clipboardComponent?: PageComponent;
  history: {
    past: PageData[];
    present: PageData;
    future: PageData[];
  };
  ui: {
    device: 'mobile' | 'tablet' | 'desktop';
    showGrid: boolean;
    showOutlines: boolean;
    zoom: number;
    panelSizes: {
      left: number;
      right: number;
    };
  };
}

// API Request/Response типы
export interface CreatePageRequest {
  title: string;
  slug?: string;
  template?: string;
  language?: string;
}

export interface UpdatePageRequest {
  title?: string;
  slug?: string;
  status?: 'draft' | 'published' | 'archived';
  description?: string;
  metadata?: Partial<PageData['metadata']>;
  settings?: Partial<PageData['settings']>;
}

export interface AddComponentRequest {
  type: string;
  position: ComponentPosition;
  props?: ComponentProps;
  parentId?: string;
}

export interface UpdateComponentRequest {
  content?: string;
  props?: ComponentProps;
  position?: ComponentPosition;
  order?: number;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
    processingTime: number;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Ошибки API
export class EditorAPIError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'EditorAPIError';
  }
}

export const ERROR_CODES = {
  PAGE_NOT_FOUND: 'PAGE_NOT_FOUND',
  COMPONENT_NOT_FOUND: 'COMPONENT_NOT_FOUND',
  INVALID_REQUEST: 'INVALID_REQUEST',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SLUG_ALREADY_EXISTS: 'SLUG_ALREADY_EXISTS',
  INVALID_COMPONENT_TYPE: 'INVALID_COMPONENT_TYPE',
} as const;