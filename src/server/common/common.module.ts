import { Module } from '@nestjs/common';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { ValidationPipe } from './pipes/validation.pipe';
import { RolesGuard } from './guards/roles.guard';
import { PoliciesGuard } from './guards/policies.guard';
import { PermissionGuard } from './guards/permission.guard';
import { PermissionsService } from './services/permissions.service';
import { AccessLevelsService } from './services/access-levels.service';
import { DatabaseModule } from '../database/database.module';

/**
 * Модуль общих утилит с обновленной системой прав доступа
 * 
 * Содержит:
 * - Фильтры, интерцепторы, пайпы
 * - Новые guards для детальной проверки прав
 * - Сервисы для управления правами и уровнями доступа
 * - Конфигурацию ролей с иерархией
 */
@Module({
  imports: [DatabaseModule],
  providers: [
    // Существующие компоненты
    GlobalExceptionFilter,
    LoggingInterceptor,
    ValidationPipe,
    
    // Старые guards (пока оставляем для совместимости)
    RolesGuard,
    PoliciesGuard,
    
    // Новая система прав доступа
    PermissionGuard,
    PermissionsService,
    AccessLevelsService,
  ],
  exports: [
    // Существующие компоненты
    GlobalExceptionFilter,
    LoggingInterceptor,
    ValidationPipe,
    
    // Старые guards
    RolesGuard,
    PoliciesGuard,
    
    // Новая система прав доступа
    PermissionGuard,
    PermissionsService,
    AccessLevelsService,
  ],
})
export class CommonModule {}