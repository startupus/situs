import express from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

// GET /api/projects - получить все проекты
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, type, status } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    // Строим условия поиска
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    
    if (type) {
      where.type = type;
    }
    
    if (status) {
      where.status = status;
    }

    // Получаем проекты с продуктами и страницами
    const projects = await prisma.project.findMany({
      where,
      include: {
        products: {
          include: {
            project: true
          }
        },
        pages: true,
        owner: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
      skip,
      take: Number(limit),
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Получаем общее количество
    const total = await prisma.project.count({ where });

    return res.json({
      success: true,
      data: {
        projects,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Ошибка при получении проектов:', error);
    return res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// GET /api/projects/:id - получить проект по ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            project: true
          }
        },
        pages: true,
        owner: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Проект не найден'
      });
    }

    return res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Ошибка при получении проекта:', error);
    return res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// POST /api/projects - создать новый проект
router.post('/', async (req, res) => {
  try {
    const { name, description, type, status, settings, ownerId } = req.body;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        type: type || 'WEBSITE',
        status: status || 'DRAFT',
        settings: settings ? JSON.stringify(settings) : '{}',
        ownerId
      },
      include: {
        products: true,
        pages: true,
        owner: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    return res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Ошибка при создании проекта:', error);
    return res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// PUT /api/projects/:id - обновить проект
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, type, status, settings } = req.body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
        type,
        status,
        settings: settings ? JSON.stringify(settings) : undefined
      },
      include: {
        products: true,
        pages: true,
        owner: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    return res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Ошибка при обновлении проекта:', error);
    return res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// DELETE /api/projects/:id - удалить проект
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.project.delete({
      where: { id }
    });

    return res.json({
      success: true,
      message: 'Проект успешно удален'
    });
  } catch (error) {
    console.error('Ошибка при удалении проекта:', error);
    return res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

export default router; 