import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
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
    const [pages, total] = await Promise.all([
      this.prisma.page.findMany({ where, skip, take: l, orderBy: [{ orderIndex: 'asc' }, { updatedAt: 'desc' }] }),
      this.prisma.page.count({ where }),
    ]);
    return { success: true, data: { pages, pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) } } };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return {
      success: true,
      data: {
        id,
        name: 'Страница ' + id,
        slug: 'page-' + id,
        content: { blocks: [] },
        status: 'active'
      }
    };
  }

  @Post()
  async create(@Body() createPageDto: any) {
    const created = await this.prisma.page.create({ data: createPageDto });
    return { success: true, data: created };
  }
}
