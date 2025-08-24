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
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { Invitation, InvitationStatus } from './entities/invitation.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('invitations')
@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  /**
   * Создание приглашений
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создание приглашений пользователей' })
  @ApiResponse({ 
    status: 201, 
    description: 'Приглашения созданы и отправлены',
    type: [Invitation],
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 409, description: 'Пользователи уже существуют или имеют активные приглашения' })
  create(
    @Body() createInvitationDto: CreateInvitationDto,
    @Request() req: ExpressRequest
  ): Promise<Invitation[]> {
    const userId = (req as any).user.id;
    return this.invitationsService.create(createInvitationDto, userId);
  }

  /**
   * Получение всех приглашений с фильтрацией
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение списка приглашений' })
  @ApiQuery({ name: 'page', required: false, description: 'Номер страницы' })
  @ApiQuery({ name: 'limit', required: false, description: 'Количество элементов на странице' })
  @ApiQuery({ name: 'status', required: false, enum: InvitationStatus, description: 'Фильтр по статусу' })
  @ApiQuery({ name: 'email', required: false, description: 'Поиск по email' })
  @ApiResponse({ 
    status: 200, 
    description: 'Список приглашений',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/Invitation' } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      }
    }
  })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: InvitationStatus,
    @Query('email') email?: string,
  ) {
    return this.invitationsService.findAll(
      parseInt(page || '1', 10),
      parseInt(limit || '20', 10),
      status,
      email
    );
  }

  /**
   * Получение приглашения по токену (публичный endpoint)
   */
  @Get('by-token/:token')
  @Public()
  @ApiOperation({ summary: 'Получение приглашения по токену' })
  @ApiResponse({ 
    status: 200, 
    description: 'Данные приглашения',
    type: Invitation,
  })
  @ApiResponse({ status: 404, description: 'Приглашение не найдено' })
  @ApiResponse({ status: 400, description: 'Приглашение истекло или недействительно' })
  findByToken(@Param('token') token: string): Promise<Invitation> {
    return this.invitationsService.findByToken(token);
  }

  /**
   * Принятие приглашения (публичный endpoint)
   */
  @Post('accept')
  @Public()
  @ApiOperation({ summary: 'Принятие приглашения и создание пользователя' })
  @ApiResponse({ 
    status: 201, 
    description: 'Пользователь создан, приглашение принято',
    schema: {
      type: 'object',
      properties: {
        user: { $ref: '#/components/schemas/User' },
        invitation: { $ref: '#/components/schemas/Invitation' },
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные или приглашение недействительно' })
  @ApiResponse({ status: 409, description: 'Пользователь уже существует' })
  acceptInvitation(@Body() acceptInvitationDto: AcceptInvitationDto) {
    return this.invitationsService.acceptInvitation(acceptInvitationDto);
  }

  /**
   * Получение приглашения по ID
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение приглашения по ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Данные приглашения',
    type: Invitation,
  })
  @ApiResponse({ status: 404, description: 'Приглашение не найдено' })
  findOne(@Param('id') id: string): Promise<Invitation> {
    return this.invitationsService.findOne(id);
  }

  /**
   * Обновление приглашения
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновление приглашения' })
  @ApiResponse({ 
    status: 200, 
    description: 'Приглашение обновлено',
    type: Invitation,
  })
  @ApiResponse({ status: 404, description: 'Приглашение не найдено' })
  update(
    @Param('id') id: string,
    @Body() updateInvitationDto: UpdateInvitationDto
  ): Promise<Invitation> {
    return this.invitationsService.update(id, updateInvitationDto);
  }

  /**
   * Отмена приглашения
   */
  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Отмена приглашения' })
  @ApiResponse({ 
    status: 200, 
    description: 'Приглашение отменено',
    type: Invitation,
  })
  @ApiResponse({ status: 404, description: 'Приглашение не найдено' })
  cancel(@Param('id') id: string): Promise<Invitation> {
    return this.invitationsService.cancel(id);
  }

  /**
   * Повторная отправка приглашения
   */
  @Post(':id/resend')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Повторная отправка приглашения' })
  @ApiResponse({ 
    status: 200, 
    description: 'Приглашение отправлено повторно',
    type: Invitation,
  })
  @ApiResponse({ status: 404, description: 'Приглашение не найдено' })
  @ApiResponse({ status: 400, description: 'Приглашение нельзя переотправить' })
  resend(@Param('id') id: string): Promise<Invitation> {
    return this.invitationsService.resend(id);
  }

  /**
   * Удаление приглашения
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление приглашения' })
  @ApiResponse({ status: 200, description: 'Приглашение удалено' })
  @ApiResponse({ status: 404, description: 'Приглашение не найдено' })
  remove(@Param('id') id: string): Promise<void> {
    return this.invitationsService.remove(id);
  }
}