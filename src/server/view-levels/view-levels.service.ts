import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateViewLevelDto } from './dto/create-view-level.dto';
import { UpdateViewLevelDto } from './dto/update-view-level.dto';
import { ViewLevel } from './entities/view-level.entity';

/**
 * Сервис для работы с уровнями доступа
 */
@Injectable()
export class ViewLevelsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Создание нового уровня доступа
   */
  async create(createViewLevelDto: CreateViewLevelDto): Promise<ViewLevel> {
    const groupIds = JSON.stringify(createViewLevelDto.groupIds || []);
    
    const viewLevel = await this.prisma.viewLevel.create({
      data: {
        title: createViewLevelDto.title,
        description: createViewLevelDto.description,
        ordering: createViewLevelDto.ordering || 0,
        groupIds,
      },
    });

    return this.enrichViewLevelData(viewLevel);
  }

  /**
   * Получение всех уровней доступа
   */
  async findAll(): Promise<ViewLevel[]> {
    const viewLevels = await this.prisma.viewLevel.findMany({
      orderBy: { ordering: 'asc' },
    });

    return Promise.all(viewLevels.map(level => this.enrichViewLevelData(level)));
  }

  /**
   * Получение уровня доступа по ID
   */
  async findOne(id: string): Promise<ViewLevel | null> {
    const viewLevel = await this.prisma.viewLevel.findUnique({
      where: { id },
    });

    return viewLevel ? this.enrichViewLevelData(viewLevel) : null;
  }

  /**
   * Обновление уровня доступа
   */
  async update(id: string, updateViewLevelDto: UpdateViewLevelDto): Promise<ViewLevel> {
    const existingLevel = await this.findOne(id);
    if (!existingLevel) {
      throw new NotFoundException('Уровень доступа не найден');
    }

    const updateData: any = { ...updateViewLevelDto };
    if (updateViewLevelDto.groupIds) {
      updateData.groupIds = JSON.stringify(updateViewLevelDto.groupIds);
    }

    const updatedLevel = await this.prisma.viewLevel.update({
      where: { id },
      data: updateData,
    });

    return this.enrichViewLevelData(updatedLevel);
  }

  /**
   * Удаление уровня доступа
   */
  async remove(id: string): Promise<void> {
    const existingLevel = await this.findOne(id);
    if (!existingLevel) {
      throw new NotFoundException('Уровень доступа не найден');
    }

    await this.prisma.viewLevel.delete({
      where: { id },
    });
  }

  /**
   * Назначение групп к уровню доступа
   */
  async assignGroups(id: string, groupIds: string[]): Promise<ViewLevel> {
    const existingLevel = await this.findOne(id);
    if (!existingLevel) {
      throw new NotFoundException('Уровень доступа не найден');
    }

    const updatedLevel = await this.prisma.viewLevel.update({
      where: { id },
      data: {
        groupIds: JSON.stringify(groupIds),
      },
    });

    return this.enrichViewLevelData(updatedLevel);
  }

  /**
   * Обогащение данных уровня доступа
   */
  private async enrichViewLevelData(viewLevel: any): Promise<ViewLevel> {
    let groupIds: string[] = [];
    try {
      groupIds = JSON.parse(viewLevel.groupIds || '[]');
    } catch {
      groupIds = [];
    }

    // Получаем названия групп
    const groups: string[] = [];
    if (groupIds.length > 0) {
      const userGroups = await this.prisma.userGroup.findMany({
        where: { id: { in: groupIds } },
        select: { title: true },
      });
      groups.push(...userGroups.map(g => g.title));
    }

    return {
      ...viewLevel,
      groups,
    };
  }
}
