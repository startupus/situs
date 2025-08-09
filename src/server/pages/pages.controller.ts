import { Controller, Get, Post, Body, Param } from '@nestjs/common';

/**
 * Простой контроллер страниц
 */
@Controller('api/pages')
export class PagesController {
  @Get()
  findAll() {
    return {
      success: true,
      data: {
        pages: [
          {
            id: '1',
            name: 'Главная',
            slug: 'home',
            content: { blocks: [] },
            projectId: '1',
            status: 'published'
          },
          {
            id: '2',
            name: 'О компании',
            slug: 'about',
            content: { blocks: [] },
            projectId: '1',
            status: 'draft'
          }
        ],
        pagination: { page: 1, limit: 20, total: 2, totalPages: 1 }
      }
    };
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
  create(@Body() createPageDto: any) {
    return {
      success: true,
      data: {
        id: Date.now().toString(),
        ...createPageDto,
        createdAt: new Date().toISOString()
      }
    };
  }
}
