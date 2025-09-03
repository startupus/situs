import { Controller, Get, Param, Query } from '@nestjs/common';
import { UiService } from './ui.service';

@Controller('ui')
export class UiController {
  constructor(private readonly ui: UiService) {}

  // Возвращает мета-данные для построения заголовков и крошек в админке
  @Get('breadcrumbs/projects/:projectId/*')
  getProjectBreadcrumbs(@Param('projectId') projectId: string): any {
    // Пока минимально: проект + вычисление по сегментам; расширяется позже
    return this.ui.buildBreadcrumbs(projectId);
  }

  // Новый универсальный эндпоинт: метаданные для верхней панели по любому пути
  @Get('meta')
  async getMeta(@Query('path') path: string) {
    return this.ui.getMeta(path);
  }

  // Новый эндпоинт: admin sidebar (верхний уровень админки из системного проекта)
  @Get('admin-sidebar')
  async getAdminSidebar() {
    const items = await this.ui.getAdminSidebar();
    return { success: true, data: items };
  }

  // Новый эндпоинт: admin user dropdown (меню пользователя из системного проекта)
  @Get('admin-user')
  async getAdminUser() {
    const items = await this.ui.getAdminUserMenu();
    return { success: true, data: items };
  }

  // Новый эндпоинт: project sidebar (меню проекта по типу)
  // ВНИМАНИЕ: этот эндпоинт НЕ используется административной частью.
  // Он предназначен для публичных меню сайтов проектов (main/footer/sidebar),
  // и не должен применяться для построения левого сайдбара админки.
  @Get('project-sidebar')
  async getProjectSidebar(@Query('projectId') projectId: string, @Query('type') type?: string) {
    const items = await this.ui.getProjectSidebar(projectId, type || 'project-sidebar');
    return { success: true, data: items };
  }

  // Новый эндпоинт: system project sidebar (шаблон проектной навигации из системного проекта)
  @Get('system-project-sidebar')
  async getSystemProjectSidebar() {
    const items = await this.ui.getSystemProjectSidebar();
    return { success: true, data: items };
  }
}
