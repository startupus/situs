import { Controller, Get, Post, Body, Param, Query, Req, Put } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

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

  @Get('preview')
  async preview(@Req() req: any) {
    const tenant = req.tenant as { projectId?: string; productId?: string } | undefined;
    const projectId = tenant?.projectId;
    if (!projectId) return { success: true, data: { pages: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } } };
    const pages = await this.prisma.page.findMany({ where: { product: { projectId, type: 'WEBSITE' } }, orderBy: [{ orderIndex: 'asc' }, { updatedAt: 'desc' }] });
    return { success: true, data: { pages } };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const page = await this.prisma.page.findUnique({ where: { id } });
    return { success: true, data: page };
  }

  @Post()
  async create(@Body() dto: CreatePageDto) {
    const created = await this.prisma.page.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        content: dto.content,
        pageType: (dto.pageType as any) ?? 'PAGE',
        status: (dto.status as any) ?? 'DRAFT',
        isHomePage: !!dto.isHomePage,
        product: { connect: { id: dto.productId } },
      },
    });
    return { success: true, data: created };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePageDto) {
    const updated = await this.prisma.page.update({
      where: { id },
      data: {
        title: dto.title,
        slug: dto.slug,
        content: dto.content,
        pageType: (dto.pageType as any) ?? undefined,
        status: (dto.status as any) ?? undefined,
        isHomePage: dto.isHomePage,
      },
    });
    return { success: true, data: updated };
  }
}
