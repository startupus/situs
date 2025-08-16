import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';

/**
 * Контроллер проверки состояния
 */
@Controller()
export class HealthController {
  @Public()
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

  @Public()
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
