import express from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

// GET /api/projects - получить все проекты
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, type } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    // Строим условия поиска
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (type) {
      where.type = type;
    }
    
    const projects = await prisma.project.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: {
        createdAt: 'desc'
      }
    });
    
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
      where: { id }
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

// GET /api/projects/:id/products - получить продукты проекта
router.get('/:id/products', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20, status, type } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    // Строим условия поиска
    const where: any = {
      projectId: id
    };
    
    if (status) {
      where.status = status;
    }
    
    if (type) {
      where.type = type;
    }
    
    const products = await prisma.product.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    const total = await prisma.product.count({ where });
    
    return res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Ошибка при получении продуктов проекта:', error);
    return res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// GET /api/projects/:id/products/:productId - получить конкретный продукт проекта
router.get('/:id/products/:productId', async (req, res) => {
  try {
    const { id, productId } = req.params;
    
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        projectId: id
      }
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Продукт не найден'
      });
    }
    
    return res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Ошибка при получении продукта:', error);
    return res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// POST /api/projects/:id/products - создать новый продукт для проекта
router.post('/:id/products', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, type, status, subdomain, pathPrefix, settings } = req.body;

    // Проверяем, что проект существует
    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Проект не найден'
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        type: type || 'WEBSITE',
        status: status || 'DRAFT',
        subdomain,
        pathPrefix,
        settings: settings ? JSON.stringify(settings) : '{}',
        projectId: id
      }
    });

    return res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Ошибка при создании продукта:', error);
    return res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// GET /api/projects/:id/pages - получить страницы проекта (через продукты)
router.get('/:id/pages', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20, status, pageType, productId } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    // Строим условия поиска
    const where: any = {
      product: {
        projectId: id
      }
    };
    
    if (productId) {
      where.productId = productId;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (pageType) {
      where.pageType = pageType;
    }
    
    const pages = await prisma.page.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: {
        createdAt: 'desc'
      }
    });
    
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

// POST /api/seed - создать тестовые данные
router.post('/seed', async (req, res) => {
  try {
    // Создаем тестовых пользователей
    const businessUser = await prisma.user.upsert({
      where: { email: 'business@situs.com' },
      update: {},
      create: {
        username: 'business_user',
        email: 'business@situs.com',
        password: 'hashed_password_here',
        role: 'BUSINESS',
        subscriptionPlan: 'basic'
      }
    });

    const agencyUser = await prisma.user.upsert({
      where: { email: 'agency@situs.com' },
      update: {},
      create: {
        username: 'agency_user',
        email: 'agency@situs.com',
        password: 'hashed_password_here',
        role: 'AGENCY',
        subscriptionPlan: 'pro'
      }
    });

    // Создаем проект для бизнес-пользователя
    const businessProject = await prisma.project.upsert({
      where: { slug: 'business-project' },
      update: {},
      create: {
        name: 'Бизнес проект',
        description: 'Проект бизнес-пользователя',
        slug: 'business-project',
        domain: 'business.situs.com',
        status: 'ACTIVE',
        ownerId: businessUser.id
      }
    });

    // Создаем проект для агентства
    const agencyProject = await prisma.project.upsert({
      where: { slug: 'agency-client-1' },
      update: {},
      create: {
        name: 'Клиент агентства 1',
        description: 'Проект клиента агентства',
        slug: 'agency-client-1',
        domain: 'client1.situs.com',
        status: 'ACTIVE',
        ownerId: agencyUser.id
      }
    });

    // Создаем продукты
    const businessWebsite = await prisma.product.create({
      data: {
        name: 'Корпоративный сайт',
        description: 'Основной сайт компании',
        type: 'WEBSITE',
        status: 'ACTIVE',
        projectId: businessProject.id
      }
    });

    const businessShop = await prisma.product.create({
      data: {
        name: 'Интернет-магазин',
        description: 'Магазин товаров',
        type: 'ECOMMERCE',
        status: 'ACTIVE',
        pathPrefix: '/shop',
        projectId: businessProject.id
      }
    });

    const agencyWebsite = await prisma.product.create({
      data: {
        name: 'Сайт клиента',
        description: 'Сайт для клиента агентства',
        type: 'WEBSITE',
        status: 'ACTIVE',
        projectId: agencyProject.id
      }
    });

    // Создаем страницы
    const homePage = await prisma.page.create({
      data: {
        title: 'Главная страница',
        slug: 'home',
        content: JSON.stringify({
          blocks: [
            {
              id: 'hero-block',
              type: 'hero-block',
              props: {
                title: 'Добро пожаловать на наш сайт',
                subtitle: 'Мы предоставляем качественные услуги',
                primaryButtonText: 'Узнать больше',
                primaryButtonUrl: '/about'
              }
            }
          ]
        }),
        pageType: 'HOME',
        status: 'PUBLISHED',
        isHomePage: true,
        productId: businessWebsite.id
      }
    });

    return res.json({
      success: true,
      data: {
        users: [businessUser, agencyUser],
        projects: [businessProject, agencyProject],
        products: [businessWebsite, businessShop, agencyWebsite],
        pages: [homePage]
      }
    });
  } catch (error) {
    console.error('Ошибка при создании тестовых данных:', error);
    return res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

export default router; 