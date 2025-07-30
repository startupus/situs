import { Router } from 'express';
import UserController from '../controllers/UserController';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { asyncHandler } from '../middleware/error.middleware';
import { requireAuth, requireAdmin, authenticate, checkUserActive } from '../middleware/auth.middleware';
import { UserSchemas, ParamSchemas, CommonSchemas } from '../validation/schemas';

/**
 * Users Routes - Маршруты для управления пользователями
 * Включают авторизацию, валидацию и разграничение прав доступа
 */

const router = Router();

/**
 * GET /api/users/statistics
 * Получение статистики пользователей (только для админов)
 */
router.get(
  '/statistics',
  ...requireAdmin,
  asyncHandler(UserController.getStatistics)
);

/**
 * GET /api/users/me
 * Получение профиля текущего пользователя
 */
router.get(
  '/me',
  ...requireAuth,
  asyncHandler(UserController.me)
);

/**
 * PUT /api/users/me
 * Обновление профиля текущего пользователя
 */
router.put(
  '/me',
  ...requireAuth,
  validateBody(UserSchemas.update.omit({ role: true, isActive: true })), // Обычные пользователи не могут менять роль и статус
  asyncHandler(UserController.updateMe)
);

/**
 * PUT /api/users/change-password
 * Изменение пароля текущего пользователя
 */
router.put(
  '/change-password',
  ...requireAuth,
  validateBody(UserSchemas.changePassword),
  asyncHandler(UserController.changePassword)
);

/**
 * GET /api/users
 * Получение всех пользователей с фильтрацией (только для админов)
 */
router.get(
  '/',
  ...requireAdmin,
  validateQuery(CommonSchemas.userFilters),
  asyncHandler(UserController.find)
);

/**
 * POST /api/users
 * Создание нового пользователя (только для админов)
 */
router.post(
  '/',
  ...requireAdmin,
  validateBody(UserSchemas.create),
  asyncHandler(UserController.create)
);

/**
 * GET /api/users/:id
 * Получение пользователя по ID
 */
router.get(
  '/:id',
  authenticate,
  checkUserActive,
  validateParams(ParamSchemas.id),
  asyncHandler(UserController.findOne)
);

/**
 * PUT /api/users/:id
 * Обновление пользователя (только для админов)
 */
router.put(
  '/:id',
  ...requireAdmin,
  validateParams(ParamSchemas.id),
  validateBody(UserSchemas.update),
  asyncHandler(UserController.update)
);

/**
 * DELETE /api/users/:id
 * Удаление пользователя (только для админов)
 */
router.delete(
  '/:id',
  ...requireAdmin,
  validateParams(ParamSchemas.id),
  asyncHandler(UserController.delete)
);

/**
 * PUT /api/users/:id/activate
 * Активация пользователя (только для админов)
 */
router.put(
  '/:id/activate',
  ...requireAdmin,
  validateParams(ParamSchemas.id),
  asyncHandler(UserController.activate)
);

/**
 * PUT /api/users/:id/deactivate
 * Деактивация пользователя (только для админов)
 */
router.put(
  '/:id/deactivate',
  ...requireAdmin,
  validateParams(ParamSchemas.id),
  asyncHandler(UserController.deactivate)
);

export default router;