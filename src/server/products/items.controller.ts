import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Scopes } from '../common/decorators/roles.decorator';

/**
 * Контроллер товаров
 */
@Controller('api/items')
export class ItemsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Scopes('PROJECT_READ')
  async findAll(
    @Query('productId') productId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const p = Math.max(1, parseInt(page || '1', 10) || 1);
    const l = Math.max(1, Math.min(100, parseInt(limit || '20', 10) || 20));
    const skip = (p - 1) * l;

    const where: any = {};
    if (productId) where.productId = productId;
    if (categoryId) where.categoryId = categoryId;
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      this.prisma.item.findMany({
        where,
        skip,
        take: l,
        include: {
          category: { select: { id: true, name: true, slug: true } }
        },
        orderBy: [{ orderIndex: 'asc' }, { name: 'asc' }]
      }),
      this.prisma.item.count({ where })
    ]);

    return {
      success: true,
      data: {
        items,
        pagination: {
          page: p,
          limit: l,
          total,
          totalPages: Math.ceil(total / l)
        }
      }
    };
  }

  @Get(':id')
  @Scopes('PROJECT_READ')
  async findOne(@Param('id') id: string) {
    const item = await this.prisma.item.findUnique({
      where: { id },
      include: {
        category: true,
        product: { select: { id: true, name: true, type: true } }
      }
    });

    if (!item) {
      return { success: false, error: 'Товар не найден' };
    }

    return { success: true, data: item };
  }

  @Post()
  @Scopes('PROJECT_WRITE')
  async create(@Body() dto: CreateItemDto) {
    const item = await this.prisma.item.create({
      data: {
        name: dto.name,
        description: dto.description,
        slug: dto.slug,
        price: dto.price,
        comparePrice: dto.comparePrice,
        costPrice: dto.costPrice,
        sku: dto.sku,
        barcode: dto.barcode,
        trackQuantity: dto.trackQuantity ?? true,
        quantity: dto.quantity ?? 0,
        lowStockThreshold: dto.lowStockThreshold,
        images: dto.images ?? '[]',
        content: dto.content,
        metaTitle: dto.metaTitle,
        metaDescription: dto.metaDescription,
        metaKeywords: dto.metaKeywords,
        status: dto.status ?? 'DRAFT',
        isDigital: dto.isDigital ?? false,
        weight: dto.weight,
        dimensions: dto.dimensions,
        categoryId: dto.categoryId,
        productId: dto.productId,
        orderIndex: dto.orderIndex ?? 0,
        isFeatured: dto.isFeatured ?? false
      },
      include: {
        category: { select: { id: true, name: true, slug: true } }
      }
    });

    return { success: true, data: item };
  }

  @Put(':id')
  @Scopes('PROJECT_WRITE')
  async update(@Param('id') id: string, @Body() dto: UpdateItemDto) {
    const item = await this.prisma.item.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        slug: dto.slug,
        price: dto.price,
        comparePrice: dto.comparePrice,
        costPrice: dto.costPrice,
        sku: dto.sku,
        barcode: dto.barcode,
        trackQuantity: dto.trackQuantity,
        quantity: dto.quantity,
        lowStockThreshold: dto.lowStockThreshold,
        images: dto.images,
        content: dto.content,
        metaTitle: dto.metaTitle,
        metaDescription: dto.metaDescription,
        metaKeywords: dto.metaKeywords,
        status: dto.status as any,
        isDigital: dto.isDigital,
        weight: dto.weight,
        dimensions: dto.dimensions,
        orderIndex: dto.orderIndex,
        isFeatured: dto.isFeatured
      },
      include: {
        category: { select: { id: true, name: true, slug: true } }
      }
    });

    return { success: true, data: item };
  }

  @Delete(':id')
  @Scopes('PROJECT_ADMIN')
  async delete(@Param('id') id: string) {
    await this.prisma.item.delete({ where: { id } });
    return { success: true, message: 'Товар удален' };
  }
}
