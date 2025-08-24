import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { Invitation } from './entities/invitation.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';

/**
 * Контроллер приглашений
 */
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
  @ApiOperation({ summary: 'Создание приглашений' })
  @ApiResponse({ 
    status: 201, 
    description: 'Приглашения созданы',
    type: [Invitation],
  })
  create(@Body() createInvitationDto: CreateInvitationDto, @Request() req: ExpressRequest): Promise<Invitation[]> {
    const userId = (req as any).user.id;
    return this.invitationsService.create(createInvitationDto, userId);
  }

  /**
   * Получение всех приглашений
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение списка приглашений' })
  @ApiResponse({ 
    status: 200, 
    description: 'Список приглашений',
    type: [Invitation],
  })
  findAll(): Promise<Invitation[]> {
    return this.invitationsService.findAll();
  }

  /**
   * Принятие приглашения (публичный эндпоинт)
   */
  @Post(':token/accept')
  @ApiOperation({ summary: 'Принятие приглашения' })
  @ApiResponse({ 
    status: 200, 
    description: 'Приглашение принято',
    schema: {
      type: 'object',
      properties: {
        user: { type: 'object' },
        invitation: { $ref: '#/components/schemas/Invitation' },
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Приглашение не найдено' })
  @ApiResponse({ status: 400, description: 'Приглашение истекло или уже обработано' })
  accept(@Param('token') token: string, @Body() acceptInvitationDto: AcceptInvitationDto) {
    return this.invitationsService.accept(token, acceptInvitationDto);
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
  @ApiResponse({ status: 400, description: 'Нельзя отменить обработанное приглашение' })
  cancel(@Param('id') id: string): Promise<Invitation> {
    return this.invitationsService.cancel(id);
  }
}
