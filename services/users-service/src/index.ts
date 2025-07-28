import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
import { config } from './config/environment.js';
import { usersLogger } from './utils/logger.js';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';

const app = express();
const port = config.getPort() || 3002;

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
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS настройка
app.use(cors({
  origin: (origin, callback) => {
    // В development разрешаем все origins
    if (config.isDevelopment()) {
      return callback(null, true);
    }
    
    // В production проверяем конфигурацию
    const allowedOrigins = config.getCorsOrigin().split(',');
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  ...config.getRateLimitConfig(),
  message: {
    error: 'Too Many Requests',
    message: 'Слишком много запросов. Попробуйте позже.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Пропускаем rate limiting для health check
    return req.path === '/health';
  }
});
app.use(limiter);

// Request logging
if (!config.isTest()) {
  app.use(morgan('combined', {
    stream: {
      write: (message) => usersLogger.info(message.trim())
    }
  }));
}

// Body parsing
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf.toString());
    } catch (e) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Некорректный JSON'
      });
      throw new Error('Invalid JSON');
    }
  }
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'users-service',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: config.getNodeEnv(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    pid: process.pid
  });
});

// Metrics endpoint для мониторинга
app.get('/metrics', (req, res) => {
  const metrics = {
    service: 'users-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    version: '1.0.0',
    environment: config.getNodeEnv(),
    pid: process.pid,
    platform: process.platform,
    nodeVersion: process.version
  };
  
  res.json(metrics);
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

// Catch 404 errors
app.use('*', (req, res) => {
  usersLogger.warn('Route not found', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  res.status(404).json({
    error: 'Not Found',
    message: `Маршрут ${req.method} ${req.originalUrl} не найден`,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Логируем ошибку
  usersLogger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.body
  });

  // Проверяем тип ошибки
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Некорректный JSON в теле запроса'
    });
  }

  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'Payload Too Large',
      message: 'Размер запроса превышает допустимый лимит'
    });
  }

  // Отправляем соответствующий ответ
  const statusCode = err.statusCode || err.status || 500;
  const message = config.isDevelopment() ? err.message : 'Внутренняя ошибка сервера';
  
  res.status(statusCode).json({
    error: err.name || 'Internal Server Error',
    message,
    timestamp: new Date().toISOString(),
    ...(config.isDevelopment() && { stack: err.stack })
  });
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  return () => {
    usersLogger.info(`Получен сигнал ${signal}. Завершение работы сервера...`);
    
    server.close(() => {
      usersLogger.info('HTTP сервер закрыт');
      
      // Закрываем соединение с базой данных
      import('./services/usersService.js').then(({ UsersService }) => {
        UsersService.disconnect().then(() => {
          usersLogger.info('Соединение с базой данных закрыто');
          process.exit(0);
        });
      });
    });

    // Принудительное завершение через 10 секунд
    setTimeout(() => {
      usersLogger.error('Принудительное завершение работы');
      process.exit(1);
    }, 10000);
  };
};

// Обработчики сигналов для graceful shutdown
process.on('SIGTERM', gracefulShutdown('SIGTERM'));
process.on('SIGINT', gracefulShutdown('SIGINT'));

// Обработка необработанных исключений
process.on('uncaughtException', (err) => {
  usersLogger.error('Uncaught Exception', {
    error: err.message,
    stack: err.stack
  });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  usersLogger.error('Unhandled Rejection', {
    reason: reason,
    promise: promise
  });
  process.exit(1);
});

// Запуск сервера
const server = app.listen(port, () => {
  usersLogger.info(`🚀 Users Service запущен на порту ${port}`);
  usersLogger.info(`📊 Окружение: ${config.getNodeEnv()}`);
  usersLogger.info(`🔒 JWT Secret: ${config.getJwtSecret()?.substring(0, 10)}...`);
  usersLogger.info(`📚 Документация API: http://localhost:${port}/api/docs`);
  
  if (config.isDevelopment()) {
    usersLogger.info(`🔧 Режим разработки активен`);
    usersLogger.info(`📝 Логирование: ${config.getLogLevel()}`);
  }
});

// Экспортируем app для тестирования
export default app;