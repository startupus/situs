import { Router } from 'express';
import AuthController from '../controllers/AuthController';

const router = Router();

/**
 * Маршруты аутентификации
 * POST /api/auth/login - Авторизация
 * POST /api/auth/register - Регистрация
 * POST /api/auth/verify-token - Проверка токена
 * POST /api/auth/refresh-token - Обновление токена
 * POST /api/auth/logout - Выход
 * POST /api/auth/forgot-password - Восстановление пароля
 * POST /api/auth/reset-password - Сброс пароля
 */

// Авторизация пользователя
router.post('/login', AuthController.login);

// Регистрация нового пользователя
router.post('/register', AuthController.register);

// Проверка валидности JWT токена
router.post('/verify-token', AuthController.verifyToken);

// Обновление JWT токена
router.post('/refresh-token', AuthController.refreshToken);

// Выход из системы
router.post('/logout', AuthController.logout);

// Восстановление пароля
router.post('/forgot-password', AuthController.forgotPassword);

// Сброс пароля
router.post('/reset-password', AuthController.resetPassword);

export default router;