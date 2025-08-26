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
}


