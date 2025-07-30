import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import apiRoutes from './routes';
import { errorHandler, notFoundHandler, handleUncaughtExceptions } from './middleware/error.middleware';
import { env, server, validateCriticalEnv, getConfigInfo } from './config/environment';

/**
 * Основной файл сервера API
 * Настройка Express приложения и middleware по образцу Strapi
 */

// Проверяем критически важные переменные окружения
validateCriticalEnv();

// Настройка обработки исключений
handleUncaughtExceptions();

const app = express();
const PORT = server.port;

// Базовая конфигурация middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: server.cors.origin,
  credentials: server.cors.credentials
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: server.rateLimit.windowMs,
  max: server.rateLimit.max,
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
const appServer = app.listen(PORT, () => {
  const config = getConfigInfo();
  console.log(`🚀 Situs API Server запущен (на основе Strapi архитектуры)`);
  console.log(`📍 URL: ${server.url}`);
  console.log(`🌍 Окружение: ${config.environment}`);
  console.log(`🗄️  База данных: ${config.database}`);
  console.log(`🔒 CORS: ${config.cors ? 'включен' : 'отключен'}`);
  console.log(`📚 Swagger: ${config.swagger ? 'включен' : 'отключен'}`);
  console.log(`📖 API документация: ${server.url}/api`);
  console.log(`🔗 Health check: ${server.url}/api/health`);
  if (env.DEV_MODE) {
    console.log(`🔧 Режим разработки активен`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM получен. Закрытие HTTP сервера...');
  appServer.close(() => {
    console.log('HTTP сервер закрыт.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT получен. Закрытие HTTP сервера...');
  appServer.close(() => {
    console.log('HTTP сервер закрыт.');
    process.exit(0);
  });
});

export default app;