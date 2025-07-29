import winston from 'winston';
import { config } from '../config/environment.js';
const customFormat = winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
    return JSON.stringify({
        timestamp,
        level,
        service: service || 'projects-service',
        message,
        ...meta
    });
});
const logger = winston.createLogger({
    level: config.getLogLevel(),
    format: winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), config.isDevelopment()
        ? winston.format.combine(winston.format.colorize(), winston.format.simple())
        : customFormat),
    defaultMeta: {
        service: 'projects-service',
        version: '1.0.0'
    },
    transports: [
        new winston.transports.Console({
            silent: config.isTest()
        }),
        ...(config.isProduction() ? [
            new winston.transports.File({
                filename: 'logs/projects-error.log',
                level: 'error',
                maxsize: 5242880,
                maxFiles: 5
            }),
            new winston.transports.File({
                filename: 'logs/projects-combined.log',
                maxsize: 5242880,
                maxFiles: 5
            })
        ] : [])
    ],
});
export const projectsLogger = {
    error: (message, meta) => logger.error(message, meta),
    warn: (message, meta) => logger.warn(message, meta),
    info: (message, meta) => logger.info(message, meta),
    debug: (message, meta) => logger.debug(message, meta),
    projectCreated: (projectId, userId, projectName) => {
        logger.info('Project created', {
            action: 'project_created',
            projectId,
            userId,
            projectName,
            timestamp: new Date().toISOString()
        });
    },
    projectUpdated: (projectId, userId, changes) => {
        logger.info('Project updated', {
            action: 'project_updated',
            projectId,
            userId,
            changes,
            timestamp: new Date().toISOString()
        });
    },
    projectDeleted: (projectId, userId) => {
        logger.info('Project deleted', {
            action: 'project_deleted',
            projectId,
            userId,
            timestamp: new Date().toISOString()
        });
    },
    projectPublished: (projectId, userId, domain) => {
        logger.info('Project published', {
            action: 'project_published',
            projectId,
            userId,
            domain,
            timestamp: new Date().toISOString()
        });
    },
    authAttempt: (userId, success, ip) => {
        logger.info('Authentication attempt', {
            action: 'auth_attempt',
            userId,
            success,
            ip,
            timestamp: new Date().toISOString()
        });
    },
    apiRequest: (method, url, userId, responseTime) => {
        logger.info('API request', {
            action: 'api_request',
            method,
            url,
            userId,
            responseTime,
            timestamp: new Date().toISOString()
        });
    },
    securityEvent: (event, details) => {
        logger.warn('Security event', {
            action: 'security_event',
            event,
            details,
            timestamp: new Date().toISOString()
        });
    },
    performanceMetric: (metric, value, context) => {
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
//# sourceMappingURL=logger.js.map