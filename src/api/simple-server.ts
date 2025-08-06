import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        pages: true,
        _count: {
          select: { pages: true }
        }
      }
    });
    res.json({ data: projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get pages for project
app.get('/api/projects/:projectId/pages', async (req, res) => {
  try {
    const { projectId } = req.params;
    const pages = await prisma.page.findMany({
      where: { projectId },
      include: {
        project: {
          select: { id: true, name: true, slug: true }
        }
      }
    });
    res.json({ data: pages });
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

// Get single page
app.get('/api/pages/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      include: {
        project: {
          select: { id: true, name: true, slug: true }
        }
      }
    });
    
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    res.json({ data: page });
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ error: 'Failed to fetch page' });
  }
});

// Update page content
app.put('/api/pages/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    const { content, title, ...updateData } = req.body;
    
    const page = await prisma.page.update({
      where: { id: pageId },
      data: {
        ...updateData,
        ...(title && { title }),
        ...(content && { content }),
        updatedAt: new Date()
      },
      include: {
        project: {
          select: { id: true, name: true, slug: true }
        }
      }
    });
    
    res.json({ data: page, message: 'Page updated successfully' });
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({ error: 'Failed to update page' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API сервер запущен на порту ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Projects API: http://localhost:${PORT}/api/projects`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Получен сигнал SIGTERM, останавливаю сервер...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 Получен сигнал SIGINT, останавливаю сервер...');
  await prisma.$disconnect();
  process.exit(0);
});
