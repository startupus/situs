import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { Invitation, InvitationStatus } from './entities/invitation.entity';
import { GlobalRole } from '../users/entities/user.entity';
import { randomBytes } from 'crypto';

/**
 * Сервис для работы с приглашениями
 */
@Injectable()
export class InvitationsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Создание приглашений
   */
  async create(createInvitationDto: CreateInvitationDto, invitedById: string): Promise<Invitation[]> {
    const { emails, role, message, expiresInHours = 72, accountId, projectId } = createInvitationDto;
    
    // Вычисляем дату истечения
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    const invitations: Invitation[] = [];

    for (const email of emails) {
      // Проверяем, нет ли уже активного приглашения для этого email
      const existingInvitation = await this.prisma.userInvitation.findFirst({
        where: {
          email,
          status: 'PENDING',
          expiresAt: { gt: new Date() },
        },
      });

      if (existingInvitation) {
        throw new BadRequestException(`Активное приглашение для ${email} уже существует`);
      }

      // Генерируем уникальный токен
      const token = this.generateToken();

      const invitation = await this.prisma.userInvitation.create({
        data: {
          email,
          token,
          invitedById,
          role: role as any,
          accountId,
          projectId,
          status: 'PENDING',
          expiresAt,
        },
      });

      invitations.push(await this.enrichInvitationData(invitation));
    }

    return invitations;
  }

  /**
   * Получение всех приглашений
   */
  async findAll(): Promise<Invitation[]> {
    const invitations = await this.prisma.userInvitation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        invitedBy: true,
        acceptedBy: true,
      },
    });

    return Promise.all(invitations.map(inv => this.enrichInvitationData(inv)));
  }

  /**
   * Получение приглашения по токену
   */
  async findByToken(token: string): Promise<Invitation | null> {
    const invitation = await this.prisma.userInvitation.findUnique({
      where: { token },
      include: {
        invitedBy: true,
        acceptedBy: true,
      },
    });

    return invitation ? await this.enrichInvitationData(invitation) : null;
  }

  /**
   * Принятие приглашения
   */
  async accept(token: string, acceptInvitationDto: AcceptInvitationDto): Promise<{ user: any; invitation: Invitation }> {
    const invitation = await this.findByToken(token);
    
    if (!invitation) {
      throw new NotFoundException('Приглашение не найдено');
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException('Приглашение уже обработано');
    }

    if (invitation.expiresAt && new Date() > invitation.expiresAt) {
      // Помечаем как истекшее
      await this.prisma.userInvitation.update({
        where: { token },
        data: { status: 'EXPIRED' },
      });
      throw new BadRequestException('Приглашение истекло');
    }

    // Проверяем, существует ли уже пользователь с таким email
    const email = acceptInvitationDto.email || invitation.email;
    if (!email) {
      throw new BadRequestException('Email обязателен для принятия приглашения');
    }

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Создаем нового пользователя
      const username = email.split('@')[0];
      const profile = JSON.stringify({
        name: acceptInvitationDto.name || '',
        avatar: '',
        bio: '',
      });

      user = await this.prisma.user.create({
        data: {
          email,
          password: acceptInvitationDto.password || null,
          username,
          profile,
          globalRole: invitation.role as any || GlobalRole.BUSINESS,
          status: 'ACTIVE' as any,
        },
      });

      // Создаем запись о внешнем провайдере, если указан
      if (acceptInvitationDto.provider && acceptInvitationDto.providerUserId) {
        await this.prisma.userAuthProvider.create({
          data: {
            userId: user.id,
            provider: acceptInvitationDto.provider,
            providerUserId: acceptInvitationDto.providerUserId,
          },
        });
      }
    }

    // Обновляем приглашение
    const updatedInvitation = await this.prisma.userInvitation.update({
      where: { token },
      data: {
        status: 'ACCEPTED',
        acceptedById: user.id,
      },
      include: {
        invitedBy: true,
        acceptedBy: true,
      },
    });

    return {
      user,
      invitation: await this.enrichInvitationData(updatedInvitation),
    };
  }

  /**
   * Отмена приглашения
   */
  async cancel(id: string): Promise<Invitation> {
    const invitation = await this.prisma.userInvitation.findUnique({
      where: { id },
    });

    if (!invitation) {
      throw new NotFoundException('Приглашение не найдено');
    }

    if (invitation.status !== 'PENDING') {
      throw new BadRequestException('Можно отменить только ожидающие приглашения');
    }

    const updatedInvitation = await this.prisma.userInvitation.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        invitedBy: true,
        acceptedBy: true,
      },
    });

    return await this.enrichInvitationData(updatedInvitation);
  }

  /**
   * Генерация уникального токена
   */
  private generateToken(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Обогащение данных приглашения
   */
  private async enrichInvitationData(invitation: any): Promise<Invitation> {
    let inviterName = '';
    let acceptedByName = '';

    if (invitation.invitedBy) {
      try {
        const profile = JSON.parse(invitation.invitedBy.profile || '{}');
        inviterName = profile.name || invitation.invitedBy.username || '';
      } catch {
        inviterName = invitation.invitedBy.username || '';
      }
    }

    if (invitation.acceptedBy) {
      try {
        const profile = JSON.parse(invitation.acceptedBy.profile || '{}');
        acceptedByName = profile.name || invitation.acceptedBy.username || '';
      } catch {
        acceptedByName = invitation.acceptedBy.username || '';
      }
    }

    return {
      ...invitation,
      inviterName,
      acceptedByName,
    };
  }
}
