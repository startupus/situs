import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../database/prisma.service';

/**
 * Middleware для резолвинга арендатора по Host/домену
 * Добавляет в request контекст projectId/productId если домен привязан
 */
@Injectable()
export class TenantResolverMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    try {
      const host = (req.headers['x-forwarded-host'] as string) || (req.headers['host'] as string) || '';
      const hostname = host.split(':')[0];
      const parts = hostname.split('.');
      const tenant: any = { host: hostname, subdomain: parts.length > 2 ? parts[0] : undefined };

      // Попытка найти проект по customDomain или domain
      if (hostname) {
        try {
          const project = await this.prisma.project.findFirst({
            where: { OR: [{ customDomain: hostname }, { domain: hostname }] },
          });
          if (project) {
            tenant.projectId = project.id;
            // Найти Website продукт данного проекта
            const website = await this.prisma.product.findFirst({ where: { projectId: project.id, type: 'WEBSITE' } });
            if (website) tenant.productId = website.id;
          }
        } catch {}
      }
      (req as any).tenant = tenant;
    } catch {}
    next();
  }
}
