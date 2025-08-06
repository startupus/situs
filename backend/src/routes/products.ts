import express from 'express';

const router = express.Router();

// Моковые данные для продуктов
const mockProducts = [
  {
    id: '1',
    name: 'Стартапус - Демо проект',
    description: 'Демонстрационный проект экосистемы Стартапус',
    type: 'WEBSITE',
    status: 'PUBLISHED',
    projectId: '1',
    settings: {
      theme: 'auto',
      primaryColor: '#3B82F6',
      favicon: '/favicon.ico',
      logo: '/logo.svg',
      domain: 'startapus.com'
    },
    pages: [
      {
        id: '1',
        title: 'Главная страница',
        slug: 'home',
        content: [
          {
            id: 'hero-1',
            type: 'hero-section',
            props: {
              title: 'Создавайте будущее веба с экосистемой Стартапус',
              subtitle: 'Полный набор инструментов для создания современных веб-сайтов без программирования',
              buttonText: 'Начать бесплатно',
              buttonLink: '/situs',
              backgroundImage: '/images/hero-bg.jpg',
              overlayOpacity: 0.4
            }
          },
          {
            id: 'features-1',
            type: 'features-section',
            props: {
              title: 'Почему выбирают Стартапус',
              subtitle: 'Инновационные решения для современного бизнеса',
              features: [
                {
                  title: 'Визуальный редактор',
                  description: 'Создавайте сайты без программирования',
                  icon: 'brush'
                },
                {
                  title: 'Готовые шаблоны',
                  description: '600+ профессиональных шаблонов',
                  icon: 'template'
                },
                {
                  title: 'SEO оптимизация',
                  description: 'Встроенные инструменты для продвижения',
                  icon: 'seo'
                }
              ]
            }
          }
        ],
        meta: {
          description: 'Инновационная платформа для создания и управления веб-проектами',
          keywords: ['стартапус', 'веб-разработка', 'платформа'],
          ogImage: '/images/og-startapus.jpg'
        },
        status: 'published',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-12-23T15:30:00Z',
        publishedAt: '2024-01-01T10:00:00Z'
      },
      {
        id: '2',
        title: 'О нас',
        slug: 'about',
        content: [
          {
            id: 'about-1',
            type: 'about-section',
            props: {
              title: 'О экосистеме Стартапус',
              description: 'Мы создаем инструменты для цифрового будущего',
              image: '/images/about-us.jpg'
            }
          }
        ],
        meta: {
          description: 'Узнайте больше о команде и миссии Стартапус',
          keywords: ['о нас', 'команда', 'миссия'],
          ogImage: '/images/og-about.jpg'
        },
        status: 'published',
        createdAt: '2024-01-01T11:00:00Z',
        updatedAt: '2024-12-23T15:30:00Z',
        publishedAt: '2024-01-01T11:00:00Z'
      }
    ],
    analytics: {
      visitors: 2890,
      pageViews: 12450,
      conversionRate: 3.2,
      revenue: 184000
    },
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-12-23T15:30:00Z'
  },
  {
    id: '2',
    name: 'Портфолио агентства',
    description: 'Сайт-портфолио для креативного агентства',
    type: 'WEBSITE',
    status: 'PUBLISHED',
    projectId: '2',
    settings: {
      theme: 'dark',
      primaryColor: '#8B5CF6',
      favicon: '/favicon.ico',
      logo: '/logo.svg',
      domain: 'portfolio-agency.com'
    },
    pages: [
      {
        id: '3',
        title: 'О нас',
        slug: 'about',
        content: [
          {
            id: 'about-2',
            type: 'about-section',
            props: {
              title: 'Креативное агентство',
              description: 'Создаем уникальные цифровые решения',
              image: '/images/agency-about.jpg'
            }
          }
        ],
        meta: {
          description: 'О нашем креативном агентстве',
          keywords: ['агентство', 'креатив', 'дизайн'],
          ogImage: '/images/og-agency.jpg'
        },
        status: 'published',
        createdAt: '2024-01-02T09:00:00Z',
        updatedAt: '2024-12-23T15:30:00Z',
        publishedAt: '2024-01-02T09:00:00Z'
      }
    ],
    analytics: {
      visitors: 1567,
      pageViews: 8234,
      conversionRate: 2.8,
      revenue: 88000
    },
    createdAt: '2024-01-02T09:00:00Z',
    updatedAt: '2024-12-23T15:30:00Z'
  }
];

// GET /api/products - получить все продукты
router.get('/', (req, res) => {
  const { projectId, type, status, page = 1, limit = 20 } = req.query;
  
  let filteredProducts = [...mockProducts];
  
  if (projectId) {
    filteredProducts = filteredProducts.filter(product => product.projectId === projectId);
  }
  
  if (type) {
    filteredProducts = filteredProducts.filter(product => product.type === type);
  }
  
  if (status) {
    filteredProducts = filteredProducts.filter(product => product.status === status);
  }
  
  const startIndex = (Number(page) - 1) * Number(limit);
  const endIndex = startIndex + Number(limit);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: {
      products: paginatedProducts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / Number(limit))
      }
    }
  });
});

// GET /api/products/:id - получить продукт по ID
router.get('/:id', (req, res) => {
  const product = mockProducts.find(p => p.id === req.params.id);
  if (product) {
    res.json({
      success: true,
      data: product
    });
  } else {
    res.status(404).json({ 
      success: false,
      error: 'Продукт не найден' 
    });
  }
});

// POST /api/products - создать новый продукт
router.post('/', (req, res) => {
  const { name, description, type, projectId, settings } = req.body;
  
  if (!name || !type || !projectId) {
    return res.status(400).json({
      success: false,
      error: 'Название, тип и ID проекта обязательны'
    });
  }
  
  const newProduct = {
    id: `product_${Date.now()}`,
    name,
    description: description || '',
    type,
    status: 'DRAFT',
    projectId,
    settings: settings || {
      theme: 'auto',
      primaryColor: '#3B82F6',
      favicon: '/favicon.ico',
      logo: '/logo.svg'
    },
    pages: [],
    analytics: {
      visitors: 0,
      pageViews: 0,
      conversionRate: 0,
      revenue: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockProducts.push(newProduct);
  
  return res.status(201).json({
    success: true,
    data: newProduct
  });
});

// PUT /api/products/:id - обновить продукт
router.put('/:id', (req, res) => {
  const productIndex = mockProducts.findIndex(p => p.id === req.params.id);
  
  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Продукт не найден'
    });
  }
  
  const updatedProduct = {
    ...mockProducts[productIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  mockProducts[productIndex] = updatedProduct;
  
  return res.json({
    success: true,
    data: updatedProduct
  });
});

// DELETE /api/products/:id - удалить продукт
router.delete('/:id', (req, res) => {
  const productIndex = mockProducts.findIndex(p => p.id === req.params.id);
  
  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Продукт не найден'
    });
  }
  
  mockProducts.splice(productIndex, 1);
  
  return res.json({
    success: true,
    message: 'Продукт удален'
  });
});

export default router;
