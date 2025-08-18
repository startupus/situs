import { BadRequestException, Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ReorderPagesDto } from './dto/reorder-pages.dto';
import { Scopes } from '../common/decorators/roles.decorator';

@Controller('api')
export class ProjectPagesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('projects/:projectId/pages')
  @Scopes('PROJECT_READ')
  async list(
    @Param('projectId') projectId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const p = Math.max(1, parseInt(page || '1', 10) || 1);
    const l = Math.max(1, Math.min(100, parseInt(limit || '20', 10) || 20));
    const skip = (p - 1) * l;

    const where = { product: { projectId, type: 'WEBSITE' } } as const;
    const [pages, total] = await Promise.all([
      this.prisma.page.findMany({ where, skip, take: l, orderBy: [{ orderIndex: 'asc' }, { updatedAt: 'desc' }] }),
      this.prisma.page.count({ where }),
    ]);
    return { success: true, data: { pages, pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) } } };
  }

  @Get('projects/:projectId/products/:productId/pages')
  @Scopes('PROJECT_READ')
  async listByProduct(
    @Param('projectId') projectId: string,
    @Param('productId') productId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const p = Math.max(1, parseInt(page || '1', 10) || 1);
    const l = Math.max(1, Math.min(100, parseInt(limit || '20', 10) || 20));
    const skip = (p - 1) * l;

    const where = { productId, product: { projectId } } as const;
    const [pages, total] = await Promise.all([
      this.prisma.page.findMany({ where, skip, take: l, orderBy: [{ orderIndex: 'asc' }, { updatedAt: 'desc' }] }),
      this.prisma.page.count({ where }),
    ]);
    return { success: true, data: { pages, pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) } } };
  }

  @Patch('projects/:projectId/pages/reorder')
  @Scopes('PROJECT_WRITE')
  async reorder(@Param('projectId') projectId: string, @Body() body: ReorderPagesDto) {
    if (!body?.ids?.length) throw new BadRequestException('ids: string[] is required');
    const pages = await this.prisma.page.findMany({ where: { id: { in: body.ids }, product: { projectId } }, select: { id: true } });
    const valid = new Set(pages.map((p) => p.id));
    const ordered = body.ids.filter((id) => valid.has(id));
    await this.prisma.$transaction(ordered.map((id, idx) => this.prisma.page.update({ where: { id }, data: { orderIndex: idx } })));
    return { success: true, data: { updated: ordered.length } };
  }
}


