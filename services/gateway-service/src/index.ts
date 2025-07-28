import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { config } from './config/environment.js';

const app = express();
const port = config.getPort();

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.getCorsOrigin(),
  credentials: true
}));

// Session и cookies
app.use(cookieParser());
app.use(session({
  secret: config.getSessionSecret(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.isCookieSecure(),
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 часа
  }
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
    service: 'gateway-service',
    timestamp: new Date().toISOString(),
    environment: config.getNodeEnv()
  });
});

// Proxy routes
app.use('/api/proxy', createProxyMiddleware({
  target: config.getProxyUrl(),
  changeOrigin: true,
  pathRewrite: {
    '^/api/proxy': '/api'
  }
}));

app.use('/api/agents', createProxyMiddleware({
  target: config.getAgentsUrl(),
  changeOrigin: true,
  pathRewrite: {
    '^/api/agents': '/api'
  }
}));

app.use('/api/providers', createProxyMiddleware({
  target: config.getProviderUrl(),
  changeOrigin: true,
  pathRewrite: {
    '^/api/providers': '/api'
  }
}));

app.use('/api/clients', createProxyMiddleware({
  target: config.getClientUrl(),
  changeOrigin: true,
  pathRewrite: {
    '^/api/clients': '/api'
  }
}));

app.use('/api/auth', createProxyMiddleware({
  target: config.getLoginusUrl(),
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '/api'
  }
}));

app.use('/api/billing', createProxyMiddleware({
  target: config.getBilingusUrl(),
  changeOrigin: true,
  pathRewrite: {
    '^/api/billing': '/api'
  }
}));

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Gateway error:', err);
  res.status(500).json({
    error: 'Gateway Error',
    message: config.isDevelopment() ? err.message : 'Service temporarily unavailable'
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
  console.log(`🚀 Gateway Service запущен на порту ${port}`);
  console.log(`📊 Окружение: ${config.getNodeEnv()}`);
  console.log(`🔗 Proxy URL: ${config.getProxyUrl()}`);
});

export default app; 