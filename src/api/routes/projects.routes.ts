import { Router } from 'express';
import ProjectController from '../controllers/ProjectController';

const router = Router();

/**
 * Маршруты проектов
 * GET /api/projects - Получение всех проектов
 * GET /api/projects/:id - Получение проекта по ID
 * POST /api/projects - Создание проекта
 * PUT /api/projects/:id - Обновление проекта
 * DELETE /api/projects/:id - Удаление проекта
 * PUT /api/projects/:id/publish - Публикация проекта
 * PUT /api/projects/:id/unpublish - Снятие с публикации
 * GET /api/projects/statistics - Статистика проектов
 */

// Получение всех проектов пользователя
router.get('/', ProjectController.find);

// Получение статистики проектов
router.get('/statistics', ProjectController.getStatistics);

// Получение проекта по ID
router.get('/:id', ProjectController.findOne);

// Создание нового проекта
router.post('/', ProjectController.create);

// Обновление проекта
router.put('/:id', ProjectController.update);

// Удаление проекта
router.delete('/:id', ProjectController.delete);

// Публикация проекта
router.put('/:id/publish', ProjectController.publish);

// Снятие проекта с публикации
router.put('/:id/unpublish', ProjectController.unpublish);

export default router;