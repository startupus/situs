import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User, GlobalRole, UserStatus } from './entities/user.entity';
import { Request as ExpressRequest } from 'express';

/**
 * Контроллер пользователей
 * 
 * Обрабатывает запросы для работы с пользователями
 */
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Создание пользователя (только для админов)
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({ 
    status: 201, 
    description: 'Пользователь создан',
    type: User,
  })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  /**
   * Получение всех пользователей с фильтрами, сортировкой и пагинацией
   */
  @Get()
  @ApiOperation({ summary: 'Получение списка пользователей' })
  @ApiResponse({ 
    status: 200, 
    description: 'Список пользователей',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/User' } },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            totalPages: { type: 'number' },
          }
        }
      }
    }
  })
  async findAll(
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
    @Query('sortBy') sortBy?: 'username' | 'email' | 'created' | 'updated',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('projectId') projectId?: string,
    @Request() req?: ExpressRequest,
  ) {
    const filters = {
      search,
      role,
      status,
      sortBy: sortBy || 'created',
      sortOrder: sortOrder || 'desc',
      page: parseInt(page || '1', 10),
      limit: parseInt(limit || '20', 10),
      projectId,
    };
    const principal = (req as any)?.user || null;
    return this.usersService.findAllWithFilters(filters as any, principal as any);
  }

  /**
   * Получение статистики пользователей
   */
  @Get('statistics')
  @ApiOperation({ summary: 'Получение статистики пользователей' })
  @ApiResponse({ 
    status: 200, 
    description: 'Статистика пользователей',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        active: { type: 'number' },
        pending: { type: 'number' },
        suspended: { type: 'number' },
        inactive: { type: 'number' },
        banned: { type: 'number' },
      }
    }
  })
  getStatistics() {
    return this.usersService.getStatistics();
  }

  /**
   * Получение настроек пользователей
   */
  // Удалён дублирующийся GET /users/settings — ниже есть защищённая версия

  /**
   * Получение текущего пользователя
   */
  @Get('me')
  @ApiOperation({ summary: 'Получение профиля текущего пользователя' })
  @ApiResponse({ 
    status: 200, 
    description: 'Профиль пользователя (обернутый в стандартный ответ)',
  })
  async getProfile(@Request() req: ExpressRequest): Promise<{ success: true; data: User | null }> {
    // Если есть авторизованный пользователь — отдаем его
    const maybeUserId = (req as any)?.user?.id;
    let user: User | null = null;
    if (maybeUserId) {
      user = await this.usersService.findById(maybeUserId);
    } else if (process.env.NODE_ENV !== 'production') {
      // DEV: fallback для неавторизованных
      user = await this.usersService.getDefaultUser();
    }
    return { success: true, data: user };
  }

  /**
   * Получение пользователя по ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Получение пользователя по ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Данные пользователя',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findById(id);
  }

  /**
   * Обновление пользователя
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновление пользователя' })
  @ApiResponse({ 
    status: 200, 
    description: 'Пользователь обновлен',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Удаление пользователя
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь удален' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }

  /**
   * Активация пользователя
   */
  @Put(':id/activate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Активация пользователя' })
  @ApiResponse({ 
    status: 200, 
    description: 'Пользователь активирован',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  activate(@Param('id') id: string): Promise<User> {
    return this.usersService.activate(id);
  }

  /**
   * Блокировка пользователя
   */
  @Put(':id/suspend')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Блокировка пользователя' })
  @ApiResponse({ 
    status: 200, 
    description: 'Пользователь заблокирован',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  suspend(@Param('id') id: string): Promise<User> {
    return this.usersService.suspend(id);
  }

  /**
   * Изменение роли пользователя
   */
  @Put(':id/role')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Изменение роли пользователя' })
  @ApiResponse({ 
    status: 200, 
    description: 'Роль пользователя изменена',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  changeRole(@Param('id') id: string, @Body() body: { globalRole: GlobalRole }): Promise<User> {
    return this.usersService.changeRole(id, body.globalRole);
  }

  /**
   * Массовое обновление пользователей
   */
  @Put('bulk/update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Массовое обновление пользователей' })
  @ApiResponse({ 
    status: 200, 
    description: 'Пользователи обновлены',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number' }
      }
    }
  })
  bulkUpdate(@Body() body: { 
    userIds: string[]; 
    data: Partial<{ globalRole: GlobalRole; status: UserStatus }> 
  }) {
    return this.usersService.bulkUpdate(body.userIds, body.data);
  }

  /**
   * Массовое удаление пользователей
   */
  @Delete('bulk/delete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Массовое удаление пользователей' })
  @ApiResponse({ 
    status: 200, 
    description: 'Пользователи удалены',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number' }
      }
    }
  })
  bulkDelete(@Body() body: { userIds: string[] }) {
    return this.usersService.bulkDelete(body.userIds);
  }

  /**
   * Назначение пользователя в группы
   */
  @Post(':id/groups')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Назначение пользователя в группы' })
  @ApiResponse({ 
    status: 200, 
    description: 'Пользователь назначен в группы',
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  assignUserToGroups(@Param('id') id: string, @Body() body: { groupIds: string[] }) {
    return this.usersService.assignUserToGroups(id, body.groupIds);
  }

  /**
   * Удаление пользователя из группы
   */
  @Delete(':id/groups/:groupId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление пользователя из группы' })
  @ApiResponse({ 
    status: 200, 
    description: 'Пользователь удален из группы',
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  removeUserFromGroup(@Param('id') id: string, @Param('groupId') groupId: string) {
    return this.usersService.removeUserFromGroup(id, groupId);
  }

  /**
   * Получение внешних провайдеров пользователя
   */
  @Get(':id/auth-providers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение внешних провайдеров пользователя' })
  @ApiResponse({ 
    status: 200, 
    description: 'Список провайдеров',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          provider: { type: 'string' },
          providerUserId: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  getUserAuthProviders(@Param('id') id: string) {
    return this.usersService.getUserAuthProviders(id);
  }

  /**
   * Добавление внешнего провайдера к пользователю
   */
  @Post(':id/auth-providers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Добавление внешнего провайдера к пользователю' })
  @ApiResponse({ 
    status: 201, 
    description: 'Провайдер добавлен',
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  addUserAuthProvider(@Param('id') id: string, @Body() body: { 
    provider: string; 
    providerUserId: string; 
    accessToken?: string; 
    refreshToken?: string; 
    expiresAt?: Date 
  }) {
    return this.usersService.addUserAuthProvider(id, body);
  }

  /**
   * Удаление внешнего провайдера пользователя
   */
  @Delete(':id/auth-providers/:provider')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление внешнего провайдера пользователя' })
  @ApiResponse({ 
    status: 200, 
    description: 'Провайдер удален',
  })
  @ApiResponse({ status: 404, description: 'Пользователь или провайдер не найден' })
  removeUserAuthProvider(@Param('id') id: string, @Param('provider') provider: string) {
    return this.usersService.removeUserAuthProvider(id, provider);
  }

  /**
   * Получение настроек пользователей
   */
  @Get('settings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение настроек пользователей' })
  @ApiResponse({ 
    status: 200, 
    description: 'Настройки пользователей',
    schema: {
      type: 'object',
      properties: {
        registration: {
          type: 'object',
          properties: {
            allowSelfRegistration: { type: 'boolean' },
            requireEmailVerification: { type: 'boolean' },
            defaultRole: { type: 'string' },
          }
        },
        authentication: {
          type: 'object',
          properties: {
            enableTwoFactor: { type: 'boolean' },
            sessionTimeout: { type: 'number' },
            allowedProviders: { type: 'array', items: { type: 'string' } },
          }
        },
        notifications: {
          type: 'object',
          properties: {
            emailNotifications: { type: 'boolean' },
            invitationNotifications: { type: 'boolean' },
          }
        },
        privacy: {
          type: 'object',
          properties: {
            showOnlineStatus: { type: 'boolean' },
            allowProfileViewing: { type: 'boolean' },
          }
        }
      }
    }
  })
  updateUserSettings(@Body() settings: any) {
    return this.usersService.updateUserSettings(settings);
  }
}
