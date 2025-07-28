import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/environment.js';
import { logger } from './utils/logger.js';

const app = express();
const port = config.getPort();

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.getCorsOrigin(),
  credentials: true
}));

// Rate limiting
const limiter = rateLimit(config.getRateLimitConfig());
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'hubus-service',
    timestamp: new Date().toISOString(),
    environment: config.getNodeEnv()
  });
});

// API routes
app.get('/api/v1/providers', (req, res) => {
  res.json({
    message: 'Hubus Service - Providers API',
    data: []
  });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: config.isDevelopment() ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
app.listen(port, () => {
  logger.info(`🚀 Hubus Service запущен на порту ${port}`);
  logger.info(`📊 Окружение: ${config.getNodeEnv()}`);
  logger.info(`🔒 JWT Secret: ${config.getJwtSecret().substring(0, 10)}...`);
});

export default app; 