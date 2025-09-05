/**
 * Универсальные утилиты для работы с путями
 * Автоматически определяют правильные пути в зависимости от среды выполнения
 */

interface PathConfig {
  api: {
    baseUrl: string;
    internalUrl: string;
    healthUrl: string;
    docsUrl: string;
  };
  frontend: {
    baseUrl: string;
    internalUrl: string;
  };
  static: {
    baseUrl: string;
    internalUrl: string;
  };
  media: {
    baseUrl: string;
    internalUrl: string;
  };
  websocket: {
    baseUrl: string;
    internalUrl: string;
  };
  sse: {
    baseUrl: string;
    internalUrl: string;
  };
}

/**
 * Определяет, запущено ли приложение в Docker контейнере
 */
const isDocker = (): boolean => {
  return process.env.DOCKER_ENV === 'true' || process.env.CONTAINER === 'true' || process.env.NODE_ENV === 'production';
};

/**
 * Определяет, запущено ли приложение в development режиме
 */
const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev';
};

/**
 * Определяет, запущено ли приложение в production режиме
 */
const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

/**
 * Получает базовый URL для API
 */
const getApiBaseUrl = (): string => {
  if (isDocker()) {
    return process.env.VITE_API_BASE_URL || 'http://localhost:3002';
  } else if (isDevelopment()) {
    return process.env.VITE_API_BASE_URL || 'http://localhost:3002';
  } else {
    return process.env.VITE_API_BASE_URL || 'https://api.situs.com';
  }
};

/**
 * Получает базовый URL для фронтенда
 */
const getFrontendBaseUrl = (): string => {
  if (isDocker()) {
    return process.env.VITE_FRONTEND_BASE_URL || 'http://localhost:5177';
  } else if (isDevelopment()) {
    return process.env.VITE_FRONTEND_BASE_URL || 'http://localhost:5177';
  } else {
    return process.env.VITE_FRONTEND_BASE_URL || 'https://situs.com';
  }
};

/**
 * Получает базовый URL для статических файлов
 */
const getStaticBaseUrl = (): string => {
  if (isDocker()) {
    return process.env.VITE_STATIC_BASE_URL || 'http://localhost:3002/static';
  } else if (isDevelopment()) {
    return process.env.VITE_STATIC_BASE_URL || 'http://localhost:3002/static';
  } else {
    return process.env.VITE_STATIC_BASE_URL || 'https://cdn.situs.com';
  }
};

/**
 * Получает базовый URL для медиа файлов
 */
const getMediaBaseUrl = (): string => {
  if (isDocker()) {
    return process.env.VITE_MEDIA_BASE_URL || 'http://localhost:3002/media';
  } else if (isDevelopment()) {
    return process.env.VITE_MEDIA_BASE_URL || 'http://localhost:3002/media';
  } else {
    return process.env.VITE_MEDIA_BASE_URL || 'https://media.situs.com';
  }
};

/**
 * Получает базовый URL для WebSocket соединений
 */
const getWebSocketBaseUrl = (): string => {
  if (isDocker()) {
    return process.env.VITE_WS_BASE_URL || 'ws://localhost:3002';
  } else if (isDevelopment()) {
    return process.env.VITE_WS_BASE_URL || 'ws://localhost:3002';
  } else {
    return process.env.VITE_WS_BASE_URL || 'wss://ws.situs.com';
  }
};

/**
 * Получает базовый URL для SSE соединений
 */
const getSSEBaseUrl = (): string => {
  if (isDocker()) {
    return process.env.VITE_SSE_BASE_URL || 'http://localhost:3002/api/realtime';
  } else if (isDevelopment()) {
    return process.env.VITE_SSE_BASE_URL || 'http://localhost:3002/api/realtime';
  } else {
    return process.env.VITE_SSE_BASE_URL || 'https://api.situs.com/realtime';
  }
};

/**
 * Создает полный URL для API эндпоинта
 */
export const createApiUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

/**
 * Создает полный URL для статического файла
 */
export const createStaticUrl = (path: string): string => {
  const baseUrl = getStaticBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

/**
 * Создает полный URL для медиа файла
 */
export const createMediaUrl = (path: string): string => {
  const baseUrl = getMediaBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

/**
 * Создает полный URL для WebSocket соединения
 */
export const createWebSocketUrl = (endpoint: string): string => {
  const baseUrl = getWebSocketBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

/**
 * Создает полный URL для SSE соединения
 */
export const createSSEUrl = (endpoint: string): string => {
  const baseUrl = getSSEBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

/**
 * Получает конфигурацию путей
 */
export const getPathConfig = (): PathConfig => {
  return {
    api: {
      baseUrl: getApiBaseUrl(),
      internalUrl: process.env.VITE_API_INTERNAL_URL || getApiBaseUrl(),
      healthUrl: `${getApiBaseUrl()}/health`,
      docsUrl: `${getApiBaseUrl()}/api-docs`,
    },
    frontend: {
      baseUrl: getFrontendBaseUrl(),
      internalUrl: process.env.VITE_FRONTEND_INTERNAL_URL || getFrontendBaseUrl(),
    },
    static: {
      baseUrl: getStaticBaseUrl(),
      internalUrl: process.env.VITE_STATIC_INTERNAL_URL || getStaticBaseUrl(),
    },
    media: {
      baseUrl: getMediaBaseUrl(),
      internalUrl: process.env.VITE_MEDIA_INTERNAL_URL || getMediaBaseUrl(),
    },
    websocket: {
      baseUrl: getWebSocketBaseUrl(),
      internalUrl: process.env.VITE_WS_INTERNAL_URL || getWebSocketBaseUrl(),
    },
    sse: {
      baseUrl: getSSEBaseUrl(),
      internalUrl: process.env.VITE_SSE_INTERNAL_URL || getSSEBaseUrl(),
    },
  };
};

/**
 * Проверяет, является ли URL абсолютным
 */
export const isAbsoluteUrl = (url: string): boolean => {
  return /^https?:\/\//.test(url);
};

/**
 * Нормализует путь, убирая лишние слэши
 */
export const normalizePath = (path: string): string => {
  return path.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
};

/**
 * Создает относительный путь для API
 */
export const createApiPath = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `/api${cleanEndpoint}`;
};

/**
 * Создает относительный путь для статических файлов
 */
export const createStaticPath = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `/static${cleanPath}`;
};

/**
 * Создает относительный путь для медиа файлов
 */
export const createMediaPath = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `/media${cleanPath}`;
};

/**
 * Получает информацию о текущем окружении
 */
export const getEnvironmentInfo = () => {
  return {
    isDocker: isDocker(),
    isDevelopment: isDevelopment(),
    isProduction: isProduction(),
    environment: process.env.NODE_ENV || 'development',
    apiBaseUrl: getApiBaseUrl(),
    frontendBaseUrl: getFrontendBaseUrl(),
  };
};

/**
 * Утилиты для работы с путями
 */
export const pathUtils = {
  createApiUrl,
  createStaticUrl,
  createMediaUrl,
  createWebSocketUrl,
  createSSEUrl,
  createApiPath,
  createStaticPath,
  createMediaPath,
  getPathConfig,
  isAbsoluteUrl,
  normalizePath,
  getEnvironmentInfo,
  isDocker,
  isDevelopment,
  isProduction,
};

export default pathUtils;
