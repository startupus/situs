const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Логирование
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'Redaktus Editor API'
    }
  });
});

// Проверка адаптированных компонентов
app.get('/api/components/adapted', (req, res) => {
  try {
    const componentsPath = path.join(__dirname, 'src', 'data', 'adaptedComponents.json');
    
    if (!fs.existsSync(componentsPath)) {
      return res.status(404).json({
        success: false,
        error: { message: 'Адаптированные компоненты не найдены' }
      });
    }

    const componentsData = JSON.parse(fs.readFileSync(componentsPath, 'utf-8'));
    
    res.json({
      success: true,
      data: {
        totalComponents: componentsData.totalComponents,
        categories: componentsData.categories,
        generatedAt: componentsData.generatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
});

// Получить компоненты по категории
app.get('/api/components/category/:category', (req, res) => {
  try {
    const { category } = req.params;
    const componentsPath = path.join(__dirname, 'src', 'data', 'adaptedComponents.json');
    
    if (!fs.existsSync(componentsPath)) {
      return res.status(404).json({
        success: false,
        error: { message: 'Адаптированные компоненты не найдены' }
      });
    }

    const componentsData = JSON.parse(fs.readFileSync(componentsPath, 'utf-8'));
    
    const categoryComponents = componentsData.components.filter(comp => 
      comp.category.toLowerCase() === category.toLowerCase()
    );
    
    res.json({
      success: true,
      data: {
        category,
        count: categoryComponents.length,
        components: categoryComponents.slice(0, 10) // Первые 10 для демо
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
});

// Поиск компонентов
app.get('/api/components/search', (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({
        success: false,
        error: { message: 'Параметр поиска q обязателен' }
      });
    }

    const componentsPath = path.join(__dirname, 'src', 'data', 'adaptedComponents.json');
    
    if (!fs.existsSync(componentsPath)) {
      return res.status(404).json({
        success: false,
        error: { message: 'Адаптированные компоненты не найдены' }
      });
    }

    const componentsData = JSON.parse(fs.readFileSync(componentsPath, 'utf-8'));
    const searchTerm = q.toLowerCase();
    
    const foundComponents = componentsData.components.filter(comp => 
      comp.name.toLowerCase().includes(searchTerm) ||
      comp.category.toLowerCase().includes(searchTerm) ||
      comp.subcategory.toLowerCase().includes(searchTerm) ||
      comp.metadata.tags.some(tag => tag.includes(searchTerm))
    );
    
    res.json({
      success: true,
      data: {
        query: q,
        count: foundComponents.length,
        components: foundComponents.slice(0, 20) // Первые 20 результатов
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
});

// Статистика
app.get('/api/stats', (req, res) => {
  try {
    const componentsPath = path.join(__dirname, 'src', 'data', 'adaptedComponents.json');
    
    if (!fs.existsSync(componentsPath)) {
      return res.json({
        success: true,
        data: {
          totalComponents: 0,
          categories: [],
          adaptedComponents: false
        }
      });
    }

    const componentsData = JSON.parse(fs.readFileSync(componentsPath, 'utf-8'));
    
    res.json({
      success: true,
      data: {
        totalComponents: componentsData.totalComponents,
        categories: componentsData.categories,
        adaptedComponents: true,
        generatedAt: componentsData.generatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      service: 'Redaktus Editor API (Temporary)',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        stats: '/api/stats',
        adapted: '/api/components/adapted',
        category: '/api/components/category/:category',
        search: '/api/components/search?q=term'
      }
    }
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Temporary Redaktus API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🧩 Adapted components: http://localhost:${PORT}/api/components/adapted`);
});