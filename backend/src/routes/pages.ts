import express from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

// GET /api/pages - получить все страницы
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, type, status, productId } = req.query;
    
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

    if (productId) {
      where.productId = productId;
    }

    // Получаем страницы с проектом
    const pages = await prisma.page.findMany({
      where,
      include: {
        product: true
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

// GET /api/pages/product/:productId - получить все страницы продукта
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 20, status, pageType } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    // Строим условия поиска
    const where: any = {
      productId
    };
    
    if (status) {
      where.status = status;
    }
    
    if (pageType) {
      where.pageType = pageType;
    }

    // Получаем страницы
    const pages = await prisma.page.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true
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
    console.error('Ошибка при получении страниц проекта:', error);
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
        product: true
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
    const { title, slug, content, pageType, status, metaTitle, metaDescription, metaKeywords, productId, isHomePage } = req.body;

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
        productId,
        isHomePage: isHomePage || false
      },
      include: {
        product: true
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
    const { title, slug, content, pageType, status, metaTitle, metaDescription, metaKeywords, isHomePage, productId } = req.body;

    // Проверяем, существует ли страница
    const existingPage = await prisma.page.findUnique({
      where: { id }
    });

    let page;

    if (existingPage) {
      // Обновляем существующую страницу
      page = await prisma.page.update({
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
          product: true
        }
      });
    } else {
      // Создаем новую страницу, если её нет
      // Генерируем уникальный slug
      let uniqueSlug = slug || 'new-page';
      let counter = 1;
      
      // Проверяем, существует ли страница с таким slug
      while (true) {
        const existingPageWithSlug = await prisma.page.findFirst({
          where: {
            productId: productId || 'cme16g3s400079kymu6whc8c2',
            slug: uniqueSlug
          }
        });
        
        if (!existingPageWithSlug) {
          break; // Slug уникален
        }
        
        // Добавляем номер к slug
        uniqueSlug = `${slug || 'new-page'}-${counter}`;
        counter++;
      }
      
      page = await prisma.page.create({
        data: {
          id, // Используем переданный ID
          title: title || 'Новая страница',
          slug: uniqueSlug,
          content: content ? JSON.stringify(content) : '{}',
          pageType: pageType || 'PAGE',
          status: status || 'DRAFT',
          metaTitle,
          metaDescription,
          metaKeywords,
          productId: productId || 'cme16g3s400079kymu6whc8c2', // Используем дефолтный продукт
          isHomePage: isHomePage || false
        },
        include: {
          product: true
        }
      });
    }

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
