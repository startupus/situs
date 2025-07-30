import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Resource Ownership Middleware
 * Устраняет уязвимость OWASP A01:2021 - Broken Access Control
 * 
 * Проверяет, что пользователь имеет право доступа к ресурсу:
 * - Владелец ресурса
 * - Администратор
 * - Модератор (для некоторых ресурсов)
 */

export interface ResourceOwnershipOptions {
  resourceType: 'project' | 'page' | 'user';
  paramName?: string; // Название параметра в req.params (по умолчанию 'id')
  allowAdmin?: boolean; // Разрешить доступ админам (по умолчанию true)
  allowModerator?: boolean; // Разрешить доступ модераторам (по умолчанию false)
}

/**
 * Middleware проверки владения ресурсом
 */
export const requireResourceOwnership = (options: ResourceOwnershipOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        resourceType,
        paramName = 'id',
        allowAdmin = true,
        allowModerator = false
      } = options;

      // Проверяем наличие аутентифицированного пользователя
      if (!req.user) {
        return res.status(401).json({
          error: {
            status: 401,
            name: 'UnauthorizedError',
            message: 'Требуется аутентификация',
            details: 'Resource ownership check failed: no authenticated user'
          }
        });
      }

      const userId = req.user.id;
      const userRole = req.user.role;
      const resourceId = req.params[paramName];

      // Проверяем наличие ID ресурса
      if (!resourceId) {
        return res.status(400).json({
          error: {
            status: 400,
            name: 'BadRequestError',
            message: `Отсутствует параметр ${paramName}`,
            details: `Resource ownership check failed: missing ${paramName} parameter`
          }
        });
      }

      // Админы имеют доступ ко всем ресурсам (если разрешено)
      if (allowAdmin && userRole === 'admin') {
        console.log(`🔐 Admin access granted: ${userId} -> ${resourceType}:${resourceId}`);
        return next();
      }

      // Модераторы имеют доступ к некоторым ресурсам (если разрешено)
      if (allowModerator && userRole === 'moderator') {
        console.log(`🔐 Moderator access granted: ${userId} -> ${resourceType}:${resourceId}`);
        return next();
      }

      // Проверяем владение ресурсом
      const isOwner = await checkResourceOwnership(resourceType, resourceId, userId);

      if (!isOwner) {
        // Логируем попытку несанкционированного доступа
        console.warn(`🚨 SECURITY: Unauthorized access attempt`);
        console.warn(`   User: ${userId} (${userRole})`);
        console.warn(`   Resource: ${resourceType}:${resourceId}`);
        console.warn(`   IP: ${req.ip}`);
        console.warn(`   User-Agent: ${req.get('User-Agent')}`);

        return res.status(403).json({
          error: {
            status: 403,
            name: 'ForbiddenError',
            message: 'Доступ запрещен',
            details: `У вас нет прав доступа к этому ${resourceType}`
          }
        });
      }

      // Доступ разрешен
      console.log(`✅ Resource access granted: ${userId} -> ${resourceType}:${resourceId}`);
      next();

    } catch (error) {
      console.error('❌ Resource ownership check error:', error);
      return res.status(500).json({
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Ошибка проверки прав доступа'
        }
      });
    }
  };
};

/**
 * Проверка владения ресурсом в базе данных
 */
async function checkResourceOwnership(
  resourceType: string,
  resourceId: string,
  userId: string
): Promise<boolean> {
  try {
    switch (resourceType) {
      case 'project':
        const project = await prisma.project.findFirst({
          where: {
            id: resourceId,
            userId: userId // Проект принадлежит пользователю
          },
          select: { id: true }
        });
        return !!project;

      case 'page':
        const page = await prisma.page.findFirst({
          where: {
            id: resourceId,
            project: {
              userId: userId // Страница принадлежит проекту пользователя
            }
          },
          select: { id: true }
        });
        return !!page;

      case 'user':
        // Пользователь может управлять только своим профилем
        return resourceId === userId;

      default:
        console.error(`❌ Unknown resource type: ${resourceType}`);
        return false;
    }
  } catch (error) {
    console.error(`❌ Database error checking ownership:`, error);
    return false;
  }
}

/**
 * Middleware для проверки владения проектом
 */
export const requireProjectOwnership = requireResourceOwnership({
  resourceType: 'project',
  allowAdmin: true,
  allowModerator: false
});

/**
 * Middleware для проверки владения страницей
 */
export const requirePageOwnership = requireResourceOwnership({
  resourceType: 'page',
  allowAdmin: true,
  allowModerator: true // Модераторы могут редактировать страницы
});

/**
 * Middleware для проверки доступа к профилю пользователя
 */
export const requireUserProfileAccess = requireResourceOwnership({
  resourceType: 'user',
  allowAdmin: true,
  allowModerator: false
});

export default {
  requireResourceOwnership,
  requireProjectOwnership,
  requirePageOwnership,
  requireUserProfileAccess
};