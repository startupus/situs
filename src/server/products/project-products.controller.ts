import { Controller, Get, Post, Put, Delete, Param, Body, Query, Optional } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PrismaService } from '../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

/**
 * Контроллер для вложенных маршрутов продуктов в рамках проекта
 * /api/projects/:projectId/products
 */
@Controller('api/projects/:projectId/products')
export class ProjectProductsController {
  private readonly productsService?: ProductsService;
  constructor(@Optional() productsService?: ProductsService) {
    this.productsService = productsService;
  }

  @Get()
  async findAll(
    @Param('projectId') projectId: string,
    @Query() query: Omit<ProductQueryDto, 'projectId'>,
  ) {
    const svc = this.productsService ?? new ProductsService(new PrismaService());
    const result = await svc.findByProject(projectId, query);
    return { success: true, data: result };
  }

  @Post()
  async create(
    @Param('projectId') projectId: string,
    @Body() body: Omit<CreateProductDto, 'projectId'>,
  ) {
    const svc = this.productsService ?? new ProductsService(new PrismaService());
    const product = await svc.createInProject(projectId, body);
    return { success: true, data: product };
  }

  @Put(':productId')
  async update(
    @Param('projectId') projectId: string,
    @Param('productId') productId: string,
    @Body() body: UpdateProductDto,
  ) {
    const svc = this.productsService ?? new ProductsService(new PrismaService());
    const product = await svc.updateInProject(projectId, productId, body);
    return { success: true, data: product };
  }

  @Delete(':productId')
  async remove(
    @Param('projectId') projectId: string,
    @Param('productId') productId: string,
  ) {
    const svc = this.productsService ?? new ProductsService(new PrismaService());
    const result = await svc.removeInProject(projectId, productId);
    return { success: true, data: result };
  }
}


