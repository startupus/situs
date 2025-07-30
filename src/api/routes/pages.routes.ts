import { Router } from 'express';
import PageController from '../controllers/PageController';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { asyncHandler } from '../middleware/error.middleware';
import { requireAuth } from '../middleware/auth.middleware';
import { PageSchemas, ParamSchemas } from '../validation/schemas';
import { z } from 'zod';

/**
 * Pages Routes - Маршруты для управления страницами
 * Включают авторизацию, валидацию и проверку владения ресурсами
 */

const router = Router();

/**
 * GET /api/pages
 * Получение всех страниц с фильтрацией
 */
router.get(
  '/',
  ...requireAuth,
  validateQuery(PageSchemas.filters),
  asyncHandler(PageController.find)
);

/**
 * POST /api/pages
 * Создание новой страницы
 */
router.post(
  '/',
  ...requireAuth,
  validateBody(PageSchemas.create),
  asyncHandler(PageController.create)
);

/**
 * GET /api/pages/:id
 * Получение страницы по ID
 */
router.get(
  '/:id',
  ...requireAuth,
  validateParams(ParamSchemas.id),
  asyncHandler(PageController.findOne)
);

/**
 * PUT /api/pages/:id
 * Обновление страницы
 */
router.put(
  '/:id',
  ...requireAuth,
  validateParams(ParamSchemas.id),
  validateBody(PageSchemas.update),
  asyncHandler(PageController.update)
);

/**
 * DELETE /api/pages/:id
 * Удаление страницы
 */
router.delete(
  '/:id',
  ...requireAuth,
  validateParams(ParamSchemas.id),
  asyncHandler(PageController.delete)
);

/**
 * POST /api/pages/:id/duplicate
 * Дублирование страницы
 */
router.post(
  '/:id/duplicate',
  ...requireAuth,
  validateParams(ParamSchemas.id),
  validateBody(PageSchemas.duplicate),
  asyncHandler(PageController.duplicate)
);

/**
 * PUT /api/pages/:id/publish
 * Публикация страницы
 */
router.put(
  '/:id/publish',
  ...requireAuth,
  validateParams(ParamSchemas.id),
  asyncHandler(PageController.publish)
);

/**
 * PUT /api/pages/:id/unpublish
 * Снятие страницы с публикации
 */
router.put(
  '/:id/unpublish',
  ...requireAuth,
  validateParams(ParamSchemas.id),
  asyncHandler(PageController.unpublish)
);

/**
 * GET /api/projects/:projectId/pages/statistics
 * Получение статистики страниц для проекта
 */
router.get(
  '/projects/:projectId/statistics',
  ...requireAuth,
  validateParams(z.object({ projectId: z.string().uuid() })),
  asyncHandler(PageController.getStatistics)
);

/**
 * GET /api/projects/:projectId/pages/:slug
 * Получение страницы по slug в проекте
 */
router.get(
  '/projects/:projectId/pages/:slug',
  ...requireAuth,
  validateParams(ParamSchemas.projectSlug),
  asyncHandler(PageController.findBySlug)
);

export default router;