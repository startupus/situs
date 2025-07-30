const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Моковые данные проектов
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

// API Routes

// GET /api/projects - получить список проектов
app.get('/api/projects', (req, res) => {
  const { search, status, type, sortBy, sortOrder, page = 1, limit = 10 } = req.query;
  
  let filteredProjects = [...mockProjects];
  
  // Фильтрация по поиску
  if (search) {
    const searchLower = search.toLowerCase();
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
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);
  
  res.json({
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
});

// GET /api/projects/:id - получить проект по ID
app.get('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const project = mockProjects.find(p => p.id === id);
  
  if (!project) {
    return res.status(404).json({
      success: false,
      error: 'Проект не найден'
    });
  }
  
  res.json({
    success: true,
    data: project
  });
});

// POST /api/projects - создать новый проект
app.post('/api/projects', (req, res) => {
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
  
  mockProjects.push(newProject);
  
  res.status(201).json({
    success: true,
    data: newProject
  });
});

// PUT /api/projects/:id - обновить проект
app.put('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  const projectIndex = mockProjects.findIndex(p => p.id === id);
  
  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Проект не найден'
    });
  }
  
  mockProjects[projectIndex] = {
    ...mockProjects[projectIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: mockProjects[projectIndex]
  });
});

// DELETE /api/projects/:id - удалить проект
app.delete('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const projectIndex = mockProjects.findIndex(p => p.id === id);
  
  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Проект не найден'
    });
  }
  
  mockProjects.splice(projectIndex, 1);
  
  res.json({
    success: true,
    message: 'Проект удален'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Projects API работает',
    timestamp: new Date().toISOString()
  });
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../dist')));

// Catch all handler for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Projects API сервер запущен на порту ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📁 API проектов: http://localhost:${PORT}/api/projects`);
}); 