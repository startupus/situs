import { Router } from 'express';
import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
import projectsRoutes from './projects.routes';
import pagesRoutes from './pages.routes';
import analyticsRoutes from './analytics.routes';

/**
 * API Routes Index - Главный роутер для всех API маршрутов
 * Объединяет все модульные маршруты в единую структуру
 */

const router = Router();

/**
 * Подключение всех модульных маршрутов
 */

// Маршруты аутентификации
router.use('/auth', authRoutes);

// Маршруты пользователей
router.use('/users', usersRoutes);

// Маршруты проектов
router.use('/projects', projectsRoutes);

// Маршруты страниц
router.use('/pages', pagesRoutes);

// Маршруты аналитики
router.use('/analytics', analyticsRoutes);

/**
 * Информационный эндпоинт API
 * GET /api
 */
router.get('/', (req, res) => {
  res.json({
    name: 'Redaktus API',
    version: '1.0.0',
    description: 'RESTful API для CMS платформы Redaktus',
    documentation: '/api/docs', // Будущий Swagger endpoint
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      projects: '/api/projects',
      pages: '/api/pages',
      analytics: '/api/analytics'
    },
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

/**
 * Health check эндпоинт
 * GET /api/health
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version
  });
});

export default router;