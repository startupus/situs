import { Controller, Get, Header, Query } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

const cache = new Map<string, { ts: number; value: string }>();
const TTL = 60 * 1000; // 1m

@Controller()
export class PublicSeoController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('robots.txt')
  @Header('Content-Type', 'text/plain; charset=utf-8')
  async robots(@Query('project') projectId?: string, @Query('allow') allow?: string) {
    const key = `robots:${projectId || 'host'}`;
    const cached = cache.get(key);
    if (cached && Date.now() - cached.ts < TTL) return cached.value;

    let isAllow = true;
    try {
      if (projectId) {
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        isAllow = !!project?.isPublished;
      }
    } catch {}
    const text = isAllow ? 'User-agent: *\nAllow: /' : 'User-agent: *\nDisallow: /';
    cache.set(key, { ts: Date.now(), value: text });
    return text;
  }

  @Get('sitemap.xml')
  @Header('Content-Type', 'application/xml; charset=utf-8')
  async sitemap(@Query('project') projectId?: string) {
    const key = `sitemap:${projectId || 'host'}`;
    const cached = cache.get(key);
    if (cached && Date.now() - cached.ts < TTL) return cached.value;

    let urls: Array<{ loc: string; lastmod?: string; priority?: string }> = [];
    try {
      if (projectId) {
        const pages = await this.prisma.page.findMany({
          where: { product: { projectId, type: 'WEBSITE' }, status: 'PUBLISHED' as any },
          orderBy: [{ isHomePage: 'desc' }, { orderIndex: 'asc' }],
          select: { slug: true, updatedAt: true, isHomePage: true },
        });
        // В реальном мире домен берём из project.customDomain || project.domain
        const project = await this.prisma.project.findUnique({ where: { id: projectId }, select: { customDomain: true, domain: true } });
        const base = project?.customDomain || project?.domain || 'example.com';
        urls = pages.map((p) => ({
          loc: `https://${base}/${p.isHomePage ? '' : p.slug}`.replace(/\/$/, ''),
          lastmod: p.updatedAt.toISOString(),
          priority: p.isHomePage ? '1.0' : '0.6',
        }));
      }
    } catch {}

    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}\n    ${u.priority ? `<priority>${u.priority}</priority>` : ''}\n  </url>`)
      .join('\n')}\n</urlset>`;
    cache.set(key, { ts: Date.now(), value: body });
    return body;
  }
}