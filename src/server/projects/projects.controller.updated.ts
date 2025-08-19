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
  BadRequestException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateProjectDomainDto } from './dto/update-project-domain.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';
import { RealtimeEventsService } from '../realtime/realtime-events.service';
import { GrantProjectAccessDto } from './dto/grant-project-access.dto';
import { UpdateProjectAccessDto } from './dto/update-project-access.dto';

// Новые импорты для системы прав
import { Permission, RequirePermission, OwnerOnly, AnyPermission } from '../common/decorators/permission.decorator';
import { PermissionGuard } from '../common/guards/permission.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * Контроллер проектов с обновленной системой прав доступа
 * 
 * Использует детальные права вместо простых скоупов
 */
@Controller('api/projects')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly realtimeEventsService: RealtimeEventsService,
  ) {}

  /**
   * Получение списка проектов
   * Права: собственные проекты ИЛИ проекты клиентов ИЛИ все проекты
   */
  @Get()
  @AnyPermission(['project.view.own', 'project.view.clients', 'project.view.all'])
  async findAll(@Query() query: ProjectQueryDto, @Request() req: any) {
    const user = req.user;
    
    // В зависимости от прав пользователя, фильтруем проекты
    let filterByUser = true;
    
    // Если пользователь может видеть все проекты
    if (await this.hasPermission(user, 'project.view.all')) {
      filterByUser = false;
    }
    // Если агентство может видеть проекты клиентов
    else if (await this.hasPermission(user, 'project.view.clients')) {
      // Добавляем логику для получения проектов клиентов
      query.includeClientProjects = true;
    }

    return this.projectsService.findAll(query, filterByUser ? user.id : undefined);
  }

  /**
   * Получение одного проекта
   * Права: просмотр собственных ИЛИ клиентских ИЛИ всех проектов
   */
  @Get(':id')
  @AnyPermission(['project.view.own', 'project.view.clients', 'project.view.all'])
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.projectsService.findOne(id, req.user?.id);
  }

  /**
   * Создание проекта
   * Права: создание проектов (с учетом лимитов)
   */
  @Post()
  @AnyPermission(['project.create', 'project.create.unlimited'])
  async create(@Body() createProjectDto: CreateProjectDto, @Request() req: any) {
    const result = await this.projectsService.create(createProjectDto, req.user?.id ?? 'owner-dev');
    
    // Отправляем событие о создании проекта
    this.realtimeEventsService.broadcastEvent('project_created', {
      id: result.data.id,
      name: result.data.name,
      status: result.data.status,
      ownerId: result.data.ownerId,
      createdAt: result.data.createdAt,
    });

    return result;
  }

  /**
   * Обновление проекта
   * Права: редактирование собственных ИЛИ клиентских ИЛИ всех проектов
   */
  @Patch(':id')
  @AnyPermission(['project.edit.own', 'project.edit.clients', 'project.edit.all'])
  async update(
    @Param('id') id: string, 
    @Body() updateProjectDto: UpdateProjectDto, 
    @Request() req: any
  ) {
    const result = await this.projectsService.update(id, updateProjectDto, req.user?.id ?? 'owner-dev');
    
    // Отправляем событие об обновлении
    this.realtimeEventsService.broadcastEvent('project_updated', {
      id,
      ...updateProjectDto,
      updatedAt: new Date(),
    });

    return result;
  }

  /**
   * Обновление статуса проекта
   * Права: редактирование собственных ИЛИ клиентских ИЛИ всех проектов
   */
  @Patch(':id/status')
  @AnyPermission(['project.edit.own', 'project.edit.clients', 'project.edit.all'])
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateProjectStatusDto,
    @Request() req: any
  ) {
    const result = await this.projectsService.updateStatus(id, updateStatusDto.status, req.user?.id);
    
    // Отправляем событие об изменении статуса
    this.realtimeEventsService.broadcastEvent('project_status', {
      id,
      status: updateStatusDto.status,
      updatedAt: new Date(),
    });

    return result;
  }

  /**
   * Публикация проекта
   * Права: публикация собственных ИЛИ клиентских ИЛИ всех проектов
   */
  @Put(':id/publish')
  @AnyPermission(['project.publish.own', 'project.publish.clients', 'project.publish.all'])
  async publish(@Param('id') id: string, @Request() req: any) {
    return this.projectsService.publish(id, req.user?.id ?? 'owner-dev');
  }

  /**
   * Снятие с публикации
   * Права: публикация собственных ИЛИ клиентских ИЛИ всех проектов
   */
  @Put(':id/unpublish')
  @AnyPermission(['project.publish.own', 'project.publish.clients', 'project.publish.all'])
  async unpublish(@Param('id') id: string, @Request() req: any) {
    return this.projectsService.unpublish(id, req.user?.id ?? 'owner-dev');
  }

  /**
   * Удаление проекта
   * Права: удаление собственных ИЛИ клиентских ИЛИ всех проектов
   */
  @Delete(':id')
  @AnyPermission(['project.delete.own', 'project.delete.clients', 'project.delete.all'])
  async remove(@Param('id') id: string, @Request() req: any) {
    const result = await this.projectsService.remove(id, req.user?.id ?? 'owner-dev');
    
    // Отправляем событие об удалении
    this.realtimeEventsService.broadcastEvent('project_deleted', {
      id,
      deletedAt: new Date(),
    });

    return result;
  }

  /**
   * Обновление доменов проекта
   * Права: управление доменами собственных ИЛИ клиентских ИЛИ всех проектов
   */
  @Patch(':id/domains')
  @AnyPermission(['project.domains.own', 'project.domains.clients', 'project.domains.all'])
  async updateDomains(
    @Param('id') id: string,
    @Body() updateDomainDto: UpdateProjectDomainDto,
    @Request() req: any
  ) {
    return this.projectsService.updateDomains(id, updateDomainDto, req.user?.id);
  }

  /**
   * Предоставление доступа к проекту
   * Права: управление доступом к проектам
   */
  @Post(':id/access')
  @Permission('project.access.manage')
  async grantAccess(
    @Param('id') projectId: string,
    @Body() grantAccessDto: GrantProjectAccessDto,
    @Request() req: any
  ) {
    return this.projectsService.grantAccess(projectId, grantAccessDto, req.user?.id);
  }

  /**
   * Обновление доступа к проекту
   * Права: управление доступом к проектам
   */
  @Patch(':id/access/:accessId')
  @Permission('project.access.manage')
  async updateAccess(
    @Param('id') projectId: string,
    @Param('accessId') accessId: string,
    @Body() updateAccessDto: UpdateProjectAccessDto,
    @Request() req: any
  ) {
    return this.projectsService.updateAccess(projectId, accessId, updateAccessDto, req.user?.id);
  }

  /**
   * Получение аналитики проекта
   * Права: аналитика собственных ИЛИ клиентских ИЛИ всех проектов
   */
  @Get(':id/analytics')
  @AnyPermission(['project.analytics.own', 'project.analytics.clients', 'project.analytics.all'])
  async getAnalytics(@Param('id') id: string, @Request() req: any) {
    return this.projectsService.getAnalytics(id, req.user?.id);
  }

  /**
   * Клонирование проекта
   * Права: клонирование проектов
   */
  @Post(':id/clone')
  @Permission('project.clone')
  async clone(@Param('id') id: string, @Request() req: any) {
    return this.projectsService.clone(id, req.user?.id);
  }

  /**
   * Экспорт проекта
   * Права: экспорт проектов
   */
  @Get(':id/export')
  @Permission('project.export')
  async export(@Param('id') id: string, @Request() req: any) {
    return this.projectsService.export(id, req.user?.id);
  }

  /**
   * Передача проекта другому пользователю
   * Права: передача проектов (только для агентств)
   */
  @Post(':id/transfer')
  @Permission('project.transfer')
  async transfer(
    @Param('id') id: string,
    @Body('newOwnerId') newOwnerId: string,
    @Request() req: any
  ) {
    return this.projectsService.transfer(id, newOwnerId, req.user?.id);
  }

  /**
   * Вспомогательный метод для проверки прав
   * (в реальном приложении это будет через PermissionsService)
   */
  private async hasPermission(user: any, permission: string): Promise<boolean> {
    // Заглушка - в реальности будет через PermissionsService
    return user.globalRole === 'SUPER_ADMIN' || 
           (user.globalRole === 'AGENCY' && permission.includes('clients')) ||
           (permission.includes('own'));
  }
}