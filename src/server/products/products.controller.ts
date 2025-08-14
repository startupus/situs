import { Controller, Get, Post, Body, Param, Query, Put, Delete, Optional } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PrismaService } from '../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { Scopes } from '../common/decorators/roles.decorator';

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
  @Scopes('PROJECT_READ')
  async findAll(@Query() query: ProductQueryDto) {
    try {
      const svc = this.productsService ?? new ProductsService(new PrismaService());
      const result = await svc.findAll(query);
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
  @Scopes('PROJECT_READ')
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
  @Scopes('PROJECT_READ')
  async findOne(@Param('id') id: string) {
    const svc = this.productsService ?? new ProductsService(new PrismaService());
    const result = await svc.findOne(id);
    return { success: true, data: result };
  }

  @Post()
  @Scopes('PROJECT_WRITE')
  async create(@Body() createDto: CreateProductDto) {
    try {
      const svc = this.productsService ?? new ProductsService(new PrismaService());
      const result = await svc.create(createDto);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error?.message || 'Ошибка создания продукта' };
    }
  }

  @Put(':id')
  @Scopes('PROJECT_WRITE')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
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
  @Scopes('PROJECT_ADMIN')
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
