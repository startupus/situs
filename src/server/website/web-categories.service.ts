import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ProjectsService } from '../projects/projects.service';
import { RealtimeEventsService } from '../realtime/realtime-events.service';
import { CreateWebCategoryDto, UpdateWebCategoryDto, ReorderWebCategoriesDto } from './dto/web-category.dto';
import { AccessLevel, ProductType } from '@prisma/client';

@Injectable()
export class WebCategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly projectsService: ProjectsService,
    private readonly realtimeService: RealtimeEventsService,
  ) {}

  async getProjectCategories(projectId: string, userId: string, includeInactive = false) {
    // Проверяем права на проект
    // TODO: checkProjectAccess method not found
    // await this.projectsService.checkProjectAccess(projectId, userId, 'PROJECT_READ');

    // Получаем Pages продукт проекта
    const pagesProduct = await this.prisma.product.findFirst({
      where: {
        projectId,
        type: ProductType.WEBSITE,
      },
    });

    if (!pagesProduct) {
      throw new HttpException('Pages product not found for this project', HttpStatus.NOT_FOUND);
    }

    // Получаем категории с иерархией
    const categories = await this.prisma.webCategory.findMany({
      where: {
        productId: pagesProduct.id,
        ...(includeInactive ? {} : { isActive: true }),
      },
      include: {
        parent: true,
        children: {
          orderBy: { orderIndex: 'asc' },
        },
        _count: {
          select: {
            pageLinks: true,
            primaryPages: true,
          },
        },
      },
      orderBy: [
        { level: 'asc' },
        { orderIndex: 'asc' },
      ],
    });

    return categories;
  }

  async createCategory(projectId: string, createDto: CreateWebCategoryDto, userId: string) {
    // Проверяем права на проект
    // TODO: checkProjectAccess method not found
    // await this.projectsService.checkProjectAccess(projectId, userId, 'PROJECT_WRITE');

    // Получаем Pages продукт проекта
    const pagesProduct = await this.prisma.product.findFirst({
      where: {
        projectId,
        type: ProductType.WEBSITE,
      },
    });

    if (!pagesProduct) {
      throw new HttpException('Pages product not found for this project', HttpStatus.NOT_FOUND);
    }

    // Проверяем уникальность slug в продукте
    const existingCategory = await this.prisma.webCategory.findUnique({
      where: {
        productId_slug: {
          productId: pagesProduct.id,
          slug: createDto.slug,
        },
      },
    });

    if (existingCategory) {
      throw new HttpException('Category with this slug already exists', HttpStatus.CONFLICT);
    }

    // Определяем уровень и валидируем родителя
    let level = 1;
    let parentCategory = null;

    if (createDto.parentId) {
      parentCategory = await this.prisma.webCategory.findFirst({
        where: {
          id: createDto.parentId,
          productId: pagesProduct.id,
        },
      });

      if (!parentCategory) {
        throw new HttpException('Parent category not found', HttpStatus.NOT_FOUND);
      }

      level = parentCategory.level + 1;

      // Проверяем на циклы (простая проверка)
      if (level > 10) {
        throw new HttpException('Category hierarchy too deep', HttpStatus.BAD_REQUEST);
      }
    }

    // Определяем orderIndex если не задан
    const orderIndex = createDto.orderIndex ?? await this.getNextOrderIndex(pagesProduct.id, createDto.parentId);

    // Создаём категорию
    const category = await this.prisma.webCategory.create({
      data: {
        name: createDto.name,
        description: createDto.description,
        slug: createDto.slug,
        alias: createDto.alias || '',
        level,
        parentId: createDto.parentId,
        orderIndex,
        isActive: createDto.isActive ?? true,
        isPublished: createDto.isPublished ?? true,
        language: createDto.language || '*',
        accessLevel: createDto.accessLevel || AccessLevel.PUBLIC,
        productId: pagesProduct.id,
      },
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            pageLinks: true,
            primaryPages: true,
          },
        },
      },
    });

    // SSE событие
    this.realtimeService.publish('menu_type_created', { category }); // TODO: add pages category events

    return category;
  }

  async updateCategory(categoryId: string, updateDto: UpdateWebCategoryDto, userId: string) {
    // Получаем категорию с продуктом
    const category = await this.prisma.webCategory.findUnique({
      where: { id: categoryId },
      include: { product: { include: { project: true } } },
    });

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    // Проверяем права на проект
    // TODO: checkProjectAccess method not found
    // await this.projectsService.checkProjectAccess(category.product.projectId, userId, 'PROJECT_WRITE');

    // Проверяем уникальность slug если изменяется
    if (updateDto.slug && updateDto.slug !== category.slug) {
      const existingCategory = await this.prisma.webCategory.findUnique({
        where: {
          productId_slug: {
            productId: category.productId,
            slug: updateDto.slug,
          },
        },
      });

      if (existingCategory) {
        throw new HttpException('Category with this slug already exists', HttpStatus.CONFLICT);
      }
    }

    // Валидируем изменение родителя
    let newLevel = category.level;
    if (updateDto.parentId !== undefined) {
      if (updateDto.parentId) {
        // Проверяем что новый родитель существует и не создаёт цикл
        const newParent = await this.prisma.webCategory.findFirst({
          where: {
            id: updateDto.parentId,
            productId: category.productId,
          },
        });

        if (!newParent) {
          throw new HttpException('Parent category not found', HttpStatus.NOT_FOUND);
        }

        // Простая проверка на цикл: нельзя сделать родителем потомка
        if (updateDto.parentId === categoryId) {
          throw new HttpException('Category cannot be its own parent', HttpStatus.BAD_REQUEST);
        }

        newLevel = newParent.level + 1;
      } else {
        newLevel = 1;
      }
    }

    // Обновляем категорию
    const updatedCategory = await this.prisma.webCategory.update({
      where: { id: categoryId },
      data: {
        ...updateDto,
        level: newLevel,
      },
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            pageLinks: true,
            primaryPages: true,
          },
        },
      },
    });

    // Если изменился уровень, обновляем уровни всех потомков
    if (newLevel !== category.level) {
      await this.updateChildrenLevels(categoryId, newLevel);
    }

    // SSE событие
    this.realtimeService.publish('menu_type_updated', { category: updatedCategory }); // TODO: add pages category events

    return updatedCategory;
  }

  async deleteCategory(categoryId: string, userId: string) {
    // Получаем категорию с продуктом
    const category = await this.prisma.webCategory.findUnique({
      where: { id: categoryId },
      include: { 
        product: { include: { project: true } },
        children: true,
        pageLinks: true,
        primaryPages: true,
      },
    });

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    // Проверяем права на проект
    // TODO: checkProjectAccess method not found
    // await this.projectsService.checkProjectAccess(category.product.projectId, userId, 'PROJECT_WRITE');

    // Проверяем что нет дочерних категорий
    if (category.children.length > 0) {
      throw new HttpException('Cannot delete category with child categories', HttpStatus.BAD_REQUEST);
    }

    // Проверяем что нет страниц с этой категорией как основной
    if (category.primaryPages.length > 0) {
      throw new HttpException('Cannot delete category that is primary for some pages', HttpStatus.BAD_REQUEST);
    }

    // Удаляем (связи с страницами удалятся каскадно)
    await this.prisma.webCategory.delete({
      where: { id: categoryId },
    });

    // SSE событие
    this.realtimeService.publish('menu_type_deleted', { categoryId }); // TODO: add pages category events
  }

  async reorderCategories(reorderDto: ReorderWebCategoriesDto, userId: string) {
    // Проверяем права на проект
    // TODO: checkProjectAccess method not found
    // await this.projectsService.checkProjectAccess(reorderDto.projectId, userId, 'PROJECT_WRITE');

    // Обновляем порядок в транзакции
    await this.prisma.$transaction(async (tx: any) => {
      for (const item of reorderDto.items) {
        await tx.webCategory.update({
          where: { id: item.id },
          data: {
            orderIndex: item.orderIndex,
            parentId: item.parentId,
          },
        });
      }
    });

    // SSE событие
    this.realtimeService.publish('menu_items_reordered', { items: reorderDto.items }); // TODO: add pages category events
  }

  private async getNextOrderIndex(productId: string, parentId?: string): Promise<number> {
    const lastCategory = await this.prisma.webCategory.findFirst({
      where: {
        productId,
        parentId: parentId || null,
      },
      orderBy: { orderIndex: 'desc' },
    });

    return (lastCategory?.orderIndex || 0) + 1;
  }

  private async updateChildrenLevels(parentId: string, parentLevel: number) {
    const children = await this.prisma.webCategory.findMany({
      where: { parentId },
    });

    for (const child of children) {
      const newLevel = parentLevel + 1;
      await this.prisma.webCategory.update({
        where: { id: child.id },
        data: { level: newLevel },
      });

      // Рекурсивно обновляем потомков
      await this.updateChildrenLevels(child.id, newLevel);
    }
  }
}
