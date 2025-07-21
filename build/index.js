#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const EditorDataService_1 = require("./services/EditorDataService");
const editor_1 = require("./types/editor");
const app = (0, express_1.default)();
// Инициализация сервиса данных редактора
const editorDataService = new EditorDataService_1.EditorDataService();
// Архитектурно правильная функция поиска свободного порта
async function findFreePort(startPort = 3000) {
    return new Promise((resolve) => {
        const server = (0, http_1.createServer)();
        server.listen(startPort, () => {
            const port = server.address()?.port || startPort;
            server.close(() => resolve(port));
        });
        server.on('error', () => {
            resolve(findFreePort(startPort + 1));
        });
    });
}
// Minimal middleware - без внешних зависимостей
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Встроенное логирование
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});
// Utility функции для API
function createSuccessResponse(data, processingTime) {
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
function createErrorResponse(error) {
    if (error instanceof editor_1.EditorAPIError) {
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
            code: editor_1.ERROR_CODES.INTERNAL_ERROR,
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
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
// Валидация данных
function validateCreatePageRequest(body) {
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
        throw new editor_1.EditorAPIError(editor_1.ERROR_CODES.VALIDATION_ERROR, 'Поле title обязательно и должно быть непустой строкой', 400);
    }
    if (body.slug && (typeof body.slug !== 'string' || !/^[a-z0-9-]+$/.test(body.slug))) {
        throw new editor_1.EditorAPIError(editor_1.ERROR_CODES.VALIDATION_ERROR, 'Slug должен содержать только строчные буквы, цифры и дефисы', 400);
    }
    return {
        title: body.title.trim(),
        slug: body.slug?.trim(),
        template: body.template?.trim(),
        language: body.language?.trim()
    };
}
function validateAddComponentRequest(body) {
    if (!body.type || typeof body.type !== 'string') {
        throw new editor_1.EditorAPIError(editor_1.ERROR_CODES.VALIDATION_ERROR, 'Поле type обязательно', 400);
    }
    if (!body.position || typeof body.position.x !== 'number' || typeof body.position.y !== 'number') {
        throw new editor_1.EditorAPIError(editor_1.ERROR_CODES.VALIDATION_ERROR, 'Поле position с координатами x и y обязательно', 400);
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
app.get('/api/pages', asyncHandler(async (req, res) => {
    const startTime = Date.now();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search;
    const result = editorDataService.getPages(page, limit, search);
    const processingTime = Date.now() - startTime;
    res.json(createSuccessResponse(result, processingTime));
}));
app.get('/api/pages/:id', asyncHandler(async (req, res) => {
    const startTime = Date.now();
    const { id } = req.params;
    const page = editorDataService.getPageById(id);
    const processingTime = Date.now() - startTime;
    res.json(createSuccessResponse(page, processingTime));
}));
app.post('/api/pages', asyncHandler(async (req, res) => {
    const startTime = Date.now();
    const createRequest = validateCreatePageRequest(req.body);
    const newPage = editorDataService.createPage(createRequest);
    const processingTime = Date.now() - startTime;
    res.status(201).json(createSuccessResponse(newPage, processingTime));
}));
app.put('/api/pages/:id', asyncHandler(async (req, res) => {
    const startTime = Date.now();
    const { id } = req.params;
    const updateRequest = req.body;
    const updatedPage = editorDataService.updatePage(id, updateRequest);
    const processingTime = Date.now() - startTime;
    res.json(createSuccessResponse(updatedPage, processingTime));
}));
app.delete('/api/pages/:id', asyncHandler(async (req, res) => {
    const startTime = Date.now();
    const { id } = req.params;
    const deleted = editorDataService.deletePage(id);
    const processingTime = Date.now() - startTime;
    res.json(createSuccessResponse({ deleted }, processingTime));
}));
// API для управления компонентами на странице
app.get('/api/pages/:id/components', asyncHandler(async (req, res) => {
    const startTime = Date.now();
    const { id } = req.params;
    const page = editorDataService.getPageById(id);
    const processingTime = Date.now() - startTime;
    res.json(createSuccessResponse(page.components, processingTime));
}));
app.post('/api/pages/:id/components', asyncHandler(async (req, res) => {
    const startTime = Date.now();
    const { id } = req.params;
    const addRequest = validateAddComponentRequest(req.body);
    const newComponent = editorDataService.addComponentToPage(id, addRequest);
    const processingTime = Date.now() - startTime;
    res.status(201).json(createSuccessResponse(newComponent, processingTime));
}));
app.get('/api/pages/:pageId/components/:componentId', asyncHandler(async (req, res) => {
    const startTime = Date.now();
    const { pageId, componentId } = req.params;
    const component = editorDataService.getComponentFromPage(pageId, componentId);
    const processingTime = Date.now() - startTime;
    res.json(createSuccessResponse(component, processingTime));
}));
app.put('/api/pages/:pageId/components/:componentId', asyncHandler(async (req, res) => {
    const startTime = Date.now();
    const { pageId, componentId } = req.params;
    const updateRequest = req.body;
    const updatedComponent = editorDataService.updateComponent(pageId, componentId, updateRequest);
    const processingTime = Date.now() - startTime;
    res.json(createSuccessResponse(updatedComponent, processingTime));
}));
app.delete('/api/pages/:pageId/components/:componentId', asyncHandler(async (req, res) => {
    const startTime = Date.now();
    const { pageId, componentId } = req.params;
    const deleted = editorDataService.deleteComponent(pageId, componentId);
    const processingTime = Date.now() - startTime;
    res.json(createSuccessResponse({ deleted }, processingTime));
}));
// API для библиотеки компонентов
app.get('/api/components', asyncHandler(async (req, res) => {
    const startTime = Date.now();
    const category = req.query.category;
    const components = editorDataService.getComponentLibrary(category);
    const processingTime = Date.now() - startTime;
    res.json(createSuccessResponse(components, processingTime));
}));
app.get('/api/components/:type', asyncHandler(async (req, res) => {
    const startTime = Date.now();
    const { type } = req.params;
    const component = editorDataService.getComponentFromLibrary(type);
    const processingTime = Date.now() - startTime;
    res.json(createSuccessResponse(component, processingTime));
}));
// API для статистики
app.get('/api/stats', asyncHandler(async (req, res) => {
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
app.use('/api/*', (req, res) => {
    res.status(404).json(createErrorResponse(new editor_1.EditorAPIError(editor_1.ERROR_CODES.PAGE_NOT_FOUND, `API endpoint ${req.path} не найден`, 404)));
});
// Обработка ошибок API
app.use((err, req, res, next) => {
    console.error('[ERROR]', err.message, err.stack);
    // Если это API запрос
    if (req.path.startsWith('/api/')) {
        const statusCode = err instanceof editor_1.EditorAPIError ? err.statusCode : 500;
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
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
// Архитектурно правильный запуск
startServer();
exports.default = app;
