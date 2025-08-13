import { Controller, Get, Header, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class PublicSeoController {
  @Get('robots.txt')
  @Header('Content-Type', 'text/plain; charset=utf-8')
  robots(@Query('project') projectId?: string) {
    // Простой robots: закрыт в dev, открыт если проект опубликован (упростим)
    const isAllow = true;
    return isAllow ? 'User-agent: *\nAllow: /' : 'User-agent: *\nDisallow: /';
  }

  @Get('sitemap.xml')
  @Header('Content-Type', 'application/xml; charset=utf-8')
  sitemap(@Query('project') projectId?: string) {
    const now = new Date().toISOString();
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    return xml;
  }
}