import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
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
import { Optional } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';
import { RealtimeEventsService } from '../realtime/realtime-events.service';
import { SimpleJwtGuard } from '../auth/guards/simple-jwt.guard';

/**
 * Контроллер проектов
 * 
 * Мигрированная логика из Express /api/projects
 */
// @ApiTags('projects')
@Controller('api/projects')
// @UseGuards(SimpleJwtGuard) // Временно отключено
// @ApiBearerAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService, private readonly realtime?: RealtimeEventsService) {}

  /**
   * Получение всех проектов с пагинацией и фильтрами
   */
  @Get()
  // @ApiOperation({ summary: 'Получение списка проектов' })
  // @ApiResponse({ status: 200, description: 'Список проектов с пагинацией' })
  async findAll(@Query() query: ProjectQueryDto, @Request() req: any) {
    try {
      // Для обычных пользователей показываем только их проекты
      if (!query.ownerId && req.user?.id) {
        query.ownerId = req.user.id;
      }
      
      const result = await this.projectsService.findAll(query);
      return {
        success: true,
        data: result,
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

  /**
   * Смена статуса проекта (активен/неактивен и пр.)
   */
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateProjectStatusDto, @Request() req: any) {
    const result = await this.projectsService.update(id, { status: dto.status } as any, req.user?.id ?? 'owner-dev');
    try {
      // eslint-disable-next-line no-console
      console.log('[RT] controller publish project_status', { id, status: dto.status });
      this.realtime?.publishProjectStatus(id, dto.status);
    } catch {}
    return { success: true, data: result };
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
  @Post(':id/publish')
  async publish(@Param('id') id: string, @Request() req: any) {
    return { success: true, data: await this.projectsService.publish(id, req.user?.id ?? 'owner-dev') };
  }

  /**
   * Дублирование проекта
   */
  @Post(':id/duplicate')
  async duplicate(@Param('id') id: string, @Request() req: any) {
    return { success: true, data: await this.projectsService.duplicate(id, req.user?.id ?? 'owner-dev') };
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
