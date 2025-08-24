import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { Invitation, InvitationStatus } from './entities/invitation.entity';
import { UsersService } from '../users/users.service';
import { GlobalRole, UserStatus } from '../users/entities/user.entity';
import { CommunicationService } from '../communication/communication.service';
import { CommunicationChannel } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class InvitationsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private communicationService: CommunicationService,
  ) {}

  /**
   * Создание множественных приглашений
   */
  async create(createInvitationDto: CreateInvitationDto, invitedBy: string): Promise<Invitation[]> {
    const { emails, role, message, channel, expiresAt } = createInvitationDto;
    
    // Проверяем, что пользователь существует
    const inviter = await this.usersService.findById(invitedBy);
    if (!inviter) {
      throw new NotFoundException('Пользователь, отправляющий приглашение, не найден');
    }

    // Проверяем, что email'ы еще не зарегистрированы
    const existingUsers = await this.prisma.user.findMany({
      where: {
        email: { in: emails }
      },
      select: { email: true }
    });

    if (existingUsers.length > 0) {
      throw new ConflictException(
        `Пользователи с email ${existingUsers.map((u: any) => u.email).join(', ')} уже зарегистрированы`
      );
    }

    // Проверяем существующие активные приглашения
    const existingInvitations = await this.prisma.invitation.findMany({
      where: {
        email: { in: emails },
        status: InvitationStatus.PENDING,
        expiresAt: { gt: new Date() }
      },
      select: { email: true }
    });

    if (existingInvitations.length > 0) {
      throw new ConflictException(
        `Активные приглашения для ${existingInvitations.map((i: any) => i.email).join(', ')} уже существуют`
      );
    }

    // Создаем приглашения
    const invitations: Invitation[] = [];
    const defaultExpiresAt = expiresAt ? new Date(expiresAt) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 дней

    for (const email of emails) {
      const token = this.generateInvitationToken();
      
      const invitation = await this.prisma.invitation.create({
        data: {
          email,
          role,
          message,
          channel,
          token,
          invitedBy,
          expiresAt: defaultExpiresAt,
          status: InvitationStatus.PENDING,
        },
        include: {
          invitedByUser: {
            select: {
              id: true,
              email: true,
              profile: true,
            }
          }
        }
      });

      // Отправляем приглашение через выбранный канал
      const sendResult = await this.sendInvitation(invitation, channel as CommunicationChannel);
      
      // Обновляем дату отправки только если отправка прошла успешно
      if (sendResult.success) {
        await this.prisma.invitation.update({
          where: { id: invitation.id },
          data: { sentAt: new Date() }
        });
      }

      invitations.push(this.mapToEntity(invitation));
    }

    return invitations;
  }

  /**
   * Получение всех приглашений с фильтрацией
   */
  async findAll(
    page: number = 1,
    limit: number = 20,
    status?: InvitationStatus,
    email?: string
  ): Promise<{ data: Invitation[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (status) where.status = status;
    if (email) where.email = { contains: email, mode: 'insensitive' };

    const [invitations, total] = await Promise.all([
      this.prisma.invitation.findMany({
        where,
        include: {
          invitedByUser: {
            select: {
              id: true,
              email: true,
              profile: true,
            }
          },
          acceptedByUser: {
            select: {
              id: true,
              email: true,
              profile: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.invitation.count({ where })
    ]);

    return {
      data: invitations.map((inv: any) => this.mapToEntity(inv)),
      total,
      page,
      limit
    };
  }

  /**
   * Получение приглашения по ID
   */
  async findOne(id: string): Promise<Invitation> {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id },
      include: {
        invitedByUser: {
          select: {
            id: true,
            email: true,
            profile: true,
          }
        },
        acceptedByUser: {
          select: {
            id: true,
            email: true,
            profile: true,
          }
        }
      }
    });

    if (!invitation) {
      throw new NotFoundException('Приглашение не найдено');
    }

    return this.mapToEntity(invitation);
  }

  /**
   * Получение приглашения по токену
   */
  async findByToken(token: string): Promise<Invitation> {
    const invitation = await this.prisma.invitation.findUnique({
      where: { token },
      include: {
        invitedByUser: {
          select: {
            id: true,
            email: true,
            profile: true,
          }
        }
      }
    });

    if (!invitation) {
      throw new NotFoundException('Приглашение не найдено');
    }

    // Проверяем, не истекло ли приглашение
    if (invitation.expiresAt < new Date()) {
      await this.prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: InvitationStatus.EXPIRED }
      });
      throw new BadRequestException('Приглашение истекло');
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException('Приглашение уже использовано или отменено');
    }

    return this.mapToEntity(invitation);
  }

  /**
   * Обновление приглашения
   */
  async update(id: string, updateInvitationDto: UpdateInvitationDto): Promise<Invitation> {
    const invitation = await this.findOne(id);

    const updatedInvitation = await this.prisma.invitation.update({
      where: { id },
      data: updateInvitationDto,
      include: {
        invitedByUser: {
          select: {
            id: true,
            email: true,
            profile: true,
          }
        },
        acceptedByUser: {
          select: {
            id: true,
            email: true,
            profile: true,
          }
        }
      }
    });

    return this.mapToEntity(updatedInvitation);
  }

  /**
   * Принятие приглашения и создание пользователя
   */
  async acceptInvitation(acceptInvitationDto: AcceptInvitationDto): Promise<{ user: any; invitation: Invitation }> {
    const { token, email, password, name } = acceptInvitationDto;
    
    console.log('🔍 Accepting invitation:', { token, email, name });

    // Находим и валидируем приглашение
    const invitation = await this.findByToken(token);
    console.log('📧 Found invitation:', invitation);
    
    if (invitation.email !== email) {
      throw new BadRequestException('Email не совпадает с приглашением');
    }

    // Проверяем, что пользователь с таким email еще не существует
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    // Создаем нового пользователя с минимальными данными
    try {
      const userData = {
        email,
        password,
        name: name || email.split('@')[0],
        isActive: true
      };
      console.log('👤 Creating user with data:', userData);
      
      const newUser = await this.usersService.create(userData);
      console.log('✅ User created:', newUser.id);
      
      // Обновляем приглашение
      const updatedInvitation = await this.prisma.invitation.update({
        where: { id: invitation.id },
        data: {
          status: InvitationStatus.ACCEPTED,
          acceptedBy: newUser.id,
          acceptedAt: new Date()
        },
        include: {
          invitedByUser: {
            select: {
              id: true,
              email: true,
              profile: true,
            }
          },
          acceptedByUser: {
            select: {
              id: true,
              email: true,
              profile: true,
            }
          }
        }
      });

      return {
        user: newUser,
        invitation: this.mapToEntity(updatedInvitation)
      };
    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw error;
    }
  }

  /**
   * Отмена приглашения
   */
  async cancel(id: string): Promise<Invitation> {
    return this.update(id, { status: InvitationStatus.CANCELLED });
  }

  /**
   * Повторная отправка приглашения
   */
  async resend(id: string): Promise<Invitation> {
    const invitation = await this.findOne(id);

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException('Можно переотправить только ожидающие приглашения');
    }

    if (invitation.expiresAt < new Date()) {
      throw new BadRequestException('Приглашение истекло');
    }

    // Отправляем приглашение снова
    const sendResult = await this.sendInvitation(invitation, invitation.channel as CommunicationChannel);

    // Обновляем дату отправки только если отправка прошла успешно
    if (sendResult.success) {
      return this.update(id, { sentAt: new Date() } as any);
    } else {
      throw new BadRequestException(`Ошибка отправки: ${sendResult.error}`);
    }
  }

  /**
   * Удаление приглашения
   */
  async remove(id: string): Promise<void> {
    const invitation = await this.findOne(id);
    await this.prisma.invitation.delete({ where: { id } });
  }

  /**
   * Генерация токена приглашения
   */
  private generateInvitationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Отправка приглашения через выбранный канал
   */
  private async sendInvitation(invitation: any, channel: CommunicationChannel) {
    const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:5177'}/accept-invitation?token=${invitation.token}`;
    
    // Получаем шаблон для канала
    const channelSettings = await this.communicationService.getChannelSettings(channel);
    const template = channelSettings?.inviteTemplate || `
Вы приглашены присоединиться к нашей платформе!

Для принятия приглашения перейдите по ссылке:
{{inviteLink}}

Приглашение действительно до: {{expiresAt}}

С уважением,
Команда Situs
    `.trim();

    const variables = {
      inviteLink,
      email: invitation.email,
      expiresAt: new Date(invitation.expiresAt).toLocaleDateString('ru-RU'),
      message: invitation.message || ''
    };

    return await this.communicationService.sendMessage(channel, {
      to: invitation.email,
      subject: 'Приглашение на платформу Situs',
      content: '',
      template,
      variables
    });
  }

  /**
   * Маппинг Prisma объекта в Entity
   */
  private mapToEntity(invitation: any): Invitation {
    const entity = new Invitation();
    
    entity.id = invitation.id;
    entity.email = invitation.email;
    entity.role = invitation.role;
    entity.status = invitation.status;
    entity.token = invitation.token;
    entity.message = invitation.message;
    entity.channel = invitation.channel;
    entity.invitedBy = invitation.invitedBy;
    entity.acceptedBy = invitation.acceptedBy;
    entity.expiresAt = invitation.expiresAt;
    entity.sentAt = invitation.sentAt;
    entity.acceptedAt = invitation.acceptedAt;
    entity.createdAt = invitation.createdAt;
    entity.updatedAt = invitation.updatedAt;

    // Добавляем связанные данные
    if (invitation.invitedByUser) {
      const profile = invitation.invitedByUser.profile ? JSON.parse(invitation.invitedByUser.profile) : {};
      entity.invitedByUser = {
        id: invitation.invitedByUser.id,
        name: profile.name || invitation.invitedByUser.email,
        email: invitation.invitedByUser.email,
      };
    }

    if (invitation.acceptedByUser) {
      const profile = invitation.acceptedByUser.profile ? JSON.parse(invitation.acceptedByUser.profile) : {};
      entity.acceptedByUser = {
        id: invitation.acceptedByUser.id,
        name: profile.name || invitation.acceptedByUser.email,
        email: invitation.acceptedByUser.email,
      };
    }

    return entity;
  }
}