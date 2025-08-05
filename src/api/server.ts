import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import apiRoutes from './routes';

/**
 * Express API сервер
 * Основан на архитектуре Strapi с современными практиками безопасности
 */

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware безопасности
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS настройки
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5177',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Сжатие ответов
app.use(compression());

// Логирование запросов
app.use(morgan('combined'));

// Парсинг JSON
app.use(express.json({ limit: '10mb' }));

// Парсинг URL-encoded данных
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Статические файлы
app.use('/static', express.static('public'));

// API маршруты
app.use('/api', apiRoutes);

// Обработка 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      status: 404,
      name: 'NotFoundError',
      message: 'Маршрут не найден'
    }
  });
});

// Глобальная обработка ошибок
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Глобальная ошибка:', error);

  // Если ошибка уже обработана
  if (res.headersSent) {
    return next(error);
  }

  // Определяем тип ошибки
  let status = 500;
  let message = 'Внутренняя ошибка сервера';

  if (error.name === 'ValidationError') {
    status = 400;
    message = error.message;
  } else if (error.name === 'UnauthorizedError') {
    status = 401;
    message = 'Неавторизованный доступ';
  } else if (error.name === 'NotFoundError') {
    status = 404;
    message = 'Ресурс не найден';
  } else if (error.name === 'ConflictError') {
    status = 409;
    message = 'Конфликт данных';
  } else if (error.message) {
    message = error.message;
  }

  res.status(status).json({
    error: {
      status,
      name: error.name || 'InternalServerError',
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    }
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM получен, завершение работы сервера...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT получен, завершение работы сервера...');
  process.exit(0);
});

// Запуск сервера
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 API сервер запущен на порту ${PORT}`);
    console.log(`📚 Документация: http://localhost:${PORT}/api`);
    console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5177'}`);
  });
}

export default app; 