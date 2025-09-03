import { Controller, Get, Post, Body, Param, Query, Req, Put, Delete } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Scopes } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

/**
 * Простой контроллер страниц
 */
@Controller('pages')
export class PagesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Scopes('PROJECT_READ')
  async findAll(@Query('projectId') projectId?: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    const p = Math.max(1, parseInt(page || '1', 10) || 1);
    const l = Math.max(1, Math.min(100, parseInt(limit || '20', 10) || 20));
    const skip = (p - 1) * l;
    const where: any = projectId ? { product: { projectId, type: 'WEBSITE' } } : { product: { type: 'WEBSITE' } };
    const [pages, total] = await Promise.all([
      this.prisma.page.findMany({ where, skip, take: l, orderBy: [{ orderIndex: 'asc' }, { updatedAt: 'desc' }] }),
      this.prisma.page.count({ where }),
    ]);
    return {
      success: true,
      data: { pages, pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) } },
    };
  }

  @Get('preview')
  @Public()
  async preview(@Req() req: any) {
    const tenant = req.tenant as { projectId?: string; productId?: string } | undefined;
    const projectId = tenant?.projectId;
    if (!projectId)
      return { success: true, data: { pages: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } } };
    const pages = await this.prisma.page.findMany({
      where: { product: { projectId, type: 'WEBSITE' } },
      orderBy: [{ orderIndex: 'asc' }, { updatedAt: 'desc' }],
    });
    return { success: true, data: { pages } };
  }

  @Get(':id')
  @Scopes('PROJECT_READ')
  async findOne(@Param('id') id: string) {
    const page = await this.prisma.page.findUnique({ where: { id } });
    return { success: true, data: page };
  }

  @Post()
  @Scopes('PROJECT_WRITE')
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
  @Scopes('PROJECT_WRITE')
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

  @Delete(':id')
  @Scopes('PROJECT_ADMIN')
  async delete(@Param('id') id: string) {
    // Проверим, что страница существует и не является главной
    const page = await this.prisma.page.findUnique({ where: { id } });
    if (!page) {
      return { success: false, error: 'Страница не найдена' };
    }
    if (page.isHomePage) {
      return { success: false, error: 'Нельзя удалить главную страницу' };
    }

    await this.prisma.page.delete({ where: { id } });
    return { success: true, message: 'Страница удалена' };
  }
}
