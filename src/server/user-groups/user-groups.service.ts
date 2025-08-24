import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateUserGroupDto } from './dto/create-user-group.dto';
import { UpdateUserGroupDto } from './dto/update-user-group.dto';
import { UserGroup } from './entities/user-group.entity';

/**
 * Сервис для работы с группами пользователей
 */
@Injectable()
export class UserGroupsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Создание новой группы
   */
  async create(createUserGroupDto: CreateUserGroupDto): Promise<UserGroup> {
    const group = await this.prisma.userGroup.create({
      data: {
        title: createUserGroupDto.title,
        description: createUserGroupDto.description,
        parentId: createUserGroupDto.parentId,
        isCore: createUserGroupDto.isCore || false,
      },
    });

    return this.enrichGroupData(group);
  }

  /**
   * Получение всех групп
   */
  async findAll(): Promise<UserGroup[]> {
    const groups = await this.prisma.userGroup.findMany({
      orderBy: { title: 'asc' },
      include: {
        users: true,
        children: true,
        parent: true,
      },
    });

    return groups.map(group => this.enrichGroupData(group));
  }

  /**
   * Получение группы по ID
   */
  async findOne(id: string): Promise<UserGroup | null> {
    const group = await this.prisma.userGroup.findUnique({
      where: { id },
      include: {
        users: true,
        children: true,
        parent: true,
      },
    });

    return group ? this.enrichGroupData(group) : null;
  }

  /**
   * Обновление группы
   */
  async update(id: string, updateUserGroupDto: UpdateUserGroupDto): Promise<UserGroup> {
    const existingGroup = await this.findOne(id);
    if (!existingGroup) {
      throw new NotFoundException('Группа не найдена');
    }

    const updatedGroup = await this.prisma.userGroup.update({
      where: { id },
      data: updateUserGroupDto,
      include: {
        users: true,
        children: true,
        parent: true,
      },
    });

    return this.enrichGroupData(updatedGroup);
  }

  /**
   * Удаление группы
   */
  async remove(id: string): Promise<void> {
    const existingGroup = await this.findOne(id);
    if (!existingGroup) {
      throw new NotFoundException('Группа не найдена');
    }

    await this.prisma.userGroup.delete({
      where: { id },
    });
  }

  /**
   * Назначение пользователя в группы
   */
  async assignUserToGroups(userId: string, groupIds: string[]): Promise<void> {
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
    await this.prisma.userGroupMap.deleteMany({
      where: {
        userId,
        groupId,
      },
    });
  }

  /**
   * Обогащение данных группы
   */
  private enrichGroupData(group: any): UserGroup {
    return {
      ...group,
      usersCount: group.users?.length || 0,
    };
  }
}
