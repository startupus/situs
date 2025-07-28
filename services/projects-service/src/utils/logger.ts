import winston from 'winston';
import { config } from '../config/environment.js';

// Создаем кастомный формат для логов
const customFormat = winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
  return JSON.stringify({
    timestamp,
    level,
    service: service || 'projects-service',
    message,
    ...meta
  });
});

// Конфигурация Winston
const logger = winston.createLogger({
  level: config.getLogLevel(),
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    config.isDevelopment() 
      ? winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      : customFormat
  ),
  defaultMeta: { 
    service: 'projects-service',
    version: '1.0.0'
  },
  transports: [
    // Консольный вывод
    new winston.transports.Console({
      silent: config.isTest()
    }),
    
    // Файловые логи только в production
    ...(config.isProduction() ? [
      new winston.transports.File({ 
        filename: 'logs/projects-error.log', 
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5
      }),
      new winston.transports.File({ 
        filename: 'logs/projects-combined.log',
        maxsize: 5242880, // 5MB
        maxFiles: 5
      })
    ] : [])
  ],
});

// Добавляем методы для различных типов логирования
export const projectsLogger = {
  // Стандартные методы логирования
  error: (message: string, meta?: any) => logger.error(message, meta),
  warn: (message: string, meta?: any) => logger.warn(message, meta),
  info: (message: string, meta?: any) => logger.info(message, meta),
  debug: (message: string, meta?: any) => logger.debug(message, meta),

  // Специализированные методы для projects
  projectCreated: (projectId: string, userId: string, projectName: string) => {
    logger.info('Project created', {
      action: 'project_created',
      projectId,
      userId,
      projectName,
      timestamp: new Date().toISOString()
    });
  },

  projectUpdated: (projectId: string, userId: string, changes: any) => {
    logger.info('Project updated', {
      action: 'project_updated',
      projectId,
      userId,
      changes,
      timestamp: new Date().toISOString()
    });
  },

  projectDeleted: (projectId: string, userId: string) => {
    logger.info('Project deleted', {
      action: 'project_deleted',
      projectId,
      userId,
      timestamp: new Date().toISOString()
    });
  },

  projectPublished: (projectId: string, userId: string, domain?: string) => {
    logger.info('Project published', {
      action: 'project_published',
      projectId,
      userId,
      domain,
      timestamp: new Date().toISOString()
    });
  },

  authAttempt: (userId: string, success: boolean, ip?: string) => {
    logger.info('Authentication attempt', {
      action: 'auth_attempt',
      userId,
      success,
      ip,
      timestamp: new Date().toISOString()
    });
  },

  apiRequest: (method: string, url: string, userId?: string, responseTime?: number) => {
    logger.info('API request', {
      action: 'api_request',
      method,
      url,
      userId,
      responseTime,
      timestamp: new Date().toISOString()
    });
  },

  securityEvent: (event: string, details: any) => {
    logger.warn('Security event', {
      action: 'security_event',
      event,
      details,
      timestamp: new Date().toISOString()
    });
  },

  performanceMetric: (metric: string, value: number, context?: any) => {
    logger.info('Performance metric', {
      action: 'performance_metric',
      metric,
      value,
      context,
      timestamp: new Date().toISOString()
    });
  }
};

export { logger };
export default projectsLogger;