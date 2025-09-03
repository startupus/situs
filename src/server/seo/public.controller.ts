import { Controller, Get, Header, Query, Res, Req } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Public } from '../common/decorators/public.decorator';
import type { Response, Request } from 'express';
import { createHash } from 'crypto';

const cache = new Map<string, { ts: number; value: string; etag: string }>();
const TTL = 60 * 1000; // 1m

function computeEtag(body: string) {
  return 'W/"' + createHash('sha1').update(body).digest('hex') + '"';
}

@Controller()
export class PublicSeoController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get('robots.txt')
  async robots(
    @Query('project') projectId: string | undefined,
    @Query('allow') allow: string | undefined,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const key = `robots:${projectId || 'host'}`;
    const cached = cache.get(key);
    if (cached && Date.now() - cached.ts < TTL) {
      if (req.headers['if-none-match'] === cached.etag) {
        res.status(304).end();
        return;
      }
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('ETag', cached.etag);
      res.setHeader('Cache-Control', 'public, max-age=60');
      return res.send(cached.value);
    }

    let isAllow = true;
    try {
      if (projectId) {
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        isAllow = !!project?.isPublished;
      }
    } catch {}
    const text = isAllow ? 'User-agent: *\nAllow: /' : 'User-agent: *\nDisallow: /';
    const etag = computeEtag(text);
    cache.set(key, { ts: Date.now(), value: text, etag });

    if (req.headers['if-none-match'] === etag) {
      res.status(304).end();
      return;
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('ETag', etag);
    res.setHeader('Cache-Control', 'public, max-age=60');
    return res.send(text);
  }

  @Public()
  @Get('sitemap.xml')
  async sitemap(@Query('project') projectId: string | undefined, @Res() res: Response, @Req() req: Request) {
    const key = `sitemap:${projectId || 'host'}`;
    const cached = cache.get(key);
    if (cached && Date.now() - cached.ts < TTL) {
      if (req.headers['if-none-match'] === cached.etag) {
        res.status(304).end();
        return;
      }
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('ETag', cached.etag);
      res.setHeader('Cache-Control', 'public, max-age=60');
      return res.send(cached.value);
    }

    let urls: Array<{ loc: string; lastmod?: string; priority?: string }> = [];
    try {
      if (projectId) {
        const pages = await this.prisma.page.findMany({
          where: { product: { projectId, type: 'WEBSITE' }, status: 'PUBLISHED' as any },
          orderBy: [{ isHomePage: 'desc' }, { orderIndex: 'asc' }],
          select: { slug: true, updatedAt: true, isHomePage: true },
        });
        const project = await this.prisma.project.findUnique({
          where: { id: projectId },
          select: { customDomain: true, domain: true },
        });
        const base = project?.customDomain || project?.domain || 'example.com';
        urls = pages.map((p) => ({
          loc: `https://${base}/${p.isHomePage ? '' : p.slug}`.replace(/\/$/, ''),
          lastmod: p.updatedAt.toISOString(),
          priority: p.isHomePage ? '1.0' : '0.6',
        }));
      }
    } catch {}

    const body = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n${urls
      .map(
        (u) =>
          `  <url>\n    <loc>${u.loc}</loc>\n    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}\n    ${u.priority ? `<priority>${u.priority}</priority>` : ''}\n  </url>`,
      )
      .join('\n')}\n</urlset>`;
    const etag = computeEtag(body);
    cache.set(key, { ts: Date.now(), value: body, etag });

    if (req.headers['if-none-match'] === etag) {
      res.status(304).end();
      return;
    }

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('ETag', etag);
    res.setHeader('Cache-Control', 'public, max-age=60');
    return res.send(body);
  }
}
