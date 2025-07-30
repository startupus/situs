import express from 'express';
import { prisma } from '../index';

const router = express.Router();

// GET /api/projects - получить список проектов
router.get('/', async (req, res) => {
  try {
    const { search, status, type, sortBy, sortOrder, page = 1, limit = 10 } = req.query;
    
    // Моковые данные для демонстрации
    const mockProjects = [
      {
        id: 'startapus-ecosystem',
        name: 'Стартапус - Демо проект',
        description: 'Официальный сайт экосистемы Стартапус - инновационная платформа для создания и управления веб-проектами',
        domain: 'startapus.com',
        template: 'website',
        settings: {
          theme: 'auto',
          primaryColor: '#3B82F6',
          favicon: '/favicon.ico',
          logo: '/logo.svg'
        },
        pages: [
          {
            id: 'startapus-home',
            title: 'Главная',
            slug: '',
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
          }
        ],
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-12-23T15:30:00Z',
        owner: 'default-user',
        collaborators: [],
        isPublic: false
      },
      {
        id: 'site-1',
        name: 'Мой первый сайт',
        description: 'Тестовый сайт для разработки Redaktus',
        domain: 'site1.situs.com',
        template: 'website',
        settings: {
          theme: 'auto',
          primaryColor: '#3B82F6',
          favicon: '/favicon.ico',
          logo: '/logo.svg'
        },
        pages: [],
        createdAt: '2024-12-01T10:00:00Z',
        updatedAt: '2024-12-23T15:30:00Z',
        owner: 'default-user',
        collaborators: [],
        isPublic: false
      }
    ];

    let filteredProjects = [...mockProjects];
    
    // Фильтрация по поиску
    if (search) {
      const searchLower = search.toString().toLowerCase();
      filteredProjects = filteredProjects.filter(project => 
        project.name.toLowerCase().includes(searchLower) ||
        project.description?.toLowerCase().includes(searchLower)
      );
    }
    
    // Фильтрация по типу
    if (type) {
      filteredProjects = filteredProjects.filter(project => 
        project.template === type
      );
    }
    
    // Сортировка
    if (sortBy) {
      filteredProjects.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortBy) {
          case 'name':
            aValue = a.name;
            bValue = b.name;
            break;
          case 'updated':
            aValue = new Date(a.updatedAt);
            bValue = new Date(b.updatedAt);
            break;
          case 'created':
            aValue = new Date(a.createdAt);
            bValue = new Date(b.createdAt);
            break;
          default:
            return 0;
        }
        
        if (sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        } else {
          return aValue > bValue ? 1 : -1;
        }
      });
    }
    
    // Пагинация
    const pageNum = parseInt(page.toString());
    const limitNum = parseInt(limit.toString());
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);
    
    return res.json({
      success: true,
      data: {
        projects: paginatedProjects,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: filteredProjects.length,
          totalPages: Math.ceil(filteredProjects.length / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({
      success: false,
      error: 'Ошибка при загрузке проектов'
    });
  }
});

// GET /api/projects/:id - получить проект по ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Моковые данные
    const mockProjects = [
      {
        id: 'startapus-ecosystem',
        name: 'Стартапус - Демо проект',
        description: 'Официальный сайт экосистемы Стартапус',
        domain: 'startapus.com',
        template: 'website',
        settings: {
          theme: 'auto',
          primaryColor: '#3B82F6',
          favicon: '/favicon.ico',
          logo: '/logo.svg'
        },
        pages: [
          {
            id: 'startapus-home',
            title: 'Главная',
            slug: '',
            content: [],
            meta: {
              description: 'Инновационная платформа',
              keywords: ['стартапус', 'веб-разработка'],
              ogImage: '/images/og-startapus.jpg'
            },
            status: 'published',
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-12-23T15:30:00Z',
            publishedAt: '2024-01-01T10:00:00Z'
          }
        ],
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-12-23T15:30:00Z',
        owner: 'default-user',
        collaborators: [],
        isPublic: false
      }
    ];
    
    const project = mockProjects.find(p => p.id === id);
    
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
    console.error('Error fetching project:', error);
    return res.status(500).json({
      success: false,
      error: 'Ошибка при загрузке проекта'
    });
  }
});

// POST /api/projects - создать новый проект
router.post('/', async (req, res) => {
  try {
    const { name, description, domain, template, settings } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Название проекта обязательно'
      });
    }
    
    const newProject = {
      id: `project_${Date.now()}`,
      name,
      description: description || '',
      domain: domain || `${name.toLowerCase().replace(/\s+/g, '-')}.situs.com`,
      template: template || 'website',
      settings: settings || {
        theme: 'auto',
        primaryColor: '#3B82F6',
        favicon: '/favicon.ico',
        logo: '/logo.svg'
      },
      pages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: 'default-user',
      collaborators: [],
      isPublic: false
    };
    
    return res.status(201).json({
      success: true,
      data: newProject
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return res.status(500).json({
      success: false,
      error: 'Ошибка при создании проекта'
    });
  }
});

// PUT /api/projects/:id - обновить проект
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // В реальном приложении здесь была бы логика обновления в БД
    const updatedProject = {
      id,
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return res.json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return res.status(500).json({
      success: false,
      error: 'Ошибка при обновлении проекта'
    });
  }
});

// DELETE /api/projects/:id - удалить проект
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // В реальном приложении здесь была бы логика удаления из БД
    
    return res.json({
      success: true,
      message: 'Проект удален'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return res.status(500).json({
      success: false,
      error: 'Ошибка при удалении проекта'
    });
  }
});

export default router; 