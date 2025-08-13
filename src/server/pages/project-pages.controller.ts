import { BadRequestException, Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Controller('api')
export class ProjectPagesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('projects/:projectId/pages')
  async list(
    @Param('projectId') projectId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const p = Math.max(1, parseInt(page || '1', 10) || 1);
    const l = Math.max(1, Math.min(100, parseInt(limit || '20', 10) || 20));
    const skip = (p - 1) * l;

    const where = { product: { projectId, type: 'WEBSITE' } } as const;
    const [pagesRaw, total] = await Promise.all([
      this.prisma.page.findMany({ where, skip, take: l, orderBy: [{ orderIndex: 'asc' }, { updatedAt: 'desc' }] }),
      this.prisma.page.count({ where }),
    ]);
    const pages = pagesRaw.map((pg) => ({
      ...pg,
      content: typeof (pg as any).content === 'string' && (pg as any).content ? safeJsonParse((pg as any).content as any, { blocks: [] }) : (pg as any).content ?? { blocks: [] },
    }));
    return { success: true, data: { pages, pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) } } };
  }

  @Patch('projects/:projectId/pages/reorder')
  async reorder(@Param('projectId') projectId: string, @Body() body: { ids: string[] }) {
    if (!body?.ids?.length) throw new BadRequestException('ids: string[] is required');
    const pages = await this.prisma.page.findMany({ where: { id: { in: body.ids }, product: { projectId } }, select: { id: true } });
    const valid = new Set(pages.map((p) => p.id));
    const ordered = body.ids.filter((id) => valid.has(id));
    await this.prisma.$transaction(ordered.map((id, idx) => this.prisma.page.update({ where: { id }, data: { orderIndex: idx } })));
    return { success: true, data: { updated: ordered.length } };
  }
}

function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}


