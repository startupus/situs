import { Module } from '@nestjs/common';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { ValidationPipe } from './pipes/validation.pipe';

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
  ],
  exports: [
    GlobalExceptionFilter,
    LoggingInterceptor,
    ValidationPipe,
  ],
})
export class CommonModule {}
