import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma, ProductStatus, ProductType, PageStatus, PageType } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

/**
 * Сервис продуктов
 * Управляет CRUD операциями для продуктов и выборками по проектам
 */
@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Список продуктов с фильтрами и пагинацией
   */
  async findAll(query: { page?: number; limit?: number; type?: string; status?: string; projectId?: string }) {
    const { page = 1, limit = 20, type, status, projectId } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (type) where.type = type as any;
    if (status) where.status = status as any;
    if (projectId) where.projectId = projectId;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /** Получить продукт по ID */
  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        project: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Продукт не найден');
    }
    return product;
  }

  /** Создать продукт глобально (с указанием projectId) */
  async create(data: {
    name: string;
    description?: string;
    type: string | ProductType;
    projectId: string;
    settings?: string;
  }) {
    if (!data.projectId) {
      throw new BadRequestException('projectId обязателен');
    }
    const createData: Prisma.ProductCreateInput = {
      name: data.name,
      description: data.description ?? null,
      type: this.mapProductType(data.type),
      settings: data.settings ?? '{}',
      project: { connect: { id: data.projectId } },
    };
    return this.prisma.product.create({ data: createData });
  }

  /** Обновить продукт */
  async update(
    id: string,
    data: Partial<{
      name: string;
      description?: string;
      type: string | ProductType;
      status: string | ProductStatus;
      settings?: string;
    }>,
  ) {
    const exists = await this.prisma.product.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Продукт не найден');
    }
    const updateData: Prisma.ProductUpdateInput = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.settings !== undefined) updateData.settings = data.settings;
    if (data.type !== undefined) updateData.type = this.mapProductType(data.type);
    if (data.status !== undefined) updateData.status = this.mapProductStatus(data.status);
    return this.prisma.product.update({ where: { id }, data: updateData });
  }

  /** Удалить продукт */
  async remove(id: string) {
    const exists = await this.prisma.product.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Продукт не найден');
    }
    await this.prisma.product.delete({ where: { id } });
    return { message: 'Продукт удален' };
  }

  /** Список продуктов проекта */
  async findByProject(
    projectId: string,
    query: { page?: number; limit?: number; type?: string; status?: string } = {},
  ) {
    return this.findAll({ ...query, projectId });
  }

  /** Создать продукт в проекте */
  async createInProject(
    projectId: string,
    data: { name: string; description?: string; type: string | ProductType; settings?: string },
  ) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException('Проект не найден');
    }

    const createData: Prisma.ProductCreateInput = {
      name: data.name,
      description: data.description ?? null,
      type: this.mapProductType(data.type),
      settings: data.settings ?? '{}',
      project: { connect: { id: projectId } },
    };
    const product = await this.prisma.product.create({ data: createData });

    // Автосоздание типовых страниц для WEBSITE
    if (product.type === ProductType.WEBSITE) {
      try {
        const commonPageData = {
          status: PageStatus.DRAFT as any,
          pageType: PageType.PAGE as any,
          content: '{}',
        } as const;
        const pagesToCreate: Array<{ title: string; slug: string; isHomePage?: boolean }> = [
          { title: 'Главная', slug: 'home', isHomePage: true },
          { title: 'О компании', slug: 'about' },
          { title: 'Продукты', slug: 'products' },
          { title: 'Блог', slug: 'blog' },
          { title: 'Контакты', slug: 'contacts' },
        ];

        await Promise.all(
          pagesToCreate.map((p) => {
            const data: any = {
              title: p.title,
              slug: p.slug,
              content: commonPageData.content,
              status: commonPageData.status as any,
              pageType: commonPageData.pageType as any,
              isHomePage: !!p.isHomePage,
              product: { connect: { id: product.id } },
            };
            return this.prisma.page.create({ data });
          }),
        );
      } catch (e: any) {
        // Не блокируем создание продукта, если страницы не создались
        // eslint-disable-next-line no-console
        console.warn('Автосоздание страниц для WEBSITE не удалось:', e?.message || e);
      }
    }

    return product;
  }

  /** Обновить продукт проекта */
  async updateInProject(
    projectId: string,
    productId: string,
    data: Partial<{
      name: string;
      description?: string;
      type: string | ProductType;
      status: string | ProductStatus;
      settings?: string;
    }>,
  ) {
    const exists = await this.prisma.product.findFirst({ where: { id: productId, projectId } });
    if (!exists) {
      throw new NotFoundException('Продукт не найден в данном проекте');
    }
    const updateData: Prisma.ProductUpdateInput = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.settings !== undefined) updateData.settings = data.settings;
    if (data.type !== undefined) updateData.type = this.mapProductType(data.type);
    if (data.status !== undefined) updateData.status = this.mapProductStatus(data.status);
    return this.prisma.product.update({ where: { id: productId }, data: updateData });
  }

  /** Удалить продукт проекта */
  async removeInProject(projectId: string, productId: string) {
    const exists = await this.prisma.product.findFirst({ where: { id: productId, projectId } });
    if (!exists) {
      throw new NotFoundException('Продукт не найден в данном проекте');
    }
    await this.prisma.product.delete({ where: { id: productId } });
    return { message: 'Продукт удален' };
  }

  private mapProductType(type: string | ProductType): ProductType {
    if (typeof type !== 'string') return type;
    const upper = type.toUpperCase();
    if ((ProductType as any)[upper]) {
      return (ProductType as any)[upper] as ProductType;
    }
    throw new BadRequestException(`Некорректный тип продукта: ${type}`);
  }

  private mapProductStatus(status: string | ProductStatus): ProductStatus {
    if (typeof status !== 'string') return status;
    const upper = status.toUpperCase();
    if ((ProductStatus as any)[upper]) {
      return (ProductStatus as any)[upper] as ProductStatus;
    }
    throw new BadRequestException(`Некорректный статус продукта: ${status}`);
  }
}
