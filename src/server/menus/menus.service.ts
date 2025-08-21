import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { RealtimeEventsService } from '../realtime/realtime-events.service';
import { MenuItemType, AccessLevel, MenuItem, MenuType } from '@prisma/client';
import { CreateMenuTypeDto } from './dto/create-menu-type.dto';
import { UpdateMenuTypeDto } from './dto/update-menu-type.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { ReorderMenuItemsDto } from './dto/reorder-menu-items.dto';

/**
 * Lookup таблица для роутинга (аналог Joomla)
 */
export interface MenuLookup {
  [viewLayout: string]: {
    [targetId: number]: string; // MenuItem.id
  };
}

/**
 * Сервис для работы с меню (аналог Joomla Menu API)
 */
@Injectable()
export class MenusService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtimeEvents: RealtimeEventsService
  ) {}

  // ========== MenuType CRUD ==========

  async createMenuType(dto: CreateMenuTypeDto): Promise<MenuType> {
    // Проверяем уникальность name в рамках проекта
    const existing = await this.prisma.menuType.findFirst({
      where: { projectId: dto.projectId, name: dto.name }
    });

    if (existing) {
      throw new BadRequestException(`Тип меню с названием "${dto.name}" уже существует в проекте`);
    }

    const menuType = await this.prisma.menuType.create({
      data: dto
    });

    // Публикуем SSE событие
    this.realtimeEvents.publishMenuTypeCreated(dto.projectId, menuType);

    return menuType;
  }

  async findMenuTypes(projectIdOrSlug: string): Promise<MenuType[]> {
    let projectId = projectIdOrSlug;
    // Если пришёл slug — резолвим в id
    if (!projectIdOrSlug.startsWith('c')) {
      const project = await this.prisma.project.findUnique({ where: { slug: projectIdOrSlug }, select: { id: true } });
      if (project) projectId = project.id;
    }
    return this.prisma.menuType.findMany({
      where: { projectId },
      include: {
        _count: { select: { items: true } }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  async findMenuTypeById(id: string): Promise<MenuType> {
    const menuType = await this.prisma.menuType.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: [
            { level: 'asc' },
            { orderIndex: 'asc' },
            { title: 'asc' }
          ]
        }
      }
    });

    if (!menuType) {
      throw new NotFoundException(`Тип меню с ID ${id} не найден`);
    }

    return menuType;
  }

  async updateMenuType(id: string, dto: UpdateMenuTypeDto): Promise<MenuType> {
    // Проверяем существование
    await this.findMenuTypeById(id);

    // Проверяем уникальность name если он изменяется
    if (dto.name) {
      const existing = await this.prisma.menuType.findFirst({
        where: { 
          name: dto.name,
          projectId: dto.projectId || undefined,
          NOT: { id }
        }
      });

      if (existing) {
        throw new BadRequestException(`Тип меню с названием "${dto.name}" уже существует`);
      }
    }

    const menuType = await this.prisma.menuType.update({
      where: { id },
      data: dto
    });

    // Публикуем SSE событие
    this.realtimeEvents.publishMenuTypeUpdated(menuType.projectId, menuType);

    return menuType;
  }

  async removeMenuType(id: string): Promise<void> {
    // Проверяем существование и получаем данные для SSE
    const menuType = await this.findMenuTypeById(id);

    // Удаляем (каскадно удалятся все пункты меню)
    await this.prisma.menuType.delete({
      where: { id }
    });

    // Публикуем SSE событие
    this.realtimeEvents.publishMenuTypeDeleted(menuType.projectId, id);
  }

  // ========== MenuItem CRUD ==========

  /**
   * Получение пунктов меню с мультипараметровой фильтрацией (аналог Joomla $sitemenu->getItems())
   */
  async getItems(
    menuTypeId: string,
    properties: string[] = [],
    values: any[] = [],
    language?: string
  ): Promise<MenuItem[]> {
    const where: any = { menuTypeId, isPublished: true };

    // Фильтрация по language (как в Joomla)
    if (language && language !== '*') {
      where.OR = [
        { language: '*' },
        { language }
      ];
    }

    // Мультипараметровая фильтрация (как в Joomla)
    if (properties.length === values.length && properties.length > 0) {
      properties.forEach((prop, index) => {
        const value = values[index];
        if (Array.isArray(value)) {
          where[prop] = { in: value };
        } else {
          where[prop] = value;
        }
      });
    }

    return this.prisma.menuItem.findMany({
      where,
      include: {
        children: {
          where: { isPublished: true },
          orderBy: [{ orderIndex: 'asc' }, { title: 'asc' }]
        },
        parent: true
      },
      orderBy: [
        { level: 'asc' },
        { orderIndex: 'asc' },
        { title: 'asc' }
      ]
    });
  }

  /**
   * Получение активного пункта меню (аналог Joomla $menu->getActive())
   */
  async getActiveMenuItem(
    menuTypeId: string,
    currentPath: string
  ): Promise<MenuItem | null> {
    // Попробуем найти точное совпадение по пути
    const exactMatch = await this.prisma.menuItem.findFirst({
      where: {
        menuTypeId,
        isPublished: true,
        OR: [
          { externalUrl: currentPath },
          // Логика сопоставления с component + view + targetId
        ]
      }
    });

    if (exactMatch) return exactMatch;

    // Fallback: поиск по компоненту и view
    // Здесь можно добавить более сложную логику определения активного пункта
    return null;
  }

  /**
   * Получение пунктов меню с проверкой прав доступа
   */
  async getAuthorizedItems(
    menuTypeId: string,
    userAccessLevels: AccessLevel[]
  ): Promise<MenuItem[]> {
    return this.prisma.menuItem.findMany({
      where: {
        menuTypeId,
        isPublished: true,
        accessLevel: { in: userAccessLevels }
      },
      include: {
        children: {
          where: { 
            isPublished: true,
            accessLevel: { in: userAccessLevels }
          }
        }
      },
      orderBy: [
        { level: 'asc' },
        { orderIndex: 'asc' }
      ]
    });
  }

  /**
   * Построение lookup таблицы для роутинга (аналог Joomla)
   */
  async buildLookup(menuTypeId: string, language: string): Promise<MenuLookup> {
    // Берем только опубликованные пункты
    const items = await this.getItems(menuTypeId, ['language'], [language]);
    const lookup: MenuLookup = {};

    items.forEach(item => {
      if (item.component && item.view) {
        // Ключ в формате Component:View[:Layout], как ожидает e2e
        const keyBase = `${item.component}:${item.view}`;
        const key = item.layout ? `${keyBase}:${item.layout}` : keyBase;
        // Безопасный индекс по targetId
        let targetIndex = 0;
        if (item.targetId) {
          const parsed = parseInt(item.targetId, 10);
          targetIndex = Number.isNaN(parsed) ? item.targetId.length * 37 : parsed;
        }

        if (!lookup[key]) lookup[key] = {};
        lookup[key][targetIndex] = item.id;
      }
    });

    return lookup;
  }

  async createMenuItem(dto: CreateMenuItemDto): Promise<MenuItem> {
    // Проверяем уникальность alias в рамках типа меню
    const existing = await this.prisma.menuItem.findFirst({
      where: { menuTypeId: dto.menuTypeId, alias: dto.alias }
    });

    if (existing) {
      throw new BadRequestException(`Пункт меню с alias "${dto.alias}" уже существует в данном типе меню`);
    }

    // Проверяем существование родительского пункта
    if (dto.parentId) {
      const parent = await this.prisma.menuItem.findUnique({
        where: { id: dto.parentId }
      });

      if (!parent) {
        throw new NotFoundException(`Родительский пункт меню с ID ${dto.parentId} не найден`);
      }

      // Устанавливаем level на основе родителя
      dto.level = parent.level + 1;
    }

    const menuItem = await this.prisma.menuItem.create({
      data: dto,
      include: {
        children: true,
        parent: true,
        menuType: true
      }
    });

    // Публикуем SSE событие
    this.realtimeEvents.publishMenuItemCreated(menuItem.menuType.projectId, menuItem);

    return menuItem;
  }

  async findMenuItems(
    menuTypeId?: string,
    language?: string,
    level?: number,
    parentId?: string
  ): Promise<MenuItem[]> {
    const where: any = {};

    if (menuTypeId) where.menuTypeId = menuTypeId;
    if (level) where.level = level;
    if (parentId) where.parentId = parentId;

    // Фильтрация по языку
    if (language && language !== '*') {
      where.OR = [
        { language: '*' },
        { language }
      ];
    }

    return this.prisma.menuItem.findMany({
      where,
      include: {
        children: true,
        parent: true,
        menuType: true
      },
      orderBy: [
        { level: 'asc' },
        { orderIndex: 'asc' },
        { title: 'asc' }
      ]
    });
  }

  async findMenuItemById(id: string): Promise<MenuItem> {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id },
      include: {
        children: true,
        parent: true,
        menuType: true
      }
    });

    if (!menuItem) {
      throw new NotFoundException(`Пункт меню с ID ${id} не найден`);
    }

    return menuItem;
  }

  async updateMenuItem(id: string, dto: UpdateMenuItemDto): Promise<MenuItem> {
    // Проверяем существование
    await this.findMenuItemById(id);

    // Проверяем уникальность alias если он изменяется
    if (dto.alias && dto.menuTypeId) {
      const existing = await this.prisma.menuItem.findFirst({
        where: { 
          menuTypeId: dto.menuTypeId,
          alias: dto.alias,
          NOT: { id }
        }
      });

      if (existing) {
        throw new BadRequestException(`Пункт меню с alias "${dto.alias}" уже существует`);
      }
    }

    const menuItem = await this.prisma.menuItem.update({
      where: { id },
      data: dto,
      include: {
        children: true,
        parent: true,
        menuType: true
      }
    });

    // Публикуем SSE событие
    this.realtimeEvents.publishMenuItemUpdated(menuItem.menuType.projectId, menuItem);

    return menuItem;
  }

  async removeMenuItem(id: string): Promise<void> {
    // Проверяем существование и получаем с дочерними элементами
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id },
      include: { 
        children: true,
        menuType: true // Добавляем для SSE события
      }
    });

    if (!menuItem) {
      throw new NotFoundException(`Пункт меню с ID ${id} не найден`);
    }

    // Проверяем, есть ли дочерние элементы
    if (menuItem.children && menuItem.children.length > 0) {
      throw new BadRequestException('Нельзя удалить пункт меню, у которого есть дочерние элементы');
    }

    // Получаем projectId для SSE события
    const projectId = menuItem.menuType?.projectId;
    const menuTypeId = menuItem.menuTypeId;

    await this.prisma.menuItem.delete({
      where: { id }
    });

    // Публикуем SSE событие
    if (projectId) {
      this.realtimeEvents.publishMenuItemDeleted(projectId, id, menuTypeId);
    }
  }

  /**
   * Изменение порядка пунктов меню (Drag & Drop)
   */
  async reorderMenuItems(dto: ReorderMenuItemsDto): Promise<void> {
    // Получаем первый пункт для определения projectId и menuTypeId
    const firstItem = await this.prisma.menuItem.findUnique({
      where: { id: dto.items[0]?.id },
      include: { menuType: true }
    });

    if (!firstItem) {
      throw new NotFoundException('Пункт меню не найден');
    }

    // Обновляем все пункты в рамках одной транзакции
    await this.prisma.$transaction(
      dto.items.map(item => 
        this.prisma.menuItem.update({
          where: { id: item.id },
          data: {
            orderIndex: item.orderIndex,
            level: item.level,
            parentId: item.parentId
          }
        })
      )
    );

    // Публикуем SSE событие о изменении порядка
    this.realtimeEvents.publishMenuItemsReordered(
      firstItem.menuType.projectId, 
      firstItem.menuTypeId, 
      dto.items
    );

    // Также публикуем событие об изменении структуры
    this.realtimeEvents.publishMenuStructureChanged(
      firstItem.menuType.projectId, 
      firstItem.menuTypeId
    );
  }
}
