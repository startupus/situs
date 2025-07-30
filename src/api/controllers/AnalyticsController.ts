import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../middleware/error.middleware';

const prisma = new PrismaClient();

/**
 * Analytics Controller - Контроллер для аналитических данных
 * Предоставляет данные для графиков и диаграмм
 */
class AnalyticsController {

  /**
   * GET /api/analytics/user-growth
   * Получение данных роста пользователей
   */
  static async getUserGrowth(req: Request, res: Response) {
    const { period = '30d' } = req.query;
    
    // Определяем период для запроса
    const daysAgo = period === '7d' ? 7 : period === '90d' ? 90 : period === '1y' ? 365 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    try {
      // Получаем данные по дням
      const userGrowthData = await prisma.user.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: {
            gte: startDate
          }
        },
        _count: {
          id: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      });

      // Группируем по дням
      const dailyData = new Map<string, number>();
      
      userGrowthData.forEach(item => {
        const dateKey = item.createdAt.toISOString().split('T')[0];
        dailyData.set(dateKey, (dailyData.get(dateKey) || 0) + item._count.id);
      });

      // Формируем массивы для Chart.js
      const labels: string[] = [];
      const data: number[] = [];
      
      for (let i = daysAgo - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        const monthDay = date.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' });
        
        labels.push(monthDay);
        data.push(dailyData.get(dateKey) || 0);
      }

      res.json({
        success: true,
        data: {
          labels,
          datasets: [{
            label: 'Новые пользователи',
            data,
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 1)',
            fill: true
          }]
        }
      });
    } catch (error) {
      console.error('Error getting user growth:', error);
      res.status(500).json({
        success: false,
        error: 'Ошибка получения данных роста пользователей'
      });
    }
  }

  /**
   * GET /api/analytics/project-distribution
   * Получение распределения проектов по типам
   */
  static async getProjectDistribution(req: Request, res: Response) {
    try {
      // Получаем проекты по типам (если есть поле type)
      const projectTypes = await prisma.project.groupBy({
        by: ['category'], // Используем category вместо type
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        }
      });

      const labels = projectTypes.map(item => item.category || 'Без категории');
      const data = projectTypes.map(item => item._count.id);
      
      const colors = [
        'rgba(59, 130, 246, 0.8)',   // blue
        'rgba(16, 185, 129, 0.8)',   // green
        'rgba(245, 158, 11, 0.8)',   // yellow
        'rgba(239, 68, 68, 0.8)',    // red
        'rgba(139, 92, 246, 0.8)',   // purple
        'rgba(236, 72, 153, 0.8)',   // pink
        'rgba(14, 165, 233, 0.8)',   // sky
        'rgba(34, 197, 94, 0.8)',    // emerald
      ];

      res.json({
        success: true,
        data: {
          labels,
          datasets: [{
            label: 'Количество проектов',
            data,
            backgroundColor: colors.slice(0, data.length)
          }]
        }
      });
    } catch (error) {
      console.error('Error getting project distribution:', error);
      res.status(500).json({
        success: false,
        error: 'Ошибка получения распределения проектов'
      });
    }
  }

  /**
   * GET /api/analytics/revenue
   * Получение данных о доходах (моковые данные, так как нет реальной системы платежей)
   */
  static async getRevenue(req: Request, res: Response) {
    const { period = '30d' } = req.query;
    
    try {
      // Пока используем моковые данные для доходов
      // В реальном проекте здесь будет запрос к таблице payments/transactions
      const monthsData = period === '1y' ? 12 : 6;
      const labels: string[] = [];
      const data: number[] = [];

      for (let i = monthsData - 1; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleDateString('ru-RU', { month: 'short' });
        
        labels.push(monthName);
        // Генерируем случайные данные в диапазоне 300-700 тыс.
        data.push(Math.floor(Math.random() * 400) + 300);
      }

      res.json({
        success: true,
        data: {
          labels,
          datasets: [{
            label: 'Доходы (тыс. руб.)',
            data,
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderColor: 'rgba(16, 185, 129, 1)',
            fill: true
          }]
        }
      });
    } catch (error) {
      console.error('Error getting revenue data:', error);
      res.status(500).json({
        success: false,
        error: 'Ошибка получения данных о доходах'
      });
    }
  }

  /**
   * GET /api/analytics/activity
   * Получение последней активности в системе
   */
  static async getActivity(req: Request, res: Response) {
    const { limit = 10, type = 'all' } = req.query;
    
    try {
      const activities: any[] = [];

      // Получаем последних зарегистрированных пользователей
      if (type === 'all' || type === 'user') {
        const recentUsers = await prisma.user.findMany({
          take: parseInt(limit as string),
          orderBy: { createdAt: 'desc' },
          select: { id: true, email: true, name: true, createdAt: true }
        });

        recentUsers.forEach(user => {
          activities.push({
            id: `user-${user.id}`,
            type: 'user',
            message: `Новый пользователь ${user.name || user.email} зарегистрирован`,
            timestamp: user.createdAt,
            user: 'Система'
          });
        });
      }

      // Получаем последние проекты
      if (type === 'all' || type === 'project') {
        const recentProjects = await prisma.project.findMany({
          take: parseInt(limit as string),
          orderBy: { createdAt: 'desc' },
          select: { 
            id: true, 
            title: true, 
            createdAt: true, 
            updatedAt: true,
            isPublished: true,
            user: { select: { name: true, email: true } }
          }
        });

        recentProjects.forEach(project => {
          const userName = project.user?.name || project.user?.email || 'Неизвестный пользователь';
          const action = project.isPublished ? 'опубликован' : 'создан';
          
          activities.push({
            id: `project-${project.id}`,
            type: 'project',
            message: `Проект "${project.title}" ${action}`,
            timestamp: project.isPublished && project.updatedAt > project.createdAt 
              ? project.updatedAt 
              : project.createdAt,
            user: userName
          });
        });
      }

      // Получаем последние страницы
      if (type === 'all' || type === 'page') {
        const recentPages = await prisma.page.findMany({
          take: parseInt(limit as string),
          orderBy: { createdAt: 'desc' },
          select: { 
            id: true, 
            title: true, 
            createdAt: true,
            project: { 
              select: { 
                user: { select: { name: true, email: true } }
              }
            }
          }
        });

        recentPages.forEach(page => {
          const userName = page.project?.user?.name || page.project?.user?.email || 'Неизвестный пользователь';
          
          activities.push({
            id: `page-${page.id}`,
            type: 'page',
            message: `Создана новая страница "${page.title}"`,
            timestamp: page.createdAt,
            user: userName
          });
        });
      }

      // Сортируем по времени и берем нужное количество
      const sortedActivities = activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, parseInt(limit as string));

      res.json({
        success: true,
        data: sortedActivities
      });
    } catch (error) {
      console.error('Error getting activity:', error);
      res.status(500).json({
        success: false,
        error: 'Ошибка получения данных активности'
      });
    }
  }
}

export default AnalyticsController;