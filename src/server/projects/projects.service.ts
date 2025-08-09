import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma, ProjectStatus, ProductType, PageStatus, PageType } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectQueryDto } from './dto/project-query.dto';

/**
 * Сервис проектов
 * 
 * Мигрированная логика из Express /api/projects
 */
@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Получение всех проектов с пагинацией и фильтрами
   */
  async findAll(query: ProjectQueryDto) {
    const { page = 1, limit = 20, status, ownerId } = query;
    const skip = (page - 1) * limit;

    // Строим условия поиска
    const where: Prisma.ProjectWhereInput = {};
    if (status) where.status = this.mapProjectStatus(status);
    if (ownerId) where.ownerId = ownerId;

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          description: true,
          slug: true,
          domain: true,
          customDomain: true,
          isPublished: true,
          settings: true,
          theme: true,
          ownerId: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          products: {
            select: { id: true, type: true, status: true },
          },
          _count: { select: { products: true } },
        },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Получение проекта по ID
   */
  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        slug: true,
        domain: true,
        customDomain: true,
        isPublished: true,
        settings: true,
        theme: true,
        ownerId: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        products: { select: { id: true, type: true, status: true } },
        _count: { select: { products: true } },
      },
    });

    if (!project) {
      throw new NotFoundException('Проект не найден');
    }

    return project;
  }

  /**
   * Создание нового проекта
   */
  async create(createProjectDto: CreateProjectDto, ownerId: string) {
    const { name, description, settings = {} as any } = createProjectDto;
    const effectiveOwnerId = await this.resolveOwnerId(ownerId);

    // Проверяем уникальность имени проекта для пользователя
    const existingProject = await this.prisma.project.findFirst({
      where: { name, ownerId: effectiveOwnerId },
    });

    if (existingProject) {
      throw new BadRequestException('Проект с таким названием уже существует');
    }

    // Подбираем уникальный slug
    const baseSlug = this.generateSlug(name);
    const slug = await this.generateUniqueSlug(baseSlug);
    let project;
    try {
      project = await this.prisma.project.create({
        data: {
          name,
          description: description ?? null,
          settings: JSON.stringify(settings),
          ownerId: effectiveOwnerId,
          status: ProjectStatus.ACTIVE,
          slug,
        },
      });
      // Автоматическая инициализация предустановленных продуктов проекта
      // 1) Страницы (WEBSITE)
      const website = await this.prisma.product.create({
        data: {
          name: 'Сайт',
          description: 'Управление страницами проекта',
          type: ProductType.WEBSITE,
          settings: '{}',
          project: { connect: { id: project.id } },
        },
      });
      // Автосоздание типовых страниц для WEBSITE
      const commonPageData = { status: PageStatus.DRAFT as any, pageType: PageType.PAGE as any, content: '{}' } as const;
      const pagesToCreate: Array<{ title: string; slug: string; isHomePage?: boolean }> = [
        { title: 'Главная', slug: 'home', isHomePage: true },
        { title: 'О компании', slug: 'about' },
        { title: 'Продукты', slug: 'products' },
        { title: 'Блог', slug: 'blog' },
        { title: 'Контакты', slug: 'contacts' },
      ];
      await Promise.all(
        pagesToCreate.map((p) =>
          this.prisma.page.create({
            data: {
              title: p.title,
              slug: p.slug,
              content: commonPageData.content,
              status: commonPageData.status as any,
              pageType: commonPageData.pageType as any,
              isHomePage: !!p.isHomePage,
              product: { connect: { id: website.id } },
            },
          })
        )
      );

      // 2) Блог (BLOG)
      await this.prisma.product.create({
        data: {
          name: 'Блог',
          description: 'Публикации и новости',
          type: ProductType.BLOG,
          settings: '{}',
          project: { connect: { id: project.id } },
        },
      });

      // 3) Магазин (STORE)
      await this.prisma.product.create({
        data: {
          name: 'Магазин',
          description: 'Товары и заказы',
          type: ProductType.STORE,
          settings: '{}',
          project: { connect: { id: project.id } },
        },
      });
    } catch (e) {
      console.error('Project create error', { effectiveOwnerId, slug, name }, e);
      throw e;
    }

    return project;
  }

  /**
   * Обновление проекта
   */
  async update(id: string, updateProjectDto: UpdateProjectDto, ownerId: string) {
    const effectiveOwnerId = await this.resolveOwnerId(ownerId);
    // Проверяем существование и права доступа
    const existingProject = await this.prisma.project.findFirst({ where: { id, ownerId: effectiveOwnerId } });

    if (!existingProject) {
      throw new NotFoundException('Проект не найден или у вас нет прав доступа');
    }

    // Проверяем уникальность имени если оно изменяется
    if (updateProjectDto.name && updateProjectDto.name !== existingProject.name) {
      const duplicateProject = await this.prisma.project.findFirst({ where: { name: updateProjectDto.name, ownerId: effectiveOwnerId, id: { not: id } } });

      if (duplicateProject) {
        throw new BadRequestException('Проект с таким названием уже существует');
      }
    }

    const updateData: Prisma.ProjectUpdateInput = {};
    if (updateProjectDto.name !== undefined) updateData.name = updateProjectDto.name;
    if (updateProjectDto.description !== undefined) updateData.description = updateProjectDto.description;
    if (updateProjectDto.settings !== undefined) updateData.settings = JSON.stringify(updateProjectDto.settings);
    if (updateProjectDto.status !== undefined) updateData.status = this.mapProjectStatus(updateProjectDto.status);
    const updatedProject = await this.prisma.project.update({ where: { id }, data: updateData });

    // Если прилетел settings.orderIndex массив — предполагаем, что это массовое сохранение порядка
    // (на будущее; UI сейчас сохраняет поштучно через update).

    return updatedProject;
  }

  /**
   * Удаление проекта
   */
  async remove(id: string, ownerId: string) {
    // В условиях отсутствующей авторизации (гварды отключены) разрешаем удаление по ID.
    // Если авторизация будет включена — можно вернуть проверку ownerId.
    const existingProject = await this.prisma.project.findUnique({ where: { id } });
    if (!existingProject) {
      throw new NotFoundException('Проект не найден');
    }

    await this.prisma.project.delete({ where: { id } });
    return { message: 'Проект успешно удален' };
  }

  /**
   * Публикация проекта
   */
  async publish(id: string, ownerId: string) {
    const effectiveOwnerId = await this.resolveOwnerId(ownerId);
    const project = await this.prisma.project.findFirst({ where: { id, ownerId: effectiveOwnerId } });

    if (!project) {
      throw new NotFoundException('Проект не найден или у вас нет прав доступа');
    }

    const publishedProject = await this.prisma.project.update({ where: { id }, data: { isPublished: true } });

    return publishedProject;
  }

  /**
   * Дублирование проекта
   */
  async duplicate(id: string, ownerId: string) {
    const effectiveOwnerId = await this.resolveOwnerId(ownerId);
    const originalProject = await this.prisma.project.findFirst({ where: { id, ownerId: effectiveOwnerId } });

    if (!originalProject) {
      throw new NotFoundException('Проект не найден или у вас нет прав доступа');
    }

    const duplicatedProject = await this.prisma.project.create({
      data: {
        name: `${originalProject.name} (копия)`,
        description: originalProject.description,
        settings: originalProject.settings,
        ownerId: effectiveOwnerId,
        status: ProjectStatus.ACTIVE,
        slug: this.generateSlug(`${originalProject.name}-copy-${Date.now()}`),
      },
    });

    // Дублируем страницы если они есть
    // Примечание: копирование страниц зависит от актуальной модели Page (связь через продукт).
    // Пока опущено, т.к. схема страниц отличается.

    return duplicatedProject;
  }

  private mapProjectStatus(status: string): ProjectStatus {
    const upper = status.toUpperCase();
    if ((ProjectStatus as any)[upper]) return (ProjectStatus as any)[upper] as ProjectStatus;
    throw new BadRequestException(`Некорректный статус проекта: ${status}`);
  }

  /**
   * Разрешает фактический ownerId. Если передан несуществующий или пустой —
   * создаёт/переиспользует dev-пользователя и возвращает его id.
   */
  private async resolveOwnerId(ownerId?: string): Promise<string> {
    if (ownerId) {
      const existing = await this.prisma.user.findUnique({ where: { id: ownerId } });
      if (existing) return existing.id;
    }
    // Dev user fallback
    const devEmail = 'dev@situs.local';
    const devUsername = 'dev';
    try {
      const dev = await this.prisma.user.upsert({
        where: { email: devEmail },
        update: {},
        create: {
          username: devUsername,
          email: devEmail,
          password: 'dev',
        },
      });
      return dev.id;
    } catch (e) {
      // На случай несовпадения схем пользователей в разных ветках —
      // подставим фиктивный ownerId, чтобы не блокировать UI. Продукты/страницы не создаём до правки auth.
      return 'owner-dev';
    }
  }

  private generateSlug(name: string): string {
    const map: Record<string, string> = {
      а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'i', к: 'k', л: 'l', м: 'm',
      н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '',
      ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
    };
    const transliterated = name
      .toLowerCase()
      .split('')
      .map((ch) => (map[ch] !== undefined ? map[ch] : ch))
      .join('');

    const slug = transliterated
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    return slug || `project-${Date.now()}`;
  }

  private async generateUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;
    // Проверяем наличие проекта с таким slug и увеличиваем суффикс
    // Ограничим количество попыток разумно
    while (true) {
      const exists = await this.prisma.project.findUnique({ where: { slug } });
      if (!exists) return slug;
      counter += 1;
      slug = `${baseSlug}-${counter}`;
      if (counter > 100) {
        // аварийный случай
        return `${baseSlug}-${Date.now()}`;
      }
    }
  }
}
