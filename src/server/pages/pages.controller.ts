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
    const pages = pagesRaw.map((pg) => ({
      ...pg,
      content: typeof pg.content === 'string' && pg.content ? safeJsonParse(pg.content, { blocks: [] }) : (pg as any).content ?? { blocks: [] },
    }));
    return { success: true, data: { pages, pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) } } };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const pg = await this.prisma.page.findUnique({ where: { id } });
    const page = pg
      ? { ...pg, content: typeof pg.content === 'string' && pg.content ? safeJsonParse(pg.content, { blocks: [] }) : (pg as any).content ?? { blocks: [] } }
      : null;
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
      payload.content = JSON.stringify(payload.content);
    }
    const created = await this.prisma.page.create({ data: payload });
    const data = { ...created, content: created.content ? safeJsonParse(created.content as any, { blocks: [] }) : { blocks: [] } };
    return { success: true, data };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const payload = { ...body };
    if (payload.content && typeof payload.content !== 'string') {
      payload.content = JSON.stringify(payload.content);
    }
    const updated = await this.prisma.page.update({ where: { id }, data: payload });
    const data = { ...updated, content: updated.content ? safeJsonParse(updated.content as any, { blocks: [] }) : { blocks: [] } };
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
