import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { validateBody } from '../middleware/validation.middleware';
import { asyncHandler } from '../middleware/error.middleware';
import { UserSchemas } from '../validation/schemas';

/**
 * Auth Routes - Маршруты для аутентификации и регистрации
 * Все маршруты включают валидацию и обработку ошибок
 */

const router = Router();

/**
 * POST /api/auth/login
 * Авторизация пользователя
 */
router.post(
  '/login',
  validateBody(UserSchemas.login),
  asyncHandler(AuthController.login)
);

/**
 * POST /api/auth/register
 * Регистрация нового пользователя
 */
router.post(
  '/register',
  validateBody(UserSchemas.register),
  asyncHandler(AuthController.register)
);

/**
 * POST /api/auth/verify-token
 * Проверка валидности JWT токена
 */
router.post(
  '/verify-token',
  asyncHandler(AuthController.verifyToken)
);

/**
 * POST /api/auth/refresh-token
 * Обновление JWT токена
 */
router.post(
  '/refresh-token',
  asyncHandler(AuthController.refreshToken)
);

/**
 * POST /api/auth/logout
 * Выход из системы
 */
router.post(
  '/logout',
  asyncHandler(AuthController.logout)
);

/**
 * POST /api/auth/forgot-password
 * Восстановление пароля
 */
router.post(
  '/forgot-password',
  validateBody(UserSchemas.forgotPassword),
  asyncHandler(AuthController.forgotPassword)
);

/**
 * POST /api/auth/reset-password
 * Сброс пароля
 */
router.post(
  '/reset-password',
  validateBody(UserSchemas.resetPassword),
  asyncHandler(AuthController.resetPassword)
);

export default router;