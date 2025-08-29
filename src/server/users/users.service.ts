import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, GlobalRole, UserStatus } from './entities/user.entity';
import { RealtimeEventsService } from '../realtime/realtime-events.service';
import * as bcrypt from 'bcryptjs';

/**
 * Сервис для работы с пользователями
 * 
 * Обеспечивает CRUD операции через Prisma ORM
 */
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(RealtimeEventsService) private readonly realtime: RealtimeEventsService
  ) {}

  /**
   * Создание нового пользователя
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Генерируем уникальный username с timestamp для уникальности
    const baseUsername = (createUserDto.email?.split('@')[0]) || createUserDto.name?.replace(/\s+/g, '.').toLowerCase() || 'user';
    const username = `${baseUsername}_${Date.now()}`;
    const profile = JSON.stringify({
      name: createUserDto.name || '',
      avatar: createUserDto.avatar || '',
      bio: '',
    });
    
    const globalRole = createUserDto.globalRole || GlobalRole.BUSINESS;
    // Приводим статус к строковому значению, совместимому с Prisma enum
    const statusDb = createUserDto.isActive !== undefined 
      ? (createUserDto.isActive ? 'ACTIVE' : 'INACTIVE')
      : ((createUserDto.status as any) || 'PENDING');

    // Хешируем пароль если он предоставлен
    const hashedPassword = createUserDto.password 
      ? await this.hashPassword(createUserDto.password)
      : null;

    const user = await this.prisma.user.create({
      data: { 
        email: createUserDto.email || null, 
        password: hashedPassword, 
        username, 
        profile,
        globalRole,
        status: statusDb as any
      },
    });

    // Привязываем внешнего провайдера при необходимости
    if (createUserDto.provider && createUserDto.providerUserId) {
      await this.prisma.userAuthProvider.create({
        data: {
          userId: user.id,
          provider: createUserDto.provider,
          providerUserId: createUserDto.providerUserId,
        },
      });
    }

    return this.enrichUserData(this.excludePassword(user));
  }

  /**
   * Получение всех пользователей
   */
  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        ownedProjects: true,
      }
    });

    return users.map(user => this.enrichUserData(this.excludePassword(user)));
  }

  /**
   * Получение пользователей с фильтрами, сортировкой и пагинацией
   */
  async findAllWithFilters(filters: {
    search?: string;
    role?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
    projectId?: string;
  }, principal?: { id?: string; globalRole?: GlobalRole }) {
    const { search, role, status, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 20 } = filters;

    // Построение условий фильтрации
    const where: any = {};

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { profile: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.globalRole = role;
    }

    if (status) {
      where.status = status.toUpperCase();
    }

    // Построение сортировки
    const orderBy: any = {};
    if (sortBy === 'username') {
      orderBy.username = sortOrder;
    } else if (sortBy === 'email') {
      orderBy.email = sortOrder;
    } else if (sortBy === 'created') {
      orderBy.createdAt = sortOrder;
    } else if (sortBy === 'updated') {
      orderBy.updatedAt = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    // Ограничение доступа: BUSINESS/AGENCY/STAFF видят только пользователей проектов, где есть доступ
    if (principal && principal.globalRole !== GlobalRole.SUPER_ADMIN) {
      // Пользователи, у которых есть ProjectAccess в проектах текущего пользователя/аккаунта
      const accessibleProjectIds = await this.prisma.projectAccess.findMany({
        where: { userId: principal.id },
        select: { projectId: true },
      }).then(rows => rows.map(r => r.projectId));
      if (accessibleProjectIds.length > 0) {
        where.OR = (where.OR || []).concat([
          { projectAccesses: { some: { projectId: { in: accessibleProjectIds } } } } as any,
        ]);
      } else {
        // если нет доступных проектов — показываем пусто
        where.id = '__none__';
      }
    }

    // Фильтр по projectId: только пользователи, имеющие доступ к этому проекту
    if (filters.projectId) {
      where.projectAccesses = { some: { projectId: filters.projectId } } as any;
    }

    // Подсчет общего количества
    const total = await this.prisma.user.count({ where } as any);

    // Получение пользователей с пагинацией
    const users = await this.prisma.user.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        ownedProjects: true,
        projectAccesses: true,
        authProviders: true,
        groups: {
          include: {
            group: true,
          },
        },
      },
    });

    const enrichedUsers = users.map(user => this.enrichUserData(this.excludePassword(user)));

    return {
      data: enrichedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Получение пользователя по ID
   */
  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        ownedProjects: true,
      }
    });

    return user ? this.enrichUserData(this.excludePassword(user)) : null;
  }

  /**
   * DEV fallback: вернуть дефолтного пользователя, если нет аутентификации
   * Предпочтительно SUPER_ADMIN, иначе самый ранний пользователь
   */
  async getDefaultUser(): Promise<User | null> {
    // Сначала пробуем SUPER_ADMIN
    const admin = await this.prisma.user.findFirst({
      where: { globalRole: 'SUPER_ADMIN' as any },
      orderBy: { createdAt: 'asc' },
      include: { ownedProjects: true },
    });
    if (admin) return this.enrichUserData(this.excludePassword(admin));
    // Иначе любого первого по createdAt
    const anyUser = await this.prisma.user.findFirst({
      orderBy: { createdAt: 'asc' },
      include: { ownedProjects: true },
    });
    return anyUser ? this.enrichUserData(this.excludePassword(anyUser)) : null;
  }

  /**
   * Получение пользователя по email (включая пароль для аутентификации)
   */
  async findByEmail(email: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Поиск пользователя по email или телефону
   */
  async findByEmailOrPhone(email?: string, phone?: string): Promise<any> {
    if (!email && !phone) {
      return null;
    }

    const whereConditions: any[] = [];
    if (email) {
      whereConditions.push({ email });
    }
    if (phone) {
      whereConditions.push({ phone });
    }

    return this.prisma.user.findFirst({
      where: {
        OR: whereConditions,
      },
    });
  }

  /**
   * Обновление пароля пользователя
   */
  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  /**
   * Обновление пользователя
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.findById(id);
    if (!existingUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto as any,
    });

    const userWithoutPassword = this.excludePassword(updatedUser);

    // Публикуем событие об изменении пользователя через SSE
    this.realtime.publish('user_updated', {
      userId: id,
      user: userWithoutPassword,
      changes: updateUserDto
    });

    return userWithoutPassword;
  }

  /**
   * Удаление пользователя
   */
  async remove(id: string): Promise<void> {
    const existingUser = await this.findById(id);
    if (!existingUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    await this.prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Получение статистики пользователей
   */
  async getStatistics(): Promise<{
    total: number;
    active: number;
    pending: number;
    suspended: number;
    inactive: number;
    banned: number;
  }> {
    const [total, active, pending, suspended, inactive, banned] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { status: 'ACTIVE' as any } }),
      this.prisma.user.count({ where: { status: 'PENDING' as any } }),
      this.prisma.user.count({ where: { status: 'SUSPENDED' as any } }),
      this.prisma.user.count({ where: { status: 'INACTIVE' as any } }),
      this.prisma.user.count({ where: { status: 'BANNED' as any } }),
    ]);

    return { total, active, pending, suspended, inactive, banned };
  }

  /**
   * Массовое обновление пользователей
   */
  async bulkUpdate(userIds: string[], data: Partial<{ globalRole: GlobalRole; status: UserStatus }>): Promise<{ count: number }> {
    const updateData: any = {};
    if (data.globalRole) updateData.globalRole = data.globalRole;
    if (data.status) updateData.status = (data.status as any);

    const result = await this.prisma.user.updateMany({
      where: { id: { in: userIds } },
      data: updateData,
    });

    return { count: result.count };
  }

  /**
   * Массовое удаление пользователей
   */
  async bulkDelete(userIds: string[]): Promise<{ count: number }> {
    const result = await this.prisma.user.deleteMany({
      where: { id: { in: userIds } },
    });

    return { count: result.count };
  }

  /**
   * Активация пользователя
   */
  async activate(id: string): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { status: 'ACTIVE' as any },
      include: { ownedProjects: true },
    });

    return this.enrichUserData(this.excludePassword(user));
  }

  /**
   * Блокировка пользователя
   */
  async suspend(id: string): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { status: 'SUSPENDED' as any },
      include: { ownedProjects: true },
    });

    return this.enrichUserData(this.excludePassword(user));
  }

  /**
   * Изменение роли пользователя
   */
  async changeRole(id: string, globalRole: GlobalRole): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { globalRole },
      include: { ownedProjects: true },
    });

    return this.enrichUserData(this.excludePassword(user));
  }

  /**
   * Обогащение данных пользователя
   */
  private enrichUserData(user: any): User {
    let profileData: any = {};
    try {
      profileData = user.profile ? JSON.parse(user.profile) : {};
    } catch {
      profileData = {};
    }

    // Извлекаем группы пользователя
    const groups = user.groups?.map((groupMap: any) => groupMap.group?.title).filter(Boolean) || [];
    
    // Извлекаем провайдеры аутентификации
    const authProviders = user.authProviders?.map((provider: any) => provider.provider).filter(Boolean) || [];

    return {
      ...user,
      name: profileData.name || user.username || '',
      avatar: profileData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name || user.username || 'U')}&background=3b82f6&color=fff`,
      projectsCount: user.ownedProjects?.length || 0,
      permissions: this.getUserPermissions(user.globalRole),
      isEmailVerified: true, // TODO: Implement email verification
      twoFactorEnabled: false, // TODO: Implement 2FA
      lastLogin: user.updatedAt, // TODO: Track actual last login
      groups,
      authProviders,
    };
  }

  /**
   * Получение прав доступа по роли
   */
  private getUserPermissions(role: GlobalRole): string[] {
    switch (role) {
      case GlobalRole.SUPER_ADMIN:
        return ['*'];
      case GlobalRole.STAFF:
        return ['system.admin', 'users.manage', 'projects.manage'];
      case GlobalRole.AGENCY:
        return ['projects.create', 'projects.manage.own', 'users.invite'];
      case GlobalRole.BUSINESS:
        return ['projects.create.limited'];
      default:
        return [];
    }
  }

  /**
   * Назначение пользователя в группы
   */
  async assignUserToGroups(userId: string, groupIds: string[]): Promise<void> {
    const existingUser = await this.findById(userId);
    if (!existingUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Удаляем существующие назначения
    await this.prisma.userGroupMap.deleteMany({
      where: { userId },
    });

    // Создаем новые назначения
    if (groupIds.length > 0) {
      await this.prisma.userGroupMap.createMany({
        data: groupIds.map(groupId => ({
          userId,
          groupId,
        })),
      });
    }
  }

  /**
   * Удаление пользователя из группы
   */
  async removeUserFromGroup(userId: string, groupId: string): Promise<void> {
    const existingUser = await this.findById(userId);
    if (!existingUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    await this.prisma.userGroupMap.deleteMany({
      where: {
        userId,
        groupId,
      },
    });
  }

  /**
   * Получение внешних провайдеров пользователя
   */
  async getUserAuthProviders(userId: string) {
    const existingUser = await this.findById(userId);
    if (!existingUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    return await this.prisma.userAuthProvider.findMany({
      where: { userId },
      select: {
        id: true,
        provider: true,
        providerUserId: true,
        createdAt: true,
      },
    });
  }

  /**
   * Добавление внешнего провайдера к пользователю
   */
  async addUserAuthProvider(userId: string, providerData: {
    provider: string;
    providerUserId: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
  }) {
    const existingUser = await this.findById(userId);
    if (!existingUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    return await this.prisma.userAuthProvider.create({
      data: {
        userId,
        ...providerData,
      },
    });
  }

  /**
   * Удаление внешнего провайдера пользователя
   */
  async removeUserAuthProvider(userId: string, provider: string): Promise<void> {
    const existingUser = await this.findById(userId);
    if (!existingUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    const existingProvider = await this.prisma.userAuthProvider.findFirst({
      where: { userId, provider },
    });

    if (!existingProvider) {
      throw new NotFoundException('Провайдер не найден');
    }

    await this.prisma.userAuthProvider.delete({
      where: { id: existingProvider.id },
    });
  }

  /**
   * Получение настроек пользователей
   */
  async getUserSettings() {
    // В реальном проекте настройки могут храниться в отдельной таблице
    // Пока возвращаем дефолтные настройки
    return {
      registration: {
        allowSelfRegistration: true,
        requireEmailVerification: false,
        defaultRole: 'BUSINESS',
      },
      authentication: {
        enableTwoFactor: false,
        sessionTimeout: 3600, // 1 час в секундах
        allowedProviders: ['google', 'github', 'apple'],
      },
      notifications: {
        emailNotifications: true,
        invitationNotifications: true,
      },
      privacy: {
        showOnlineStatus: true,
        allowProfileViewing: true,
      },
    };
  }

  /**
   * Обновление настроек пользователей
   */
  async updateUserSettings(settings: any) {
    // В реальном проекте здесь будет сохранение в базу данных
    // Пока просто возвращаем обновленные настройки
    return {
      success: true,
      message: 'Настройки обновлены',
      settings,
    };
  }

  /**
   * Хеширование пароля
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Исключение пароля из результата
   */
  private excludePassword(user: any): User {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
