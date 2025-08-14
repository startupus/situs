import { Module } from '@nestjs/common';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { ValidationPipe } from './pipes/validation.pipe';
import { RolesGuard } from './guards/roles.guard';

/**
 * Модуль общих утилит
 * 
 * Содержит фильтры, интерцепторы, пайпы
 * и другие общие компоненты
 */
@Module({
  providers: [
    GlobalExceptionFilter,
    LoggingInterceptor,
    ValidationPipe,
    RolesGuard,
  ],
  exports: [
    GlobalExceptionFilter,
    LoggingInterceptor,
    ValidationPipe,
    RolesGuard,
  ],
})
export class CommonModule {}
