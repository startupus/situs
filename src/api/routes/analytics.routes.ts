import { Router } from 'express';
import AnalyticsController from '../controllers/AnalyticsController';
import { validateQuery } from '../middleware/validation.middleware';
import { asyncHandler } from '../middleware/error.middleware';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';
import { z } from 'zod';

/**
 * Analytics Routes - Маршруты для аналитических данных
 * Предоставляют данные для графиков и диаграмм
 */

const router = Router();

// Схема для фильтрации аналитики по периоду
const AnalyticsSchema = z.object({
  period: z.enum(['7d', '30d', '90d', '1y']).optional().default('30d'),
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

/**
 * GET /api/analytics/user-growth
 * Данные роста пользователей для графика
 */
router.get(
  '/user-growth',
  ...requireAdmin,
  validateQuery(AnalyticsSchema),
  asyncHandler(AnalyticsController.getUserGrowth)
);

/**
 * GET /api/analytics/project-distribution
 * Распределение проектов по типам для круговой диаграммы
 */
router.get(
  '/project-distribution',
  ...requireAdmin,
  validateQuery(AnalyticsSchema),
  asyncHandler(AnalyticsController.getProjectDistribution)
);

/**
 * GET /api/analytics/revenue
 * Данные о доходах для графика
 */
router.get(
  '/revenue',
  ...requireAdmin,
  validateQuery(AnalyticsSchema),
  asyncHandler(AnalyticsController.getRevenue)
);

/**
 * GET /api/analytics/activity
 * Последняя активность в системе
 */
router.get(
  '/activity',
  ...requireAuth,
  validateQuery(z.object({
    limit: z.coerce.number().min(1).max(100).optional().default(10),
    type: z.enum(['user', 'project', 'page', 'all']).optional().default('all')
  })),
  asyncHandler(AnalyticsController.getActivity)
);

export default router;