import { Controller, Get, Post, Body, Param, Query, Put, Delete, Optional } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PrismaService } from '../database/prisma.service';

/**
 * Контроллер продуктов (глобальные маршруты)
 */
@Controller('api/products')
export class ProductsController {
  private readonly productsService?: ProductsService;
  constructor(@Optional() productsService?: ProductsService) {
    this.productsService = productsService;
  }

  @Get('health')
  health() {
    return { status: 'ok', scope: 'products', timestamp: new Date().toISOString() };
  }

  @Get('debug-di')
  debugDi() {
    return { hasService: !!this.productsService };
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('projectId') projectId?: string,
  ) {
    try {
      const svc = this.productsService ?? new ProductsService(new PrismaService());
      const result = await svc.findAll({
        page: page ? parseInt(page, 10) : undefined,
        limit: limit ? parseInt(limit, 10) : undefined,
        type,
        status,
        projectId,
      });
      return { success: true, data: result };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Ошибка получения продуктов',
        data: { products: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } },
      };
    }
  }

  /** Список доступных к установке типов продуктов (каталог предустановленных сервисов) */
  @Get('catalog/types')
  getProductTypes() {
    return {
      success: true,
      data: [
        { key: 'PAGES', title: 'Страницы', type: 'WEBSITE', icon: 'FiFileText' },
        { key: 'BLOG', title: 'Блог', type: 'BLOG', icon: 'FiBookOpen' },
        { key: 'STORE', title: 'Магазин', type: 'STORE', icon: 'FiShoppingCart' },
      ],
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const svc = this.productsService ?? new ProductsService(new PrismaService());
    const result = await svc.findOne(id);
    return { success: true, data: result };
  }

  @Post()
  async create(@Body() createDto: { name: string; description?: string; type: string; projectId: string; settings?: string }) {
    try {
      const svc = this.productsService ?? new ProductsService(new PrismaService());
      const result = await svc.create(createDto);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error?.message || 'Ошибка создания продукта' };
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<{ name: string; description?: string; type: string; status: string; settings?: string }>,
  ) {
    try {
      const svc = this.productsService ?? new ProductsService(new PrismaService());
      const result = await svc.update(id, body);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error?.message || 'Ошибка обновления продукта' };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const svc = this.productsService ?? new ProductsService(new PrismaService());
      const result = await svc.remove(id);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error?.message || 'Ошибка удаления продукта' };
    }
  }
}
