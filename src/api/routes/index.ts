import { Router } from 'express';
import authRoutes from './auth.routes';
import projectsRoutes from './projects.routes';
import pagesRoutes from './pages.routes';

const router = Router();

/**
 * Основные маршруты API
 * /api/auth - Аутентификация и регистрация
 * /api/projects - Управление проектами
 * /api/pages - Управление страницами
 */

// Маршруты аутентификации
router.use('/auth', authRoutes);

// Маршруты проектов
router.use('/projects', projectsRoutes);

// Маршруты страниц
router.use('/pages', pagesRoutes);

// Корневой маршрут API
router.get('/', (req, res) => {
  res.json({
    message: 'Situs API v1.0.0',
    endpoints: {
      auth: '/api/auth',
      projects: '/api/projects',
      pages: '/api/pages'
    },
    documentation: '/api/docs'
  });
});

export default router;