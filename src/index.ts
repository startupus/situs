#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { EditorDataService } from './services/EditorDataService';
import { 
  APIResponse,
  EditorAPIError,
  ERROR_CODES,
  CreatePageRequest,
  UpdatePageRequest,
  AddComponentRequest,
  UpdateComponentRequest
} from './types/editor';

const app = express();

// Инициализация сервиса данных редактора
const editorDataService = new EditorDataService();

// Архитектурно правильная функция поиска свободного порта
async function findFreePort(startPort: number = 3000): Promise<number> {
  return new Promise((resolve) => {
    const server = createServer();
    server.listen(startPort, () => {
      const port = (server.address() as any)?.port || startPort;
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      resolve(findFreePort(startPort + 1));
    });
  });
}

// Minimal middleware - без внешних зависимостей
app.use(cors());
app.use(express.json());

// Встроенное логирование
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Utility функции для API
function createSuccessResponse<T>(data: T, processingTime: number): APIResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: `req_${Math.random().toString(36).substr(2, 9)}`,
      processingTime
    }
  };
}

function createErrorResponse(error: EditorAPIError | Error): APIResponse {
  if (error instanceof EditorAPIError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `req_${Math.random().toString(36).substr(2, 9)}`,
        processingTime: 0
      }
    };
  }

  return {
    success: false,
    error: {
      code: ERROR_CODES.INTERNAL_ERROR,
      message: 'Внутренняя ошибка сервера',
      details: error.message
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: `req_${Math.random().toString(36).substr(2, 9)}`,
      processingTime: 0
    }
  };
}

// Middleware для обработки ошибок API
function asyncHandler(fn: Function) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Валидация данных
function validateCreatePageRequest(body: any): CreatePageRequest {
  if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
    throw new EditorAPIError(ERROR_CODES.VALIDATION_ERROR, 'Поле title обязательно и должно быть непустой строкой', 400);
  }
  
  if (body.slug && (typeof body.slug !== 'string' || !/^[a-z0-9-]+$/.test(body.slug))) {
    throw new EditorAPIError(ERROR_CODES.VALIDATION_ERROR, 'Slug должен содержать только строчные буквы, цифры и дефисы', 400);
  }

  return {
    title: body.title.trim(),
    slug: body.slug?.trim(),
    template: body.template?.trim(),
    language: body.language?.trim()
  };
}

function validateAddComponentRequest(body: any): AddComponentRequest {
  if (!body.type || typeof body.type !== 'string') {
    throw new EditorAPIError(ERROR_CODES.VALIDATION_ERROR, 'Поле type обязательно', 400);
  }

  if (!body.position || typeof body.position.x !== 'number' || typeof body.position.y !== 'number') {
    throw new EditorAPIError(ERROR_CODES.VALIDATION_ERROR, 'Поле position с координатами x и y обязательно', 400);
  }

  return {
    type: body.type,
    position: body.position,
    props: body.props || {},
    parentId: body.parentId
  };
}

// === API ENDPOINTS ДЛЯ РЕДАКТОРА ===

// API для управления страницами
app.get('/api/pages', asyncHandler(async (req: express.Request, res: express.Response) => {
  const startTime = Date.now();
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string;

  const result = editorDataService.getPages(page, limit, search);
  const processingTime = Date.now() - startTime;

  res.json(createSuccessResponse(result, processingTime));
}));

app.get('/api/pages/:id', asyncHandler(async (req: express.Request, res: express.Response) => {
  const startTime = Date.now();
  const { id } = req.params;

  const page = editorDataService.getPageById(id);
  const processingTime = Date.now() - startTime;

  res.json(createSuccessResponse(page, processingTime));
}));

app.post('/api/pages', asyncHandler(async (req: express.Request, res: express.Response) => {
  const startTime = Date.now();
  const createRequest = validateCreatePageRequest(req.body);

  const newPage = editorDataService.createPage(createRequest);
  const processingTime = Date.now() - startTime;

  res.status(201).json(createSuccessResponse(newPage, processingTime));
}));

app.put('/api/pages/:id', asyncHandler(async (req: express.Request, res: express.Response) => {
  const startTime = Date.now();
  const { id } = req.params;
  const updateRequest: UpdatePageRequest = req.body;

  const updatedPage = editorDataService.updatePage(id, updateRequest);
  const processingTime = Date.now() - startTime;

  res.json(createSuccessResponse(updatedPage, processingTime));
}));

app.delete('/api/pages/:id', asyncHandler(async (req: express.Request, res: express.Response) => {
  const startTime = Date.now();
  const { id } = req.params;

  const deleted = editorDataService.deletePage(id);
  const processingTime = Date.now() - startTime;

  res.json(createSuccessResponse({ deleted }, processingTime));
}));

// API для управления компонентами на странице
app.get('/api/pages/:id/components', asyncHandler(async (req: express.Request, res: express.Response) => {
  const startTime = Date.now();
  const { id } = req.params;

  const page = editorDataService.getPageById(id);
  const processingTime = Date.now() - startTime;

  res.json(createSuccessResponse(page.components, processingTime));
}));

app.post('/api/pages/:id/components', asyncHandler(async (req: express.Request, res: express.Response) => {
  const startTime = Date.now();
  const { id } = req.params;
  const addRequest = validateAddComponentRequest(req.body);

  const newComponent = editorDataService.addComponentToPage(id, addRequest);
  const processingTime = Date.now() - startTime;

  res.status(201).json(createSuccessResponse(newComponent, processingTime));
}));

app.get('/api/pages/:pageId/components/:componentId', asyncHandler(async (req: express.Request, res: express.Response) => {
  const startTime = Date.now();
  const { pageId, componentId } = req.params;

  const component = editorDataService.getComponentFromPage(pageId, componentId);
  const processingTime = Date.now() - startTime;

  res.json(createSuccessResponse(component, processingTime));
}));

app.put('/api/pages/:pageId/components/:componentId', asyncHandler(async (req: express.Request, res: express.Response) => {
  const startTime = Date.now();
  const { pageId, componentId } = req.params;
  const updateRequest: UpdateComponentRequest = req.body;

  const updatedComponent = editorDataService.updateComponent(pageId, componentId, updateRequest);
  const processingTime = Date.now() - startTime;

  res.json(createSuccessResponse(updatedComponent, processingTime));
}));

app.delete('/api/pages/:pageId/components/:componentId', asyncHandler(async (req: express.Request, res: express.Response) => {
  const startTime = Date.now();
  const { pageId, componentId } = req.params;

  const deleted = editorDataService.deleteComponent(pageId, componentId);
  const processingTime = Date.now() - startTime;

  res.json(createSuccessResponse({ deleted }, processingTime));
}));

// API для библиотеки компонентов
app.get('/api/components', asyncHandler(async (req: express.Request, res: express.Response) => {
  const startTime = Date.now();
  const { category, search } = req.query;

  let components;
  
  if (search) {
    components = editorDataService.searchComponents(search as string);
  } else {
    components = editorDataService.getComponentsByCategory(category as string);
  }
  
  const processingTime = Date.now() - startTime;
  res.json(createSuccessResponse(components, processingTime));
}));

// API для категорий компонентов
app.get('/api/components/categories', asyncHandler(async (req: express.Request, res: express.Response) => {
  const startTime = Date.now();
  
  const categories = editorDataService.getComponentCategories();
  const processingTime = Date.now() - startTime;
  
  res.json(createSuccessResponse(categories, processingTime));
}));

// API для загрузки адаптированных компонентов
app.post('/api/components/load-adapted', asyncHandler(async (req: express.Request, res: express.Response) => {
  const startTime = Date.now();
  
  await editorDataService.loadAdaptedComponents();
  const processingTime = Date.now() - startTime;
  
  const stats = {
    totalComponents: editorDataService.getStats().totalLibraryComponents,
    categories: editorDataService.getComponentCategories(),
    processingTime
  };
  
  res.json(createSuccessResponse(stats, processingTime));
}));

app.get('/api/components/:type', asyncHandler(async (req: express.Request, res: express.Response) => {
  const startTime = Date.now();
  const { type } = req.params;

  const component = editorDataService.getComponentFromLibrary(type);
  const processingTime = Date.now() - startTime;

  res.json(createSuccessResponse(component, processingTime));
}));

// API для статистики
app.get('/api/stats', asyncHandler(async (req: express.Request, res: express.Response) => {
  const startTime = Date.now();

  const stats = editorDataService.getStats();
  const processingTime = Date.now() - startTime;

  res.json(createSuccessResponse(stats, processingTime));
}));

// ВСТРОЕННЫЕ МАРШРУТЫ (без внешних файлов)
// Health check
app.get('/health', (req, res) => {
  const stats = editorDataService.getStats();
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'situs-service',
    component: 'redaktus-editor-api',
    version: '1.0.0',
    architecture: 'monolithic-self-contained',
    data: {
      totalPages: stats.totalPages,
      totalComponents: stats.totalComponents,
      componentLibrarySize: stats.totalLibraryComponents
    }
  });
});

// Currencies API (встроенный)
app.get('/api/currencies', (req, res) => {
  res.json({
    currencies: [
      { id: 'usd', name: 'US Dollar', symbol: '$', rate: 1.0 },
      { id: 'eur', name: 'Euro', symbol: '€', rate: 0.85 },
      { id: 'mnt', name: 'Mongolian Tugrik', symbol: '₮', rate: 2800 }
    ],
    timestamp: new Date().toISOString()
  });
});

app.get('/api/currencies/stats', (req, res) => {
  res.json({
    totalCurrencies: 3,
    activeCurrencies: 3,
    lastUpdated: new Date().toISOString()
  });
});

app.get('/api/currencies/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    id,
    name: `Currency ${id.toUpperCase()}`,
    symbol: '$',
    rate: 1.0,
    active: true
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Startupus Platform - Situs Service', 
    status: 'running',
    service: 'Redaktus Editor API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      stats: '/api/stats',
      pages: '/api/pages',
      components: '/api/components',
      legacy: ['/api/currencies', '/api/currencies/stats']
    },
    architecture: 'self-contained'
  });
});

// Обработка 404 для API endpoints
app.use('/api/*', (req: express.Request, res: express.Response) => {
  res.status(404).json(createErrorResponse(
    new EditorAPIError(ERROR_CODES.PAGE_NOT_FOUND, `API endpoint ${req.path} не найден`, 404)
  ));
});

// Обработка ошибок API
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[ERROR]', err.message, err.stack);
  
  // Если это API запрос
  if (req.path.startsWith('/api/')) {
    const statusCode = err instanceof EditorAPIError ? err.statusCode : 500;
    res.status(statusCode).json(createErrorResponse(err));
    return;
  }

  // Для остальных запросов
  res.status(500).json({ error: 'Internal Server Error', architecture: 'monolithic' });
});

// Архитектурно правильный запуск с автопоиском порта
async function startServer() {
  try {
    const PORT = await findFreePort(3000);
    
    app.listen(PORT, () => {
      console.log(`[${new Date().toISOString()}] 🚀 Startupus Platform running on port ${PORT}`);
      console.log(`[${new Date().toISOString()}] 📊 Health check: http://localhost:${PORT}/health`);
      console.log(`[${new Date().toISOString()}] 🏗️  Architecture: Monolithic Self-Contained`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Архитектурно правильный запуск
startServer();

export default app; 