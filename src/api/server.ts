import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import apiRoutes from './routes';
import { errorHandler, notFoundHandler, handleUncaughtExceptions } from './middleware/error.middleware';

/**
 * Основной файл сервера API
 * Настройка Express приложения и middleware
 */

// Настройка обработки исключений
handleUncaughtExceptions();

const app = express();
const PORT = process.env.PORT || 3001;

// Базовая конфигурация middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов за окно
  message: 'Слишком много запросов с этого IP',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Парсинг JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API маршруты
app.use('/api', apiRoutes);

// Обработка 404
app.use(notFoundHandler);

// Глобальная обработка ошибок
app.use(errorHandler);

// Запуск сервера
const server = app.listen(PORT, () => {
  console.log(`🚀 API сервер запущен на порту ${PORT}`);
  console.log(`📖 API документация: http://localhost:${PORT}/api`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM получен. Закрытие HTTP сервера...');
  server.close(() => {
    console.log('HTTP сервер закрыт.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT получен. Закрытие HTTP сервера...');
  server.close(() => {
    console.log('HTTP сервер закрыт.');
    process.exit(0);
  });
});

export default app;