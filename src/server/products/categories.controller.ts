import { Controller, Get, Post, Body, Param, Put, Delete, Query, Patch } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Scopes } from '../common/decorators/roles.decorator';

/**
 * Контроллер категорий товаров
 */
@Controller('categories')
export class CategoriesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Scopes('PROJECT_READ')
  async findAll(
    @Query('productId') productId?: string,
    @Query('parentId') parentId?: string,
    @Query('level') level?: string,
  ) {
    const where: any = {};

    if (productId) where.productId = productId;
    if (parentId) where.parentId = parentId;

    // Фильтрация по уровню иерархии (аналог системы меню)
    if (level) {
      const levelNum = parseInt(level, 10);
      if (!isNaN(levelNum)) {
        // Простая логика: level 1 = parentId null, level 2+ = parentId не null
        if (levelNum === 1) {
          where.parentId = null;
        } else {
          where.parentId = { not: null };
        }
      }
    }

    const categories = await this.prisma.category.findMany({
      where,
      include: {
        children: {
          include: {
            _count: { select: { items: true } },
          },
        },
        parent: true,
        _count: { select: { items: true } },
      },
      orderBy: [{ orderIndex: 'asc' }, { name: 'asc' }],
    });

    return { success: true, data: categories };
  }

  // Аналог getItems из системы меню - мультипараметровая фильтрация
  @Get('items-by-filters')
  @Scopes('PROJECT_READ')
  async getItemsByFilters(
    @Query('productId') productId: string,
    @Query('properties') properties?: string,
    @Query('values') values?: string,
  ) {
    if (!productId) {
      return { success: false, error: 'Параметр productId обязателен' };
    }

    const where: any = { productId, isActive: true };

    // Мультипараметровая фильтрация (как в Joomla)
    if (properties && values) {
      const propertiesArray = properties.split(',');
      const valuesArray = values.split(',');

      if (propertiesArray.length === valuesArray.length) {
        propertiesArray.forEach((prop, index) => {
          const value = valuesArray[index];
          if (prop === 'parentId' && value === 'null') {
            where[prop] = null;
          } else if (value.includes('|')) {
            // Поддержка множественных значений через |
            where[prop] = { in: value.split('|') };
          } else {
            where[prop] = value;
          }
        });
      }
    }

    const categories = await this.prisma.category.findMany({
      where,
      include: {
        children: true,
        parent: true,
        _count: { select: { items: true } },
      },
      orderBy: [{ orderIndex: 'asc' }, { name: 'asc' }],
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
          orderBy: { orderIndex: 'asc' },
        },
        _count: { select: { items: true } },
      },
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
        productId: dto.productId,
      },
      include: {
        parent: true,
        _count: { select: { items: true } },
      },
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
        isActive: dto.isActive,
      },
      include: {
        parent: true,
        _count: { select: { items: true } },
      },
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
        error: `Нельзя удалить категорию с товарами (${itemsCount} товаров)`,
      };
    }

    // Проверим, что нет дочерних категорий
    const childrenCount = await this.prisma.category.count({ where: { parentId: id } });
    if (childrenCount > 0) {
      return {
        success: false,
        error: `Нельзя удалить категорию с подкатегориями (${childrenCount} подкатегорий)`,
      };
    }

    await this.prisma.category.delete({ where: { id } });
    return { success: true, message: 'Категория удалена' };
  }

  // Изменение порядка категорий (аналог системы меню)
  @Patch('reorder')
  @Scopes('PROJECT_WRITE')
  async reorder(@Body() dto: { items: Array<{ id: string; orderIndex: number; parentId?: string }> }) {
    if (!dto.items || !Array.isArray(dto.items)) {
      return { success: false, error: 'Параметр items должен быть массивом' };
    }

    // Обновляем все категории в рамках одной транзакции
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.category.update({
          where: { id: item.id },
          data: {
            orderIndex: item.orderIndex,
            parentId: item.parentId,
          },
        }),
      ),
    );

    return { success: true, message: 'Порядок категорий обновлен' };
  }
}
