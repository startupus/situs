import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

/**
 * Сервис для работы с пользователями
 * 
 * Обеспечивает CRUD операции через Prisma ORM
 */
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Создание нового пользователя
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const username = createUserDto.email?.split('@')[0] || 'user';
    const user = await this.prisma.user.create({
      data: { ...createUserDto, username },
    });

    return this.excludePassword(user);
  }

  /**
   * Получение всех пользователей
   */
  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map(user => this.excludePassword(user));
  }

  /**
   * Получение пользователя по ID
   */
  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? this.excludePassword(user) : null;
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

    return this.excludePassword(updatedUser);
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
   * Исключение пароля из результата
   */
  private excludePassword(user: any): User {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
