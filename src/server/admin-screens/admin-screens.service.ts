import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AdminScreensService {
  constructor(private readonly prisma: PrismaService) {}

  async list(projectId: string) {
    return this.prisma.adminScreen.findMany({ where: { projectId }, orderBy: [{ orderIndex: 'asc' }, { title: 'asc' }] });
  }

  async getByAlias(projectId: string, alias: string) {
    const screen = await this.prisma.adminScreen.findFirst({ where: { projectId, alias } });
    if (!screen) throw new NotFoundException('Экран не найден');
    return screen;
  }

  async upsert(projectId: string, data: { alias: string; title: string; path: string; orderIndex?: number; icon?: string; category?: string; productId: string }) {
    if (!data.alias || !data.title || !data.path) throw new BadRequestException('alias, title и path обязательны');
    return this.prisma.adminScreen.upsert({
      where: { projectId_alias: { projectId, alias: data.alias } as any },
      update: { title: data.title, path: data.path, orderIndex: data.orderIndex || 0, icon: data.icon, category: data.category },
      create: { projectId, productId: data.productId, alias: data.alias, title: data.title, path: data.path, orderIndex: data.orderIndex || 0, icon: data.icon, category: data.category },
    });
  }

  async remove(projectId: string, alias: string) {
    const existing = await this.prisma.adminScreen.findFirst({ where: { projectId, alias } });
    if (!existing) throw new NotFoundException('Экран не найден');
    await this.prisma.adminScreen.delete({ where: { id: existing.id } });
    return { success: true };
  }
}
