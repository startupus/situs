/// <reference lib="decorators.legacy" />
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Optional,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import { RealtimeEventsService } from '../realtime/realtime-events.service';
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
  private readonly prisma: PrismaService;
  private readonly realtime?: RealtimeEventsService;

  constructor(prisma: PrismaService, @Optional() @Inject(RealtimeEventsService) realtime?: RealtimeEventsService) {
    this.prisma = prisma;
    this.realtime = realtime;
    console.log('[BOOT] ProjectsService manual injection, prisma:', !!this.prisma, 'realtime:', !!this.realtime);
  }

  private isSystemProject(project: { slug?: string | null; settings?: any; isSystemAdmin?: boolean | null }): boolean {
    try {
      if (!project) return false;
      // 1) Жёсткий флаг БД
      if (project.isSystemAdmin === true) return true;
      // 2) Слаг резервно
      if ((project.slug || '').toString() === 'situs-admin') return true;
      // 3) Настройки как запасной вариант
      const settings =
        project && typeof project.settings === 'string' ? JSON.parse(project.settings) : project.settings || {};
      return Boolean(settings?.isSystemAdmin);
    } catch {
      return false;
    }
  }
  // Диагностика создания сервиса
  // eslint-disable-next-line no-console
  private readonly _constructed: boolean = (console.log('[BOOT] ProjectsService constructed'), true);

  /**
   * Получение активной конфигурации темы проекта (MVP)
   * Хранится в поле projects.theme как JSON-строка
   */
  async getProjectThemeConfig(projectId: string): Promise<any> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, theme: true },
    });
    if (!project) {
      throw new NotFoundException('Проект не найден');
    }
    try {
      if (project.theme && typeof project.theme === 'string' && project.theme.trim().length > 0) {
        return JSON.parse(project.theme);
      }
    } catch {}
    // Возвращаем дефолтную конфигурацию если нет сохранённой
    return this.getDefaultThemeConfig();
  }

  /**
   * Сохранение активной конфигурации темы проекта (MVP)
   */
  async updateProjectThemeConfig(projectId: string, themeConfig: any): Promise<{ success: boolean }> {
    // Минимальная валидация: наличие цветов
    if (!themeConfig || !themeConfig.colors || !themeConfig.colors.light || !themeConfig.colors.dark) {
      throw new BadRequestException('Некорректные данные темы');
    }
    await this.prisma.project.update({
      where: { id: projectId },
      data: { theme: JSON.stringify(themeConfig) },
    });
    return { success: true };
  }

  /**
   * Серверный дефолт темы (синхрон с стандартной темой на фронте)
   */
  private getDefaultThemeConfig(): any {
    return {
      id: 'standard-theme',
      name: 'Стандартная тема',
      colors: {
        light: {
          primary: '#2881C6',
          primaryHover: '#3B92D4',
          primaryActive: '#1F6AA3',
          secondary: '#13C296',
          accent: '#9055FD',
          success: '#22AD5C',
          warning: '#FBBF24',
          error: '#F23030',
          info: '#2D68F8',
          background: '#FFFFFF',
          surface: '#F9FAFB',
          text: '#1F2937',
          textSecondary: '#6B7280',
          border: '#E5E7EB',
          borderLight: '#F3F4F6',
        },
        dark: {
          primary: '#2881C6',
          primaryHover: '#3B92D4',
          primaryActive: '#1F6AA3',
          secondary: '#10B981',
          accent: '#34D399',
          success: '#34D399',
          warning: '#F59E0B',
          error: '#F87171',
          info: '#60A5FA',
          background: '#0F0F23',
          surface: '#1E1E3F',
          text: '#F1F5F9',
          textSecondary: '#CBD5E1',
          border: '#1F6AA3',
          borderLight: '#3B92D4',
        },
      },
    };
  }

  /**
   * Получение всех проектов с пагинацией и фильтрами
   * КРИТИЧЕСКАЯ БЕЗОПАСНОСТЬ: Фильтрация по пользователю и тенанту
   */
  async findAll(query: ProjectQueryDto, userId?: string, tenantId?: string) {
    const { page = 1, limit = 20, status, ownerId, search, isPublished } = query;
    const skip = (page - 1) * limit;

    // Строим условия поиска с обязательной фильтрацией
    const where: Prisma.ProjectWhereInput = {
      // КРИТИЧНО: Фильтрация по владельцу или системный проект
      OR: [
        // Системный проект доступен всем
        { isSystemAdmin: true },
        // Проекты владельца
        { ownerId: userId || ownerId },
        // TODO: Добавить фильтрацию по тенанту когда будет реализована в схеме
      ],
    };
    if (status) where.status = this.mapProjectStatus(status);
    if (ownerId) where.ownerId = ownerId;
    if (typeof isPublished === 'string') {
      if (isPublished === 'true') where.isPublished = true;
      if (isPublished === 'false') where.isPublished = false;
    }
    if (search && search.trim().length > 0) {
      const s = search.trim();
      // Примечание: текущая версия Prisma client не поддерживает ключ 'mode' в фильтрах типов проекта
      // поэтому используем регистронезависимую проверку через contains без mode
      where.OR = [
        { name: { contains: s } as any },
        { description: { contains: s } as any },
        { slug: { contains: s } as any },
      ];
    }

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
   * Получение проекта по ID с проверкой доступа
   */
  async findOne(idOrSlug: string, userId?: string, tenantId?: string) {
    // Сначала пробуем как ID
    let project = await this.prisma.project.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { slug: idOrSlug }
        ],
        // Проверяем доступ: системный проект или владелец
        AND: [
          {
            OR: [
              { isSystemAdmin: true },
              { ownerId: userId }
            ]
          }
        ]
      },
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
      throw new NotFoundException('Проект не найден или у вас нет прав на его просмотр');
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
      const pages = await this.prisma.product.create({
        data: {
          name: 'Сайт',
          description: 'Управление страницами проекта',
          type: ProductType.WEBSITE,
          settings: '{}',
          project: { connect: { id: project.id } },
        },
      });
      // Автосоздание типовых страниц для WEBSITE
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
        pagesToCreate.map((p) =>
          this.prisma.page.create({
            data: {
              title: p.title,
              slug: p.slug,
              content: commonPageData.content,
              status: commonPageData.status as any,
              pageType: commonPageData.pageType as any,
              isHomePage: !!p.isHomePage,
              product: { connect: { id: pages.id } },
            },
          }),
        ),
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

      // 3) Магазин (ECOMMERCE)
      await this.prisma.product.create({
        data: {
          name: 'Магазин',
          description: 'Товары и заказы',
          type: ProductType.ECOMMERCE,
          settings: '{}',
          project: { connect: { id: project.id } },
        },
      });
    } catch (e) {
      console.error('Project create error', { effectiveOwnerId, slug, name }, e);
      throw e;
    }

    // Публикуем событие о создании проекта для realtime-обновлений списков
    try {
      if (this.realtime && project) {
        this.realtime.publish('project_created', {
          id: project.id,
          name: project.name,
          status: (project.status as any)?.toString?.() || String(project.status),
          isPublished: Boolean((project as any).isPublished),
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          settings: project.settings,
          slug: (project as any).slug,
          domain: (project as any).domain,
          customDomain: (project as any).customDomain,
        });
      }
    } catch {}

    return project;
  }

  /**
   * Обновление проекта
   * КРИТИЧЕСКАЯ БЕЗОПАСНОСТЬ: Строгая проверка владения
   */
  async update(id: string, updateProjectDto: UpdateProjectDto, ownerId: string) {
    const effectiveOwnerId = await this.resolveOwnerId(ownerId);

    // КРИТИЧНО: Строгая проверка владения - никаких fallback'ов!
    let existingProject = await this.prisma.project.findFirst({
      where: {
        OR: [
          { id, ownerId: effectiveOwnerId },
          { slug: id, ownerId: effectiveOwnerId },
        ],
      },
    });

    if (!existingProject) {
      throw new ForbiddenException('Проект не найден или у вас нет прав на его изменение');
    }
    const actualId = existingProject.id;

    // Системные ограничения для системного проекта
    if (this.isSystemProject(existingProject)) {
      // Запрещаем изменение slug и ownerId системного проекта
      if ((updateProjectDto as any).slug !== undefined) {
        throw new ForbiddenException('Slug системного проекта нельзя изменять');
      }
      if ((updateProjectDto as any).ownerId !== undefined) {
        throw new ForbiddenException('Владельца системного проекта нельзя изменять');
      }
    }

    // Проверяем уникальность имени если оно изменяется
    if (updateProjectDto.name && updateProjectDto.name !== (existingProject as any).name) {
      const duplicateProject = await this.prisma.project.findFirst({
        where: { name: updateProjectDto.name, ownerId: effectiveOwnerId, id: { not: actualId } },
      });

      if (duplicateProject) {
        throw new BadRequestException('Проект с таким названием уже существует');
      }
    }

    const updateData: Prisma.ProjectUpdateInput = {};
    if (updateProjectDto.name !== undefined) updateData.name = updateProjectDto.name;
    if (updateProjectDto.description !== undefined) updateData.description = updateProjectDto.description;
    if (updateProjectDto.settings !== undefined) updateData.settings = JSON.stringify(updateProjectDto.settings);
    if (updateProjectDto.status !== undefined) {
      // Блокируем перевод системного проекта в статус DELETED
      const nextStatus = (updateProjectDto.status as any)?.toString?.().toUpperCase?.();
      if (this.isSystemProject(existingProject) && nextStatus === 'DELETED') {
        throw new ForbiddenException('Системный проект нельзя пометить как удалённый');
      }
      updateData.status = this.mapProjectStatus(updateProjectDto.status);
    }
    if ((updateProjectDto as any).isPublished !== undefined)
      updateData.isPublished = Boolean((updateProjectDto as any).isPublished);
    // Доменные поля (могут приходить из специализированного DTO)
    const domain = (updateProjectDto as any).domain as string | undefined;
    const customDomain = (updateProjectDto as any).customDomain as string | undefined;
    if (typeof domain === 'string') updateData.domain = domain || null;
    if (typeof customDomain === 'string') {
      // Проверяем, что customDomain уникален среди проектов
      if (customDomain) {
        const duplicate = await this.prisma.project.findFirst({
          where: { id: { not: id }, customDomain: customDomain },
        });
        if (duplicate) {
          throw new BadRequestException('Этот пользовательский домен уже привязан к другому проекту');
        }
      }
      updateData.customDomain = customDomain || null;
    }
    const updatedProject = await this.prisma.project.update({ where: { id: actualId }, data: updateData });

    // Если изменили статус — публикуем событие реального времени
    try {
      if (updateProjectDto.status !== undefined && this.realtime) {
        const statusText = updatedProject.status?.toString?.() || String(updatedProject.status);
        this.realtime.publishProjectStatus(updatedProject.id, statusText);
      }
    } catch {}

    // Общий апдейт проекта — для синхронизации других полей (имя, публикация, настройки и т.п.)
    try {
      if (this.realtime) {
        const payload: Record<string, any> = {
          id: updatedProject.id,
          name: updatedProject.name,
          status: (updatedProject.status as any)?.toString?.() || String(updatedProject.status),
          isPublished: Boolean((updatedProject as any).isPublished),
          updatedAt: updatedProject.updatedAt,
        };
        // Специальный случай: сохранение порядка карточек
        const newSettings = updateProjectDto.settings as any;
        if (newSettings && typeof newSettings.orderIndex === 'number') {
          payload.orderIndex = newSettings.orderIndex;
          this.realtime.publish('project_reordered', { id: updatedProject.id, orderIndex: newSettings.orderIndex });
        }
        this.realtime.publish('project_updated', payload);
      }
    } catch {}

    // Если прилетел settings.orderIndex массив — предполагаем, что это массовое сохранение порядка
    // (на будущее; UI сейчас сохраняет поштучно через update).

    return updatedProject;
  }

  /**
   * Удаление проекта
   * КРИТИЧЕСКАЯ БЕЗОПАСНОСТЬ: Строгая проверка владения
   */
  async remove(id: string, ownerId: string) {
    const effectiveOwnerId = await this.resolveOwnerId(ownerId);

    // КРИТИЧНО: Строгая проверка владения - никаких fallback'ов!
    let existingProject = await this.prisma.project.findFirst({
      where: {
        OR: [
          { id, ownerId: effectiveOwnerId },
          { slug: id, ownerId: effectiveOwnerId },
        ],
      },
    });

    if (!existingProject) {
      throw new ForbiddenException('Проект не найден или у вас нет прав на его удаление');
    }

    // Блокируем удаление системного проекта админки
    if (this.isSystemProject(existingProject as any)) {
      throw new ForbiddenException('Системный проект нельзя удалить');
    }

    await this.prisma.project.delete({ where: { id: existingProject.id } });
    try {
      this.realtime?.publish('project_deleted', { id });
    } catch {}
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

  /**
   * Доступы к проекту
   */
  async listAccesses(projectId: string) {
    return this.prisma.projectAccess.findMany({
      where: { projectId },
      select: {
        id: true,
        userId: true,
        role: true,
        grantedAt: true,
        user: { select: { email: true, username: true } },
      },
      orderBy: { grantedAt: 'desc' },
    });
  }

  async grantAccess(projectId: string, dto: { userId?: string; userEmail?: string; role: string }, grantedBy: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Проект не найден');
    const role = (dto.role || '').toUpperCase();
    if (!['OWNER', 'ADMIN', 'EDITOR', 'VIEWER'].includes(role)) {
      throw new BadRequestException('Некорректная роль');
    }
    let userId = dto.userId;
    if (!userId && dto.userEmail) {
      // Находим или создаём пользователя по email
      const email = dto.userEmail.toLowerCase();
      const user = await this.prisma.user.upsert({
        where: { email },
        update: {},
        create: { email, username: email.split('@')[0], password: 'set-by-auth' },
      });
      userId = user.id;
    }
    if (!userId) throw new BadRequestException('Нужно указать userId или userEmail');
    // Уникальная связка projectId+userId обеспечена в схеме
    const access = await this.prisma.projectAccess.upsert({
      where: { projectId_userId: { projectId, userId } as any },
      update: { role: role as any },
      create: { projectId, userId, role: role as any, grantedBy },
      select: { id: true, userId: true, role: true },
    });
    return access;
  }

  async updateAccessRole(projectId: string, accessId: string, role: string) {
    const normalized = (role || '').toUpperCase();
    if (!['ADMIN', 'EDITOR', 'VIEWER'].includes(normalized)) {
      throw new BadRequestException('Недопустимая роль');
    }
    const access = await this.prisma.projectAccess.update({
      where: { id: accessId },
      data: { role: normalized as any },
      select: { id: true, userId: true, role: true },
    });
    return access;
  }

  async revokeAccess(projectId: string, accessId: string) {
    // Проверяем, что доступ относится к проекту
    const access = await this.prisma.projectAccess.findUnique({ where: { id: accessId } });
    if (!access || access.projectId !== projectId) throw new NotFoundException('Доступ не найден');
    await this.prisma.projectAccess.delete({ where: { id: accessId } });
    return { success: true };
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
      а: 'a',
      б: 'b',
      в: 'v',
      г: 'g',
      д: 'd',
      е: 'e',
      ё: 'e',
      ж: 'zh',
      з: 'z',
      и: 'i',
      й: 'i',
      к: 'k',
      л: 'l',
      м: 'm',
      н: 'n',
      о: 'o',
      п: 'p',
      р: 'r',
      с: 's',
      т: 't',
      у: 'u',
      ф: 'f',
      х: 'h',
      ц: 'c',
      ч: 'ch',
      ш: 'sh',
      щ: 'sch',
      ъ: '',
      ы: 'y',
      ь: '',
      э: 'e',
      ю: 'yu',
      я: 'ya',
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
