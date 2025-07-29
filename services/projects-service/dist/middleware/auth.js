import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment.js';
import { projectsLogger } from '../utils/logger.js';
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        projectsLogger.securityEvent('missing_token', {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            url: req.originalUrl
        });
        return res.status(401).json({
            error: 'Access denied',
            message: 'Токен доступа не предоставлен'
        });
    }
    try {
        const decoded = jwt.verify(token, config.getJwtSecret());
        req.user = decoded;
        projectsLogger.authAttempt(decoded.id, true, req.ip);
        next();
    }
    catch (error) {
        projectsLogger.securityEvent('invalid_token', {
            token: token.substring(0, 20) + '...',
            error: error instanceof Error ? error.message : 'Unknown error',
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });
        return res.status(403).json({
            error: 'Access denied',
            message: 'Недействительный токен'
        });
    }
};
export const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Пользователь не аутентифицирован'
            });
        }
        const userRole = req.user.role;
        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        if (!allowedRoles.includes(userRole)) {
            projectsLogger.securityEvent('insufficient_permissions', {
                userId: req.user.id,
                userRole,
                requiredRoles: allowedRoles,
                url: req.originalUrl
            });
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Недостаточно прав доступа'
            });
        }
        next();
    };
};
export const requireOwnership = (resourceUserIdField = 'ownerId') => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Пользователь не аутентифицирован'
            });
        }
        const resourceOwnerId = req.body[resourceUserIdField] || req.params[resourceUserIdField];
        if (!resourceOwnerId) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'ID владельца ресурса не найден'
            });
        }
        if (req.user.role === 'ADMIN') {
            return next();
        }
        if (req.user.id !== resourceOwnerId) {
            projectsLogger.securityEvent('unauthorized_access_attempt', {
                userId: req.user.id,
                resourceOwnerId,
                url: req.originalUrl,
                method: req.method
            });
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Доступ запрещен: вы не являетесь владельцем этого ресурса'
            });
        }
        next();
    };
};
export const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return next();
    }
    try {
        const decoded = jwt.verify(token, config.getJwtSecret());
        req.user = decoded;
    }
    catch (error) {
        projectsLogger.debug('Optional auth failed', {
            error: error instanceof Error ? error.message : 'Unknown error',
            ip: req.ip
        });
    }
    next();
};
export const logRequest = (req, res, next) => {
    const startTime = Date.now();
    res.on('finish', () => {
        const responseTime = Date.now() - startTime;
        projectsLogger.apiRequest(req.method, req.originalUrl, req.user?.id, responseTime);
    });
    next();
};
export const generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
    }, config.getJwtSecret(), { expiresIn: '24h' });
};
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, config.getJwtSecret());
    }
    catch (error) {
        return null;
    }
};
//# sourceMappingURL=auth.js.map