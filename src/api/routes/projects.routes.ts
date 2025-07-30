import { Router } from 'express';
import ProjectController from '../controllers/ProjectController';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { asyncHandler } from '../middleware/error.middleware';
import { requireAuth } from '../middleware/auth.middleware';
import { ProjectSchemas, ParamSchemas } from '../validation/schemas';

/**
 * Projects Routes - Маршруты для управления проектами
 * Включают авторизацию, валидацию и проверку владения ресурсами
 */

const router = Router();

/**
 * GET /api/projects/statistics
 * Получение статистики проектов пользователя
 */
router.get(
  '/statistics',
  ...requireAuth,
  asyncHandler(ProjectController.getStatistics)
);

/**
 * GET /api/projects
 * Получение всех проектов пользователя с фильтрацией
 */
router.get(
  '/',
  ...requireAuth,
  validateQuery(ProjectSchemas.filters),
  asyncHandler(ProjectController.find)
);

/**
 * POST /api/projects
 * Создание нового проекта
 */
router.post(
  '/',
  ...requireAuth,
  validateBody(ProjectSchemas.create),
  asyncHandler(ProjectController.create)
);

/**
 * GET /api/projects/:id
 * Получение проекта по ID
 */
router.get(
  '/:id',
  ...requireAuth,
  validateParams(ParamSchemas.id),
  asyncHandler(ProjectController.findOne)
);

/**
 * PUT /api/projects/:id
 * Обновление проекта
 */
router.put(
  '/:id',
  ...requireAuth,
  validateParams(ParamSchemas.id),
  validateBody(ProjectSchemas.update),
  asyncHandler(ProjectController.update)
);

/**
 * DELETE /api/projects/:id
 * Удаление проекта
 */
router.delete(
  '/:id',
  ...requireAuth,
  validateParams(ParamSchemas.id),
  asyncHandler(ProjectController.delete)
);

/**
 * PUT /api/projects/:id/publish
 * Публикация проекта
 */
router.put(
  '/:id/publish',
  ...requireAuth,
  validateParams(ParamSchemas.id),
  asyncHandler(ProjectController.publish)
);

/**
 * PUT /api/projects/:id/unpublish
 * Снятие проекта с публикации
 */
router.put(
  '/:id/unpublish',
  ...requireAuth,
  validateParams(ParamSchemas.id),
  asyncHandler(ProjectController.unpublish)
);

export default router;