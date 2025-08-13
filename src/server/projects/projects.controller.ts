/// <reference lib="decorators.legacy" />
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  Res,
  Req,
} from '@nestjs/common';
import { Observable, Subscription } from 'rxjs';
// import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { Optional, Inject } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateProjectDomainDto } from './dto/update-project-domain.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';
import { RealtimeEventsService } from '../realtime/realtime-events.service';
import { GrantProjectAccessDto } from './dto/grant-project-access.dto';
import { UpdateProjectAccessDto } from './dto/update-project-access.dto';
// import { SimpleJwtGuard } from '../auth/guards/simple-jwt.guard'; // Временно отключено

/**
 * Контроллер проектов
 * 
 * Мигрированная логика из Express /api/projects
 */
// @ApiTags('projects')
console.log('[BOOT] Loading ProjectsController file');
@Controller('api/projects')
// @UseGuards(SimpleJwtGuard) // Временно отключено
// @ApiBearerAuth()
export class ProjectsController {
  private readonly projectsService: ProjectsService;
  private readonly realtime?: RealtimeEventsService;

  constructor(
    projectsService: ProjectsService, 
    @Optional() @Inject(RealtimeEventsService) realtime?: RealtimeEventsService
  ) {
    this.projectsService = projectsService;
    this.realtime = realtime;
    console.log('[BOOT] ProjectsController manual injection, projectsService:', !!this.projectsService, 'realtime:', !!this.realtime);
  }

  /**
   * Получение всех проектов с пагинацией и фильтрами
   */
  @Get()
  // @ApiOperation({ summary: 'Получение списка проектов' })
  // @ApiResponse({ status: 200, description: 'Список проектов с пагинацией' })
  async findAll(@Query() query: ProjectQueryDto, @Request() req: any) {
    try {
      console.log('[DEBUG] Controller findAll called, projectsService:', !!this.projectsService, typeof this.projectsService);
      // Для обычных пользователей показываем только их проекты
      if (!query.ownerId && req.user?.id) {
        query.ownerId = req.user.id;
      }
      
      const result = await this.projectsService.findAll(query);
      
      // Адаптируем данные для совместимости с фронтом: name -> title
      const adaptedProjects = result.projects.map((project: any) => ({
        ...project,
        title: project.name, // Добавляем title для совместимости с новым интерфейсом
      }));
      
      return {
        success: true,
        data: {
          projects: adaptedProjects,
          total: result.pagination.total,
          page: result.pagination.page,
          limit: result.pagination.limit,
          totalPages: result.pagination.totalPages,
        },
        meta: result.pagination,
      };
    } catch (error: any) {
      console.error('Projects findAll error:', error?.message || error);
      return {
        success: false,
        error: error?.message || String(error || 'unknown'),
        data: {
          projects: [],
          pagination: { page: 1, limit: 20, total: 0, totalPages: 0 }
        }
      };
    }
  }

  /**
   * Получение проекта по ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return { success: true, data: await this.projectsService.findOne(id) };
  }

  /**
   * Создание нового проекта
   */
  @Post()
  async create(@Body() createProjectDto: CreateProjectDto, @Request() req: any) {
    return { success: true, data: await this.projectsService.create(createProjectDto, req.user?.id ?? 'owner-dev') };
  }

  /**
   * Обновление проекта
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @Request() req: any) {
    return { success: true, data: await this.projectsService.update(id, updateProjectDto, req.user?.id ?? 'owner-dev') };
  }

  @Put(':id')
  async updatePut(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @Request() req: any) {
    return { success: true, data: await this.projectsService.update(id, updateProjectDto, req.user?.id ?? 'owner-dev') };
  }

  /**
   * Обновление доменов проекта (сервисный роут)
   * - При указании customDomain — включаем 301 редирект с базового домена
   */
  @Patch(':id/domains')
  async updateDomains(@Param('id') id: string, @Body() dto: UpdateProjectDomainDto, @Request() req: any) {
    const result = await this.projectsService.update(id, dto as any, req.user?.id ?? 'owner-dev');
    return { success: true, data: { ...result, title: result.name } };
  }

  /**
   * Смена статуса проекта (активен/неактивен и пр.)
   */
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateProjectStatusDto, @Request() req: any) {
    // 1) Нормализуем статус и синхронизируем булевый флаг публикации
    //    Статусы на вход могут быть в любом регистре: ACTIVE / active / published и т.д.
    const normalizedStatus = (dto.status || '').toString().toUpperCase();
    const isPublished = normalizedStatus === 'ACTIVE' || normalizedStatus === 'PUBLISHED';

    // 2) Обновляем проект через доменный сервис, передаём и enum-статус, и производный флаг публикации
    const result = await this.projectsService.update(
      id,
      { status: normalizedStatus as any, isPublished } as any,
      req.user?.id ?? 'owner-dev',
    );

    // 3) Совместимость с фронтом: добавляем поле title
    const adaptedResult = { ...result, title: result.name };

    // 4) Публикацию события оставляем на уровне сервиса (ProjectsService.update),
    //    чтобы избежать дублирования project_status
    return { success: true, data: adaptedResult };
  }

  /**
   * Удаление проекта
   */
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    return { success: true, data: await this.projectsService.remove(id, req.user?.id ?? 'owner-dev') };
  }

  /**
   * Публикация проекта
   */
  // Совместимость с фронтом: PUT /projects/:id/publish и /projects/:id/unpublish
  @Put(':id/publish')
  async publishPut(@Param('id') id: string, @Request() req: any) {
    const result = await this.projectsService.publish(id, req.user?.id ?? 'owner-dev');
    return { success: true, data: { ...result, title: result.name } };
  }
  @Put(':id/unpublish')
  async unpublishPut(@Param('id') id: string, @Request() req: any) {
    const result = await this.projectsService.update(id, { isPublished: false } as any, req.user?.id ?? 'owner-dev');
    return { success: true, data: { ...result, title: result.name } };
  }

  /**
   * Дублирование проекта
   */
  @Post(':id/duplicate')
  async duplicate(@Param('id') id: string, @Request() req: any) {
    return { success: true, data: await this.projectsService.duplicate(id, req.user?.id ?? 'owner-dev') };
  }

  /**
   * Доступы к проекту
   */
  @Get(':id/accesses')
  async listAccesses(@Param('id') id: string) {
    return { success: true, data: await this.projectsService.listAccesses(id) };
  }

  @Post(':id/accesses')
  async grantAccess(@Param('id') id: string, @Body() dto: GrantProjectAccessDto, @Request() req: any) {
    return { success: true, data: await this.projectsService.grantAccess(id, dto, req.user?.id ?? 'owner-dev') };
  }

  @Patch(':id/accesses/:accessId')
  async updateAccess(@Param('id') id: string, @Param('accessId') accessId: string, @Body() dto: UpdateProjectAccessDto) {
    return { success: true, data: await this.projectsService.updateAccessRole(id, accessId, dto.role) };
  }

  @Delete(':id/accesses/:accessId')
  async revokeAccess(@Param('id') id: string, @Param('accessId') accessId: string) {
    return { success: true, data: await this.projectsService.revokeAccess(id, accessId) };
  }

  /**
   * Тестовые данные: массовое создание N проектов (dev-only)
   */
  @Post('seed/dev/:count')
  async seedDev(@Param('count') count: string, @Request() req: any) {
    const n = Math.max(1, Math.min(20, parseInt(count, 10) || 5));
    const created = [] as any[];
    for (let i = 0; i < n; i++) {
      const name = `Dev Project ${Date.now()}-${i + 1}`;
      const dto: any = { name, settings: { orderIndex: i } };
      created.push(await this.projectsService.create(dto, req.user?.id ?? 'owner-dev'));
    }
    return { success: true, data: created };
  }

  // SSE endpoint перенесён на уровень приложения в main.ts для совместимости
}

//
