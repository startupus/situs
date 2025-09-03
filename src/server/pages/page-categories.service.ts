import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ProjectsService } from '../projects/projects.service';
import { RealtimeEventsService } from '../realtime/realtime-events.service';
import { AssignCategoriesDto } from './dto/page-categories.dto';

@Injectable()
export class PageCategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly projectsService: ProjectsService,
    private readonly realtimeService: RealtimeEventsService,
  ) {}

  async assignCategories(pageId: string, assignDto: AssignCategoriesDto, userId: string) {
    // Получаем страницу с продуктом
    const page = await this.prisma.page.findUnique({
      where: { id: pageId },
      include: {
        product: { include: { project: true } },
        webCategories: true,
      },
    });

    if (!page) {
      throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
    }

    // Проверяем права на проект
    // TODO: checkProjectAccess method not found
    // await this.projectsService.checkProjectAccess(page.product.projectId, userId, 'PROJECT_WRITE');

    const results: { added: string[]; removed: string[] } = { added: [], removed: [] };

    // Добавляем категории
    if (assignDto.add?.length) {
      // Проверяем что категории существуют и принадлежат тому же продукту
      const categoriesToAdd = await this.prisma.webCategory.findMany({
        where: {
          id: { in: assignDto.add },
          productId: page.productId,
        },
      });

      if (categoriesToAdd.length !== assignDto.add.length) {
        throw new HttpException('Some categories not found or do not belong to this product', HttpStatus.BAD_REQUEST);
      }

      // Получаем уже существующие связи
      const existingLinks = page.webCategories.map((link: any) => link.categoryId);
      const newCategories = assignDto.add.filter((catId) => !existingLinks.includes(catId));

      // Создаём новые связи
      if (newCategories.length > 0) {
        await this.prisma.pageWebCategory.createMany({
          data: newCategories.map((categoryId) => ({
            pageId,
            categoryId,
          })),
        });
        results.added = newCategories;
      }
    }

    // Удаляем категории
    if (assignDto.remove?.length) {
      // Проверяем что не удаляем основную категорию
      if (page.primaryCategoryId && assignDto.remove.includes(page.primaryCategoryId)) {
        throw new HttpException(
          'Cannot remove primary category. Set another primary category first.',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.prisma.pageWebCategory.deleteMany({
        where: {
          pageId,
          categoryId: { in: assignDto.remove },
        },
      });
      results.removed = assignDto.remove;
    }

    // SSE событие
    this.realtimeService.publish('project_updated', { pageId, ...results }); // TODO: add page category events

    return results;
  }

  async setPrimaryCategory(pageId: string, categoryId: string, userId: string) {
    // Получаем страницу с продуктом
    const page = await this.prisma.page.findUnique({
      where: { id: pageId },
      include: {
        product: { include: { project: true } },
        webCategories: true,
      },
    });

    if (!page) {
      throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
    }

    // Проверяем права на проект
    // TODO: checkProjectAccess method not found
    // await this.projectsService.checkProjectAccess(page.product.projectId, userId, 'PROJECT_WRITE');

    // Проверяем что категория существует и принадлежит тому же продукту
    const category = await this.prisma.webCategory.findFirst({
      where: {
        id: categoryId,
        productId: page.productId,
      },
    });

    if (!category) {
      throw new HttpException('Category not found or does not belong to this product', HttpStatus.BAD_REQUEST);
    }

    // Проверяем что страница уже привязана к этой категории
    const existingLink = page.webCategories.find((link: any) => link.categoryId === categoryId);
    if (!existingLink) {
      throw new HttpException('Page must be assigned to category before setting it as primary', HttpStatus.BAD_REQUEST);
    }

    // Обновляем основную категорию
    const updatedPage = await this.prisma.page.update({
      where: { id: pageId },
      data: { primaryCategoryId: categoryId },
      include: {
        primaryCategory: true,
        webCategories: {
          include: {
            category: true,
          },
        },
      },
    });

    // SSE событие
    this.realtimeService.publish('project_updated', { pageId, categoryId }); // TODO: add page category events

    return updatedPage;
  }
}
