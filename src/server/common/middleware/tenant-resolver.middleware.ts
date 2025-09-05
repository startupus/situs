import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Расширяем интерфейс Request для добавления tenantId
declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
    }
  }
}

/**
 * Middleware для извлечения tenant ID из заголовков запроса
 *
 * Поддерживает несколько стратегий:
 * - x-tenant-id заголовок
 * - subdomain (например, tenant1.example.com)
 * - path parameter (/api/tenant/tenant1/projects)
 * - JWT token payload
 */
@Injectable()
export class TenantResolverMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 1. Проверяем заголовок x-tenant-id
    let tenantId = req.headers['x-tenant-id'] as string;

    if (tenantId) {
      req.tenantId = tenantId;
      next();
      return;
    }

    // 2. Проверяем subdomain
    const host = req.headers.host;
    if (host) {
      const subdomain = this.extractSubdomain(host);
      if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
        req.tenantId = subdomain;
        next();
        return;
      }
    }

    // 3. Проверяем path parameter
    const pathMatch = req.path.match(/^\/api\/tenant\/([^\/]+)/);
    if (pathMatch) {
      req.tenantId = pathMatch[1];
      next();
      return;
    }

    // 4. Проверяем JWT token payload
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const payload = this.parseJwtPayload(token);
        if (payload.tenantId) {
          req.tenantId = payload.tenantId;
          next();
          return;
        }
      } catch (error) {
        // Игнорируем ошибки парсинга JWT
      }
    }

    // 5. Если tenant не найден, используем дефолтный
    req.tenantId = 'default';
    next();
  }

  private extractSubdomain(host: string): string | null {
    const parts = host.split('.');
    if (parts.length >= 3) {
      return parts[0];
    }
    return null;
  }

  private parseJwtPayload(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return {};
    }
  }
}
