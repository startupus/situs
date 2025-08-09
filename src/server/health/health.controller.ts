import { Controller, Get } from '@nestjs/common';

/**
 * Контроллер проверки состояния
 */
@Controller()
export class HealthController {
  @Get('health')
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      server: 'NestJS',
    };
  }

  @Get()
  root() {
    return {
      message: 'Situs NestJS API Server',
      version: '1.0.0',
      docs: '/api/docs',
      health: '/health',
    };
  }
}
