import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
import { config } from './config/environment.js';
import { projectsLogger } from './utils/logger.js';
import projectsRouter from './routes/projects.js';
const app = express();
const port = config.getPort();
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
app.use(cors({
    origin: (origin, callback) => {
        if (config.isDevelopment()) {
            return callback(null, true);
        }
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
app.use(compression());
const limiter = rateLimit({
    ...config.getRateLimitConfig(),
    message: {
        error: 'Too Many Requests',
        message: 'Слишком много запросов. Попробуйте позже.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        return req.path === '/health';
    }
});
app.use(limiter);
if (!config.isTest()) {
    app.use(morgan('combined', {
        stream: {
            write: (message) => projectsLogger.info(message.trim())
        }
    }));
}
app.use(express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
        try {
            JSON.parse(buf.toString());
        }
        catch (e) {
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
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'projects-service',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        environment: config.getNodeEnv(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        pid: process.pid
    });
});
app.get('/metrics', (req, res) => {
    const metrics = {
        service: 'projects-service',
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
app.use('/api/projects', projectsRouter);
app.use('*', (req, res) => {
    projectsLogger.warn('Route not found', {
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
app.use((err, req, res, next) => {
    projectsLogger.error('Unhandled error', {
        error: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        body: req.body
    });
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
    const statusCode = err.statusCode || err.status || 500;
    const message = config.isDevelopment() ? err.message : 'Внутренняя ошибка сервера';
    res.status(statusCode).json({
        error: err.name || 'Internal Server Error',
        message,
        timestamp: new Date().toISOString(),
        ...(config.isDevelopment() && { stack: err.stack })
    });
});
const gracefulShutdown = (signal) => {
    return () => {
        projectsLogger.info(`Получен сигнал ${signal}. Завершение работы сервера...`);
        server.close(() => {
            projectsLogger.info('HTTP сервер закрыт');
            import('./services/projectsService.js').then(({ ProjectsService }) => {
                ProjectsService.disconnect().then(() => {
                    projectsLogger.info('Соединение с базой данных закрыто');
                    process.exit(0);
                });
            });
        });
        setTimeout(() => {
            projectsLogger.error('Принудительное завершение работы');
            process.exit(1);
        }, 10000);
    };
};
process.on('SIGTERM', gracefulShutdown('SIGTERM'));
process.on('SIGINT', gracefulShutdown('SIGINT'));
process.on('uncaughtException', (err) => {
    projectsLogger.error('Uncaught Exception', {
        error: err.message,
        stack: err.stack
    });
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    projectsLogger.error('Unhandled Rejection', {
        reason: reason,
        promise: promise
    });
    process.exit(1);
});
const server = app.listen(port, () => {
    projectsLogger.info(`🚀 Projects Service запущен на порту ${port}`);
    projectsLogger.info(`📊 Окружение: ${config.getNodeEnv()}`);
    projectsLogger.info(`🔒 JWT Secret: ${config.getJwtSecret().substring(0, 10)}...`);
    projectsLogger.info(`📚 Документация API: http://localhost:${port}/api/docs`);
    if (config.isDevelopment()) {
        projectsLogger.info(`🔧 Режим разработки активен`);
        projectsLogger.info(`📝 Логирование: ${config.getLogLevel()}`);
    }
});
export default app;
//# sourceMappingURL=index.js.map