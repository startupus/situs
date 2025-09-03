import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserGroupsService } from './user-groups.service';
import { CreateUserGroupDto } from './dto/create-user-group.dto';
import { UpdateUserGroupDto } from './dto/update-user-group.dto';
import { UserGroup } from './entities/user-group.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * Контроллер групп пользователей
 */
@ApiTags('user-groups')
@Controller('user-groups')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserGroupsController {
  constructor(private readonly userGroupsService: UserGroupsService) {}

  /**
   * Создание группы
   */
  @Post()
  @ApiOperation({ summary: 'Создание группы пользователей' })
  @ApiResponse({
    status: 201,
    description: 'Группа создана',
    type: UserGroup,
  })
  create(@Body() createUserGroupDto: CreateUserGroupDto): Promise<UserGroup> {
    return this.userGroupsService.create(createUserGroupDto);
  }

  /**
   * Получение всех групп
   */
  @Get()
  @ApiOperation({ summary: 'Получение списка групп пользователей' })
  @ApiResponse({
    status: 200,
    description: 'Список групп',
    type: [UserGroup],
  })
  findAll(): Promise<UserGroup[]> {
    return this.userGroupsService.findAll();
  }

  /**
   * Получение группы по ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Получение группы по ID' })
  @ApiResponse({
    status: 200,
    description: 'Данные группы',
    type: UserGroup,
  })
  @ApiResponse({ status: 404, description: 'Группа не найдена' })
  findOne(@Param('id') id: string): Promise<UserGroup | null> {
    return this.userGroupsService.findOne(id);
  }

  /**
   * Обновление группы
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Обновление группы' })
  @ApiResponse({
    status: 200,
    description: 'Группа обновлена',
    type: UserGroup,
  })
  @ApiResponse({ status: 404, description: 'Группа не найдена' })
  update(@Param('id') id: string, @Body() updateUserGroupDto: UpdateUserGroupDto): Promise<UserGroup> {
    return this.userGroupsService.update(id, updateUserGroupDto);
  }

  /**
   * Удаление группы
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Удаление группы' })
  @ApiResponse({ status: 200, description: 'Группа удалена' })
  @ApiResponse({ status: 404, description: 'Группа не найдена' })
  remove(@Param('id') id: string): Promise<void> {
    return this.userGroupsService.remove(id);
  }
}
