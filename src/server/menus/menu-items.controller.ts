import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Patch,
  Body, 
  Param, 
  Query 
} from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenuResolverService } from './menu-resolver.service';
import { MenuRulesService } from './menu-rules.service';
import { MenuAccessService } from './menu-access.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { ReorderMenuItemsDto } from './dto/reorder-menu-items.dto';
import { Scopes } from '../common/decorators/roles.decorator';
import { AccessLevel } from '@prisma/client';

/**
 * Контроллер пунктов меню
 */
@Controller('api/menu-items')
export class MenuItemsController {
  constructor(
    private readonly menusService: MenusService,
    private readonly menuResolverService: MenuResolverService,
    private readonly menuRulesService: MenuRulesService,
    private readonly menuAccessService: MenuAccessService
  ) {}

  @Get()
  @Scopes('PROJECT_READ')
  async findAll(
    @Query('menuTypeId') menuTypeId?: string,
    @Query('language') language?: string,
    @Query('level') level?: string,
    @Query('parentId') parentId?: string
  ) {
    const levelNum = level ? parseInt(level, 10) : undefined;
    
    const menuItems = await this.menusService.findMenuItems(
      menuTypeId,
      language,
      levelNum,
      parentId
    );
    
    return { success: true, data: menuItems };
  }

  @Get('items-by-filters')
  @Scopes('PROJECT_READ')
  async getItemsByFilters(
    @Query('menuTypeId') menuTypeId: string,
    @Query('properties') properties?: string,
    @Query('values') values?: string,
    @Query('language') language?: string
  ) {
    // Парсим массивы из query параметров
    const propertiesArray = properties ? properties.split(',') : [];
    const valuesArray = values ? values.split(',') : [];

    const menuItems = await this.menusService.getItems(
      menuTypeId,
      propertiesArray,
      valuesArray,
      language
    );

    return { success: true, data: menuItems };
  }

  @Get('active')
  @Scopes('PROJECT_READ')
  async getActive(
    @Query('menuTypeId') menuTypeId: string,
    @Query('path') path: string
  ) {
    if (!menuTypeId || !path) {
      return { 
        success: false, 
        error: 'Параметры menuTypeId и path обязательны' 
      };
    }

    const activeItem = await this.menusService.getActiveMenuItem(menuTypeId, path);
    return { success: true, data: activeItem };
  }

  @Get('authorized')
  @Scopes('PROJECT_READ')
  async getAuthorized(
    @Query('menuTypeId') menuTypeId: string,
    @Query('accessLevels') accessLevels?: string
  ) {
    if (!menuTypeId) {
      return { success: false, error: 'Параметр menuTypeId обязателен' };
    }

    // Парсим уровни доступа
    const levels = accessLevels 
      ? accessLevels.split(',') as AccessLevel[]
      : [AccessLevel.PUBLIC];

    const authorizedItems = await this.menusService.getAuthorizedItems(menuTypeId, levels);
    return { success: true, data: authorizedItems };
  }

  @Get('lookup')
  @Scopes('PROJECT_READ')
  async buildLookup(
    @Query('menuTypeId') menuTypeId: string,
    @Query('language') language: string = '*'
  ) {
    if (!menuTypeId) {
      return { success: false, error: 'Параметр menuTypeId обязателен' };
    }

    const lookup = await this.menusService.buildLookup(menuTypeId, language);
    return { success: true, data: lookup };
  }

  // Получение Itemid для роутинга (SEF URLs)
  @Get('routing/get-itemid')
  @Scopes('PROJECT_READ')
  async getItemidForRoute(
    @Query('projectId') projectId: string,
    @Query('component') component: string,
    @Query('view') view: string,
    @Query('targetId') targetId?: string,
    @Query('itemid') requestedItemid?: string
  ) {
    if (!projectId || !component || !view) {
      return { 
        success: false, 
        error: 'Параметры projectId, component и view обязательны' 
      };
    }

    const itemid = await this.menuRulesService.getItemidForRoute(
      projectId, 
      component, 
      view, 
      targetId, 
      requestedItemid
    );

    return { 
      success: true, 
      data: { 
        itemid,
        found: !!itemid
      } 
    };
  }

  // Парсинг URL и определение контекста
  @Get('routing/parse-url')
  @Scopes('PROJECT_READ')
  async parseUrl(
    @Query('url') url: string,
    @Query('projectId') projectId: string
  ) {
    if (!url || !projectId) {
      return { 
        success: false, 
        error: 'Параметры url и projectId обязательны' 
      };
    }

    try {
      const parsed = await this.menuRulesService.parseUrl(url, projectId);
      return { success: true, data: parsed };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Ошибка парсинга URL' 
      };
    }
  }

  // Генерация sitemap для проекта
  @Get('routing/sitemap')
  @Scopes('PROJECT_READ')
  async generateSitemap(@Query('projectId') projectId: string) {
    if (!projectId) {
      return { 
        success: false, 
        error: 'Параметр projectId обязателен' 
      };
    }

    try {
      const sitemap = await this.menuRulesService.generateSitemap(projectId);
      return { success: true, data: sitemap };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Ошибка генерации sitemap' 
      };
    }
  }

  // Определение активного пункта меню для текущего пути
  @Get('active-by-path')
  @Scopes('PROJECT_READ')
  async getActiveByPath(
    @Query('menuTypeId') menuTypeId: string,
    @Query('path') path: string
  ) {
    if (!menuTypeId || !path) {
      return { success: false, error: 'Параметры menuTypeId и path обязательны' };
    }

    const activeItem = await this.menuResolverService.resolveActiveMenuItem(menuTypeId, path);
    if (!activeItem) {
      return { success: true, data: null };
    }

    const breadcrumbs = await this.menuResolverService.buildBreadcrumbs(activeItem, menuTypeId);
    return {
      success: true,
      data: {
        activeItem,
        breadcrumbs
      }
    };
  }

  @Get(':id')
  @Scopes('PROJECT_READ')
  async findOne(@Param('id') id: string) {
    const menuItem = await this.menusService.findMenuItemById(id);
    return { success: true, data: menuItem };
  }

  @Post()
  @Scopes('PROJECT_WRITE')
  async create(@Body() dto: CreateMenuItemDto) {
    const menuItem = await this.menusService.createMenuItem(dto);
    return { success: true, data: menuItem };
  }

  @Put(':id')
  @Scopes('PROJECT_WRITE')
  async update(@Param('id') id: string, @Body() dto: UpdateMenuItemDto) {
    const menuItem = await this.menusService.updateMenuItem(id, dto);
    return { success: true, data: menuItem };
  }

  @Delete(':id')
  @Scopes('PROJECT_WRITE')
  async remove(@Param('id') id: string) {
    await this.menusService.removeMenuItem(id);
    return { success: true, message: 'Пункт меню успешно удален' };
  }

  @Patch('reorder')
  @Scopes('PROJECT_WRITE')
  async reorder(@Body() dto: ReorderMenuItemsDto) {
    await this.menusService.reorderMenuItems(dto);
    return { success: true, message: 'Порядок пунктов меню обновлен' };
  }

  // Разрешение пункта меню в данные компонента (универсальная привязка)
  @Get(':id/resolve')
  @Scopes('PROJECT_READ')
  async resolveMenuItem(@Param('id') id: string) {
    const menuItem = await this.menusService.findMenuItemById(id);
    if (!menuItem) {
      return { success: false, error: 'Пункт меню не найден' };
    }

    const resolved = await this.menuResolverService.resolveMenuItem(menuItem);
    return { success: true, data: resolved };
  }

  

  // Проверка доступа к пункту меню
  @Get('security/check-access/:id')
  @Scopes('PROJECT_READ')
  async checkAccess(
    @Param('id') id: string,
    @Query('accessLevels') accessLevels?: string,
    @Query('userId') userId?: string
  ) {
    const userAccessLevels: AccessLevel[] = accessLevels 
      ? accessLevels.split(',').filter(level => 
          ['PUBLIC', 'REGISTERED', 'SPECIAL', 'CUSTOM'].includes(level)
        ) as AccessLevel[]
      : [AccessLevel.PUBLIC];

    const hasAccess = await this.menuAccessService.checkMenuItemAccess(
      id, 
      userAccessLevels, 
      userId
    );

    return { 
      success: true, 
      data: { 
        hasAccess,
        menuItemId: id,
        checkedLevels: userAccessLevels
      } 
    };
  }

  // Статистика прав доступа
  @Get('security/access-stats')
  @Scopes('PROJECT_READ')
  async getAccessStats(@Query('projectId') projectId: string) {
    if (!projectId) {
      return { 
        success: false, 
        error: 'Параметр projectId обязателен' 
      };
    }

    const stats = await this.menuAccessService.getAccessStatistics(projectId);
    return { success: true, data: stats };
  }

  // Построение SEF URL
  @Get(':id/sef-url')
  @Scopes('PROJECT_READ')
  async buildSefUrl(
    @Param('id') id: string,
    @Query() additionalParams: Record<string, any>
  ) {
    try {
      const url = await this.menuRulesService.buildSefUrl(id, additionalParams);
      return { success: true, data: { url } };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Ошибка построения URL' 
      };
    }
  }
}
