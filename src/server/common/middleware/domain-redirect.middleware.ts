import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DomainRedirectMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const host = (req.headers['x-forwarded-host'] as string) || (req.headers['host'] as string) || '';
      const hostname = host.split(':')[0];
      if (!hostname) return next();

      const project = await this.prisma.project.findFirst({ where: { OR: [{ customDomain: hostname }, { domain: hostname }] }, select: { id: true, customDomain: true, domain: true, isPublished: true, settings: true } });
      if (!project) return next();

      // Разрешаем редирект только когда проект опубликован и домен верифицирован
      const settings = typeof project.settings === 'string' ? safeParse(project.settings) : (project.settings as any) || {};
      const verified = !!(settings && (settings.verifiedDomain || settings.domainVerified));
      if (project.isPublished && verified && project.customDomain && project.domain && hostname === project.domain) {
        const target = `https://${project.customDomain}${req.originalUrl || ''}`;
        return res.redirect(301, target);
      }
    } catch {}
    return next();
  }
}

function safeParse(s: string): any {
  try { return JSON.parse(s); } catch { return {}; }
}