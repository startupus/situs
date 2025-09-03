import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';

// Сервисы
import { PermissionsService } from './services/permissions.service';
import { RoleHierarchyService } from './services/role-hierarchy.service';
import { ContextResolverService } from './services/context-resolver.service';
import { AccessLevelsService } from '../services/access-levels.service';

// Guards
import { PermissionGuard } from './guards/permission.guard';

/**
 * Модуль системы прав доступа
 *
 * Предоставляет:
 * - Сервисы для проверки прав и работы с ролями
 * - Guards для защиты эндпоинтов
 * - Декораторы для контроллеров
 * - Утилиты для работы с правами
 */
@Module({
  imports: [DatabaseModule],
  providers: [
    // Основные сервисы
    PermissionsService,
    RoleHierarchyService,
    ContextResolverService,
    AccessLevelsService,

    // Guards
    PermissionGuard,
  ],
  exports: [
    // Сервисы
    PermissionsService,
    RoleHierarchyService,
    ContextResolverService,
    AccessLevelsService,

    // Guards
    PermissionGuard,
  ],
})
export class PermissionsModule {}
