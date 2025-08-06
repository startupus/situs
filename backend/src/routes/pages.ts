import express from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

// GET /api/pages - получить все страницы
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, type, status, projectId } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    // Строим условия поиска
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { slug: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    
    if (type) {
      where.pageType = type;
    }
    
    if (status) {
      where.status = status;
    }

    if (projectId) {
      where.projectId = projectId;
    }

    // Получаем страницы с проектом
    const pages = await prisma.page.findMany({
      where,
      include: {
        project: true
      },
      skip,
      take: Number(limit),
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Получаем общее количество
    const total = await prisma.page.count({ where });

    return res.json({
      success: true,
      data: {
        pages,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Ошибка при получении страниц:', error);
    return res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// GET /api/pages/:id - получить страницу по ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        project: true
      }
    });

    if (!page) {
      return res.status(404).json({
        success: false,
        error: 'Страница не найдена'
      });
    }

    return res.json({
      success: true,
      data: page
    });
  } catch (error) {
    console.error('Ошибка при получении страницы:', error);
    return res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// POST /api/pages - создать новую страницу
router.post('/', async (req, res) => {
  try {
    const { title, slug, content, pageType, status, metaTitle, metaDescription, metaKeywords, projectId, isHomePage } = req.body;

    const page = await prisma.page.create({
      data: {
        title,
        slug,
        content: content ? JSON.stringify(content) : '{}',
        pageType: pageType || 'PAGE',
        status: status || 'DRAFT',
        metaTitle,
        metaDescription,
        metaKeywords,
        projectId,
        isHomePage: isHomePage || false
      },
      include: {
        project: true
      }
    });

    return res.status(201).json({
      success: true,
      data: page
    });
  } catch (error) {
    console.error('Ошибка при создании страницы:', error);
    return res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// PUT /api/pages/:id - обновить страницу
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, pageType, status, metaTitle, metaDescription, metaKeywords, isHomePage } = req.body;

    const page = await prisma.page.update({
      where: { id },
      data: {
        title,
        slug,
        content: content ? JSON.stringify(content) : undefined,
        pageType,
        status,
        metaTitle,
        metaDescription,
        metaKeywords,
        isHomePage
      },
      include: {
        project: true
      }
    });

    return res.json({
      success: true,
      data: page
    });
  } catch (error) {
    console.error('Ошибка при обновлении страницы:', error);
    return res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// DELETE /api/pages/:id - удалить страницу
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.page.delete({
      where: { id }
    });

    return res.json({
      success: true,
      message: 'Страница успешно удалена'
    });
  } catch (error) {
    console.error('Ошибка при удалении страницы:', error);
    return res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

export default router;
