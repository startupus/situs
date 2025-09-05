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
  BadRequestException,
} from '@nestjs/common';
import { Sse, MessageEvent } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { merge, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
// import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { Optional, Inject, ForbiddenException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateProjectDomainDto } from './dto/update-project-domain.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';
import { RealtimeEventsService } from '../realtime/realtime-events.service';
import { GrantProjectAccessDto } from './dto/grant-project-access.dto';
import { UpdateProjectAccessDto } from './dto/update-project-access.dto';
// import { SimpleJwtGuard } from '../auth/guards/simple-jwt.guard'; // Временно отключено
import { Roles, Scopes } from '../common/decorators/roles.decorator';

/**
 * Контроллер проектов
 *
 * Мигрированная логика из Express /api/projects
 */
// @ApiTags('projects')
console.log('[BOOT] Loading ProjectsController file');
@Controller('projects')
// @UseGuards(SimpleJwtGuard) // Временно отключено
// @ApiBearerAuth()
export class ProjectsController {
  private readonly projectsService: ProjectsService;
  private readonly realtime?: RealtimeEventsService;

  constructor(
    projectsService: ProjectsService,
    @Optional() @Inject(RealtimeEventsService) realtime?: RealtimeEventsService,
  ) {
    this.projectsService = projectsService;
    this.realtime = realtime;
    console.log(
      '[BOOT] ProjectsController manual injection, projectsService:',
      !!this.projectsService,
      'realtime:',
      !!this.realtime,
    );
  }

  /**
   * Получение всех проектов с пагинацией и фильтрами
   */
  @Get()
  @Roles('BUSINESS', 'AGENCY', 'STAFF', 'SUPER_ADMIN')
  @Scopes('PROJECT_READ')
  // @ApiOperation({ summary: 'Получение списка проектов' })
  // @ApiResponse({ status: 200, description: 'Список проектов с пагинацией' })
  async findAll(@Query() query: ProjectQueryDto, @Request() req: any) {
    // КРИТИЧЕСКАЯ БЕЗОПАСНОСТЬ: Передаем userId для фильтрации
    const userId = req.user?.id;
    const tenantId = req.tenantId; // TODO: Получить из middleware
    const result = await this.projectsService.findAll(query, userId, tenantId);
    // Адаптируем данные для совместимости с фронтом: name -> title
    const adaptedProjects = result.projects.map((project: any) => ({
      ...project,
      title: project.name,
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
  }

  /**
   * Проверка доступности slug
   */
  @Get('check-slug/:slug')
  async checkSlug(@Param('slug') slug: string, @Query('exclude') excludeProjectId?: string) {
    const existing = await this.projectsService['prisma'].project.findFirst({
      where: { slug, id: excludeProjectId ? { not: excludeProjectId } : undefined } as any,
    });
    return { success: true, data: { slug, available: !existing } };
  }

  /**
   * Проверка доступности домена (customDomain)
   */
  @Get('check-domain/:domain')
  async checkDomain(@Param('domain') domain: string, @Query('exclude') excludeProjectId?: string) {
    const existing = await this.projectsService['prisma'].project.findFirst({
      where: { customDomain: domain, id: excludeProjectId ? { not: excludeProjectId } : undefined } as any,
    });
    return { success: true, data: { domain, available: !existing } };
  }

  /**
   * SSE поток совместимости: GET /api/projects/events
   */
  @Public()
  @Sse('events')
  sseEvents(): any {
    const source$ = this.realtime?.asObservable();
    const handshake$ = of({ type: 'sse_connected', payload: { ts: new Date().toISOString() } });
    return merge(handshake$, source$ || of()).pipe(map((evt) => ({ data: evt }) as MessageEvent));
  }

  /**
   * Получение проекта по ID
   */
  @Get(':id')
  @Roles('BUSINESS', 'AGENCY', 'STAFF', 'SUPER_ADMIN')
  @Scopes('PROJECT_READ')
  async findOne(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.id;
    const tenantId = req.tenantId;
    return { success: true, data: await this.projectsService.findOne(id, userId, tenantId) };
  }

  /**
   * Получение активной темы проекта (MVP)
   */
  @Get(':id/theme')
  async getProjectTheme(@Param('id') id: string) {
    const theme = await this.projectsService.getProjectThemeConfig(id);
    return { success: true, data: theme } as const;
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
  @Scopes('PROJECT_WRITE')
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @Request() req: any) {
    // Жёсткая защита системного проекта на уровне контроллера (ранний возврат)
    if (id === 'situs-admin') {
      const body = req && req.body ? req.body : (updateProjectDto as any);
      const hasForbidden = body && ('slug' in body || 'ownerId' in body);
      if (hasForbidden) {
        throw new ForbiddenException('Slug/ownerId системного проекта нельзя изменять');
      }
    }
    return {
      success: true,
      data: await this.projectsService.update(id, updateProjectDto, req.user?.id ?? 'owner-dev'),
    };
  }

  @Put(':id')
  async updatePut(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @Request() req: any) {
    return {
      success: true,
      data: await this.projectsService.update(id, updateProjectDto, req.user?.id ?? 'owner-dev'),
    };
  }

  /**
   * Обновление активной темы проекта (MVP)
   */
  @Put(':id/theme')
  async updateProjectTheme(@Param('id') id: string, @Body() body: any) {
    const result = await this.projectsService.updateProjectThemeConfig(id, body);
    return { success: result.success } as const;
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
    const normalizedStatus = (dto.status || '').toString().toUpperCase();
    const isPublished = normalizedStatus === 'ACTIVE' || normalizedStatus === 'PUBLISHED';
    const result = await this.projectsService.update(
      id,
      { status: normalizedStatus as any, isPublished } as any,
      req.user?.id ?? 'owner-dev',
    );
    const adaptedResult = { ...result, title: result.name };
    return { success: true, data: adaptedResult };
  }

  /**
   * Удаление проекта
   */
  @Delete(':id')
  @Scopes('PROJECT_ADMIN')
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
  async updateAccess(
    @Param('id') id: string,
    @Param('accessId') accessId: string,
    @Body() dto: UpdateProjectAccessDto,
  ) {
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
