#!/usr/bin/env node

const express = require('express');
const cors = require('cors');
const { createServer } = require('http');

const app = express();

// Простое in-memory хранилище для демонстрации
const pagesStore = new Map();
const componentsLibrary = new Map();
let nextPageId = 1;
let nextComponentId = 1;

// Инициализация демо данных
function initializeData() {
  // Создаем демо страницу
  const demoPage = {
    id: 'page_1',
    title: 'Главная страница',
    slug: 'home',
    status: 'draft',
    description: 'Демо страница для тестирования',
    components: [
      {
        id: 'component_1',
        type: 'heading',
        name: 'Заголовок',
        content: 'Добро пожаловать в Редактус!',
        props: { level: 1, color: '#000000', align: 'center' },
        position: { x: 50, y: 50 },
        order: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    metadata: {
      seoTitle: 'Главная страница',
      seoDescription: 'Демо страница'
    },
    settings: {
      template: 'landing',
      theme: 'light',
      language: 'ru',
      isPrivate: false
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  pagesStore.set('page_1', demoPage);
  nextPageId = 2;
  nextComponentId = 2;

  // Инициализация библиотеки компонентов
  const components = [
    {
      id: 'heading',
      name: 'Заголовок',
      type: 'heading',
      category: 'text',
      description: 'Заголовок различных уровней (H1-H6)',
      preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIj48dGV4dCB4PSI1IiB5PSIyNSIgZm9udC1zaXplPSIyMCIgZm9udC13ZWlnaHQ9ImJvbGQiPkg8L3RleHQ+PC9zdmc+',
      defaultProps: {
        level: 1,
        color: '#000000',
        align: 'left',
        fontFamily: 'Inter'
      },
      schema: {
        props: [
          { name: 'level', type: 'select', label: 'Уровень', defaultValue: 1, options: ['1', '2', '3', '4', '5', '6'], required: true },
          { name: 'color', type: 'color', label: 'Цвет', defaultValue: '#000000' },
          { name: 'align', type: 'select', label: 'Выравнивание', defaultValue: 'left', options: ['left', 'center', 'right'] }
        ]
      },
      tags: ['text', 'heading', 'title'],
      isCustom: false
    },
    {
      id: 'paragraph',
      name: 'Текст',
      type: 'paragraph',
      category: 'text',
      description: 'Обычный текстовый блок',
      preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIj48dGV4dCB4PSI1IiB5PSIxNSIgZm9udC1zaXplPSIxMiI+VGV4dDwvdGV4dD48L3N2Zz4=',
      defaultProps: {
        fontSize: 16,
        color: '#333333',
        lineHeight: 1.5,
        align: 'left'
      },
      schema: {
        props: [
          { name: 'fontSize', type: 'number', label: 'Размер шрифта', defaultValue: 16 },
          { name: 'color', type: 'color', label: 'Цвет', defaultValue: '#333333' }
        ]
      },
      tags: ['text', 'paragraph', 'content'],
      isCustom: false
    }
  ];

  components.forEach(comp => {
    componentsLibrary.set(comp.type, comp);
  });
}

// Автопоиск свободного порта
async function findFreePort(startPort = 3000) {
  return new Promise((resolve) => {
    const server = createServer();
    server.listen(startPort, () => {
      const port = server.address()?.port || startPort;
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      resolve(findFreePort(startPort + 1));
    });
  });
}

// Middleware
app.use(cors());
app.use(express.json());

// Логирование
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Utility функции
function createSuccessResponse(data, processingTime = 0) {
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

function createErrorResponse(message, code = 'INTERNAL_ERROR', statusCode = 500) {
  return {
    success: false,
    error: {
      code,
      message,
      details: null
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: `req_${Math.random().toString(36).substr(2, 9)}`,
      processingTime: 0
    }
  };
}

// === API ENDPOINTS ===

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'situs-service',
    component: 'redaktus-editor-api',
    version: '1.0.0',
    architecture: 'monolithic-self-contained',
    data: {
      totalPages: pagesStore.size,
      totalComponents: Array.from(pagesStore.values()).reduce((sum, page) => sum + page.components.length, 0),
      componentLibrarySize: componentsLibrary.size
    }
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
      components: '/api/components'
    },
    architecture: 'self-contained'
  });
});

// Получить все страницы
app.get('/api/pages', (req, res) => {
  const startTime = Date.now();
  const allPages = Array.from(pagesStore.values());
  const processingTime = Date.now() - startTime;

  res.json(createSuccessResponse({
    items: allPages,
    total: allPages.length,
    page: 1,
    limit: 10,
    hasNext: false,
    hasPrev: false
  }, processingTime));
});

// Получить страницу по ID
app.get('/api/pages/:id', (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;
  const page = pagesStore.get(id);

  if (!page) {
    return res.status(404).json(createErrorResponse(`Страница с ID ${id} не найдена`, 'PAGE_NOT_FOUND', 404));
  }

  const processingTime = Date.now() - startTime;
  res.json(createSuccessResponse(page, processingTime));
});

// Создать новую страницу
app.post('/api/pages', (req, res) => {
  const startTime = Date.now();
  const { title, slug, template, language } = req.body;

  if (!title) {
    return res.status(400).json(createErrorResponse('Поле title обязательно', 'VALIDATION_ERROR', 400));
  }

  const id = `page_${nextPageId++}`;
  const now = new Date().toISOString();

  const newPage = {
    id,
    title,
    slug: slug || title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    status: 'draft',
    description: '',
    components: [],
    metadata: {
      seoTitle: title,
      seoDescription: ''
    },
    settings: {
      template: template || 'default',
      theme: 'light',
      language: language || 'ru',
      isPrivate: false
    },
    createdAt: now,
    updatedAt: now
  };

  pagesStore.set(id, newPage);
  const processingTime = Date.now() - startTime;

  res.status(201).json(createSuccessResponse(newPage, processingTime));
});

// Обновить страницу
app.put('/api/pages/:id', (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;
  const page = pagesStore.get(id);

  if (!page) {
    return res.status(404).json(createErrorResponse(`Страница с ID ${id} не найдена`, 'PAGE_NOT_FOUND', 404));
  }

  const updatedPage = {
    ...page,
    ...req.body,
    id, // Предотвращаем изменение ID
    updatedAt: new Date().toISOString()
  };

  pagesStore.set(id, updatedPage);
  const processingTime = Date.now() - startTime;

  res.json(createSuccessResponse(updatedPage, processingTime));
});

// Удалить страницу
app.delete('/api/pages/:id', (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  if (!pagesStore.has(id)) {
    return res.status(404).json(createErrorResponse(`Страница с ID ${id} не найдена`, 'PAGE_NOT_FOUND', 404));
  }

  pagesStore.delete(id);
  const processingTime = Date.now() - startTime;

  res.json(createSuccessResponse({ deleted: true }, processingTime));
});

// Получить компоненты библиотеки
app.get('/api/components', (req, res) => {
  const startTime = Date.now();
  const components = Array.from(componentsLibrary.values());
  const processingTime = Date.now() - startTime;

  res.json(createSuccessResponse(components, processingTime));
});

// Получить статистику
app.get('/api/stats', (req, res) => {
  const startTime = Date.now();
  const stats = {
    totalPages: pagesStore.size,
    totalComponents: Array.from(pagesStore.values()).reduce((sum, page) => sum + page.components.length, 0),
    totalLibraryComponents: componentsLibrary.size,
    pagesByStatus: {
      draft: Array.from(pagesStore.values()).filter(p => p.status === 'draft').length,
      published: Array.from(pagesStore.values()).filter(p => p.status === 'published').length,
      archived: Array.from(pagesStore.values()).filter(p => p.status === 'archived').length
    }
  };
  const processingTime = Date.now() - startTime;

  res.json(createSuccessResponse(stats, processingTime));
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message, err.stack);
  res.status(500).json(createErrorResponse('Внутренняя ошибка сервера', 'INTERNAL_ERROR', 500));
});

// Запуск сервера
async function startServer() {
  try {
    initializeData();
    const PORT = await findFreePort(3000);

    app.listen(PORT, () => {
      console.log(`[${new Date().toISOString()}] 🚀 Redaktus Editor API running on port ${PORT}`);
      console.log(`[${new Date().toISOString()}] 📊 Health check: http://localhost:${PORT}/health`);
      console.log(`[${new Date().toISOString()}] 🏗️  API Documentation: http://localhost:${PORT}/`);
      console.log(`[${new Date().toISOString()}] 📄 Pages API: http://localhost:${PORT}/api/pages`);
      console.log(`[${new Date().toISOString()}] 🧩 Components API: http://localhost:${PORT}/api/components`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();