import express from 'express';

const router = express.Router();

// Моковые данные для проектов
const mockProjects = [
  {
    id: '1',
    name: 'Стартапус - Демо проект',
    description: 'Демонстрационный проект экосистемы Стартапус',
    template: 'website',
    status: 'published',
    settings: {
      theme: 'auto',
      primaryColor: '#3B82F6',
      favicon: '/favicon.ico',
      logo: '/logo.svg'
    },
    products: [
      {
        id: '1',
        name: 'Стартапус - Демо проект',
        description: 'Демонстрационный проект экосистемы Стартапус',
        type: 'WEBSITE',
        status: 'PUBLISHED',
        settings: {
          theme: 'auto',
          primaryColor: '#3B82F6',
          favicon: '/favicon.ico',
          logo: '/logo.svg',
          domain: 'startapus.com'
        },
        analytics: {
          visitors: 2890,
          pageViews: 12450,
          conversionRate: 3.2,
          revenue: 184000
        },
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-12-23T15:30:00Z'
      }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Портфолио агентства',
    description: 'Сайт-портфолио для креативного агентства',
    template: 'portfolio',
    status: 'published',
    settings: {
      theme: 'dark',
      primaryColor: '#8B5CF6',
      favicon: '/favicon.ico',
      logo: '/logo.svg'
    },
    products: [
      {
        id: '2',
        name: 'Портфолио агентства',
        description: 'Сайт-портфолио для креативного агентства',
        type: 'WEBSITE',
        status: 'PUBLISHED',
        settings: {
          theme: 'dark',
          primaryColor: '#8B5CF6',
          favicon: '/favicon.ico',
          logo: '/logo.svg',
          domain: 'portfolio-agency.com'
        },
        analytics: {
          visitors: 1567,
          pageViews: 8234,
          conversionRate: 2.8,
          revenue: 88000
        },
        createdAt: '2024-01-02T09:00:00Z',
        updatedAt: '2024-12-23T15:30:00Z'
      }
    ],
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  }
];

// GET /api/projects - получить все проекты
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      projects: mockProjects,
      pagination: {
        page: 1,
        limit: 20,
        total: mockProjects.length,
        totalPages: 1
      }
    }
  });
});

// GET /api/projects/:id - получить проект по ID
router.get('/:id', (req, res) => {
  const project = mockProjects.find(p => p.id === req.params.id);
  if (project) {
    res.json({
      success: true,
      data: project
    });
  } else {
    res.status(404).json({ 
      success: false,
      error: 'Проект не найден' 
    });
  }
});

// GET /api/projects/:id/products - получить продукты проекта
router.get('/:id/products', (req, res) => {
  const project = mockProjects.find(p => p.id === req.params.id);
  if (project) {
    res.json({
      success: true,
      data: {
        products: project.products || [],
        project: {
          id: project.id,
          name: project.name,
          description: project.description
        }
      }
    });
  } else {
    res.status(404).json({ 
      success: false,
      error: 'Проект не найден' 
    });
  }
});

export default router; 