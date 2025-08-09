import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import config from './config/config';
import { prisma } from './lib/prisma';

// Создаем Express приложение
const app = express();
const server = createServer(app);

// Инициализируем Socket.IO с CORS настройками из конфига
const io = new Server(server, {
  cors: {
    origin: config.CORS_ORIGINS,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: config.CORS_ORIGINS,
  credentials: true
}));

// Настраиваем логирование в зависимости от окружения
const morganFormat = config.NODE_ENV === 'development' ? 'dev' : 'combined';
app.use(morgan(morganFormat));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API Routes
import projectsRouter from './routes/projects';
import ordersRouter from './routes/orders';
import productsRouter from './routes/products';
import pagesRouter from './routes/pages';

app.use('/api/projects', projectsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/products', productsRouter);
app.use('/api/pages', pagesRouter);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// ПРОСТОЙ ЗАПУСК СЕРВЕРА - БЕЗ СЛОЖНЫХ ПРОВЕРОК
server.listen(config.PORT, () => {
  console.log(`🚀 Situs Backend запущен на порту ${config.PORT}`);
  console.log(`📊 Health check: http://localhost:${config.PORT}/health`);
  console.log(`🌍 Environment: ${config.NODE_ENV}`);
});

export { app, io }; 