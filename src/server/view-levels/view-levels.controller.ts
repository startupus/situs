import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ViewLevelsService } from './view-levels.service';
import { CreateViewLevelDto } from './dto/create-view-level.dto';
import { UpdateViewLevelDto } from './dto/update-view-level.dto';
import { ViewLevel } from './entities/view-level.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * Контроллер уровней доступа
 */
@ApiTags('view-levels')
@Controller('view-levels')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ViewLevelsController {
  constructor(private readonly viewLevelsService: ViewLevelsService) {}

  /**
   * Создание уровня доступа
   */
  @Post()
  @ApiOperation({ summary: 'Создание уровня доступа' })
  @ApiResponse({
    status: 201,
    description: 'Уровень доступа создан',
    type: ViewLevel,
  })
  create(@Body() createViewLevelDto: CreateViewLevelDto): Promise<ViewLevel> {
    return this.viewLevelsService.create(createViewLevelDto);
  }

  /**
   * Получение всех уровней доступа
   */
  @Get()
  @ApiOperation({ summary: 'Получение списка уровней доступа' })
  @ApiResponse({
    status: 200,
    description: 'Список уровней доступа',
    type: [ViewLevel],
  })
  findAll(): Promise<ViewLevel[]> {
    return this.viewLevelsService.findAll();
  }

  /**
   * Получение уровня доступа по ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Получение уровня доступа по ID' })
  @ApiResponse({
    status: 200,
    description: 'Данные уровня доступа',
    type: ViewLevel,
  })
  @ApiResponse({ status: 404, description: 'Уровень доступа не найден' })
  findOne(@Param('id') id: string): Promise<ViewLevel | null> {
    return this.viewLevelsService.findOne(id);
  }

  /**
   * Обновление уровня доступа
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Обновление уровня доступа' })
  @ApiResponse({
    status: 200,
    description: 'Уровень доступа обновлен',
    type: ViewLevel,
  })
  @ApiResponse({ status: 404, description: 'Уровень доступа не найден' })
  update(@Param('id') id: string, @Body() updateViewLevelDto: UpdateViewLevelDto): Promise<ViewLevel> {
    return this.viewLevelsService.update(id, updateViewLevelDto);
  }

  /**
   * Удаление уровня доступа
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Удаление уровня доступа' })
  @ApiResponse({ status: 200, description: 'Уровень доступа удален' })
  @ApiResponse({ status: 404, description: 'Уровень доступа не найден' })
  remove(@Param('id') id: string): Promise<void> {
    return this.viewLevelsService.remove(id);
  }

  /**
   * Назначение групп к уровню доступа
   */
  @Put(':id/groups')
  @ApiOperation({ summary: 'Назначение групп к уровню доступа' })
  @ApiResponse({
    status: 200,
    description: 'Группы назначены к уровню доступа',
    type: ViewLevel,
  })
  @ApiResponse({ status: 404, description: 'Уровень доступа не найден' })
  assignGroups(@Param('id') id: string, @Body() body: { groupIds: string[] }): Promise<ViewLevel> {
    return this.viewLevelsService.assignGroups(id, body.groupIds);
  }
}
