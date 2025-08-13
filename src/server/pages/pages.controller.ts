import { Controller, Get, Post, Body, Param, Query, Put } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

/**
 * Простой контроллер страниц
 */
@Controller('api/pages')
export class PagesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll(@Query('projectId') projectId?: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    const p = Math.max(1, parseInt(page || '1', 10) || 1);
    const l = Math.max(1, Math.min(100, parseInt(limit || '20', 10) || 20));
    const skip = (p - 1) * l;
    const where: any = projectId
      ? { product: { projectId, type: 'WEBSITE' } }
      : { product: { type: 'WEBSITE' } };
    const [pagesRaw, total] = await Promise.all([
      this.prisma.page.findMany({ where, skip, take: l, orderBy: [{ orderIndex: 'asc' }, { updatedAt: 'desc' }] }),
      this.prisma.page.count({ where }),
    ]);
    const pages = pagesRaw.map((pg) => {
      const parsed = typeof pg.content === 'string' && pg.content ? safeJsonParse(pg.content, {}) : (pg as any).content;
      const content = Array.isArray(parsed)
        ? { blocks: parsed }
        : (parsed && typeof parsed === 'object' && 'blocks' in (parsed as any))
          ? (parsed as any)
          : { blocks: [] };
      return { ...pg, content };
    });
    return { success: true, data: { pages, pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) } } };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const pg = await this.prisma.page.findUnique({ where: { id } });
    const page = pg ? (() => {
      const parsed = typeof pg.content === 'string' && pg.content ? safeJsonParse(pg.content, {}) : (pg as any).content;
      const content = Array.isArray(parsed)
        ? { blocks: parsed }
        : (parsed && typeof parsed === 'object' && 'blocks' in (parsed as any))
          ? (parsed as any)
          : { blocks: [] };
      return { ...pg, content };
    })() : null;
    return { success: true, data: page };
  }

  @Post()
  async create(@Body() createPageDto: any) {
    const payload = { ...createPageDto };
    // Заполняем обязательные поля по умолчанию
    if (!payload.slug && payload.title) {
      payload.slug = payload.title.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9\-]/g,'');
    }
    if (!payload.status) payload.status = 'DRAFT';
    if (payload.orderIndex === undefined) payload.orderIndex = 0;
    if (payload.content && typeof payload.content !== 'string') {
      const contentNormalized = Array.isArray(payload.content)
        ? { blocks: payload.content }
        : (payload.content.blocks ? payload.content : { blocks: [] });
      payload.content = JSON.stringify(contentNormalized);
    }
    const created = await this.prisma.page.create({ data: payload });
    const parsed = created.content ? safeJsonParse(created.content as any, {}) : {};
    const content = Array.isArray(parsed)
      ? { blocks: parsed }
      : (parsed && typeof parsed === 'object' && 'blocks' in (parsed as any)) ? (parsed as any) : { blocks: [] };
    const data = { ...created, content };
    return { success: true, data };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const payload = { ...body };
    if (payload.content && typeof payload.content !== 'string') {
      const contentNormalized = Array.isArray(payload.content)
        ? { blocks: payload.content }
        : (payload.content.blocks ? payload.content : { blocks: [] });
      payload.content = JSON.stringify(contentNormalized);
    }
    const updated = await this.prisma.page.update({ where: { id }, data: payload });
    const parsed = updated.content ? safeJsonParse(updated.content as any, {}) : {};
    const content = Array.isArray(parsed)
      ? { blocks: parsed }
      : (parsed && typeof parsed === 'object' && 'blocks' in (parsed as any)) ? (parsed as any) : { blocks: [] };
    const data = { ...updated, content };
    return { success: true, data };
  }
}

function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
