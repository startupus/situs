import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Scopes } from '../common/decorators/roles.decorator';

/**
 * Контроллер категорий товаров
 */
@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Scopes('PROJECT_READ')
  async findAll(@Query('productId') productId?: string) {
    const where = productId ? { productId } : {};
    const categories = await this.prisma.category.findMany({
      where,
      include: {
        children: true,
        _count: { select: { items: true } }
      },
      orderBy: [{ orderIndex: 'asc' }, { name: 'asc' }]
    });

    return { success: true, data: categories };
  }

  @Get(':id')
  @Scopes('PROJECT_READ')
  async findOne(@Param('id') id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        items: {
          take: 10,
          orderBy: { orderIndex: 'asc' }
        },
        _count: { select: { items: true } }
      }
    });

    if (!category) {
      return { success: false, error: 'Категория не найдена' };
    }

    return { success: true, data: category };
  }

  @Post()
  @Scopes('PROJECT_WRITE')
  async create(@Body() dto: CreateCategoryDto) {
    const category = await this.prisma.category.create({
      data: {
        name: dto.name,
        description: dto.description,
        slug: dto.slug,
        image: dto.image,
        parentId: dto.parentId,
        orderIndex: dto.orderIndex ?? 0,
        isActive: dto.isActive ?? true,
        productId: dto.productId
      },
      include: {
        parent: true,
        _count: { select: { items: true } }
      }
    });

    return { success: true, data: category };
  }

  @Put(':id')
  @Scopes('PROJECT_WRITE')
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    const category = await this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        slug: dto.slug,
        image: dto.image,
        parentId: dto.parentId,
        orderIndex: dto.orderIndex,
        isActive: dto.isActive
      },
      include: {
        parent: true,
        _count: { select: { items: true } }
      }
    });

    return { success: true, data: category };
  }

  @Delete(':id')
  @Scopes('PROJECT_ADMIN')
  async delete(@Param('id') id: string) {
    // Проверим, что в категории нет товаров
    const itemsCount = await this.prisma.item.count({ where: { categoryId: id } });
    if (itemsCount > 0) {
      return { 
        success: false, 
        error: `Нельзя удалить категорию с товарами (${itemsCount} товаров)` 
      };
    }

    // Проверим, что нет дочерних категорий
    const childrenCount = await this.prisma.category.count({ where: { parentId: id } });
    if (childrenCount > 0) {
      return { 
        success: false, 
        error: `Нельзя удалить категорию с подкатегориями (${childrenCount} подкатегорий)` 
      };
    }

    await this.prisma.category.delete({ where: { id } });
    return { success: true, message: 'Категория удалена' };
  }
}
