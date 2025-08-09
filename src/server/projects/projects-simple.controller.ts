import { Controller, Get } from '@nestjs/common';

/**
 * Упрощенный контроллер проектов для тестирования
 */
@Controller('api/projects-test')
export class ProjectsSimpleController {
  @Get()
  findAll() {
    return {
      success: true,
      data: {
        projects: [
          {
            id: 'test-1',
            name: 'Тестовый проект 1',
            description: 'Описание проекта',
            status: 'draft',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'test-2',
            name: 'Тестовый проект 2',
            description: 'Другое описание',
            status: 'published',
            createdAt: new Date().toISOString(),
          }
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 2,
          totalPages: 1,
        },
      },
    };
  }

  @Get('health')
  health() {
    return {
      status: 'ok',
      message: 'Projects API is working',
      timestamp: new Date().toISOString(),
    };
  }
}
