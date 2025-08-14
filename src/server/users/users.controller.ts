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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { Request as ExpressRequest } from 'express';

/**
 * Контроллер пользователей
 * 
 * Обрабатывает запросы для работы с пользователями
 */
@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Создание пользователя (только для админов)
   */
  @Post()
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
   * Получение всех пользователей
   */
  @Get()
  @ApiOperation({ summary: 'Получение списка пользователей' })
  @ApiResponse({ 
    status: 200, 
    description: 'Список пользователей',
    type: [User],
  })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  /**
   * Получение текущего пользователя
   */
  @Get('me')
  @ApiOperation({ summary: 'Получение профиля текущего пользователя' })
  @ApiResponse({ 
    status: 200, 
    description: 'Профиль пользователя',
    type: User,
  })
  getProfile(@Request() req: ExpressRequest): Promise<User | null> {
    return this.usersService.findById((req as any).user.id);
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
  @ApiOperation({ summary: 'Удаление пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь удален' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
