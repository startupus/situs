import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleAssignmentService } from '../services/role-assignment.service';
import { GlobalRole, ProjectRole, AccountRole } from '../types/roles.types';

/**
 * Guard для проверки прав на назначение ролей
 * Используется с декораторами @CanAssignRole()
 */
@Injectable()
export class RoleAssignmentGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleAssignmentService: RoleAssignmentService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Пользователь не аутентифицирован');
    }

    // Получаем параметры из запроса
    const { targetUserId, newRole, projectId, accountId } = request.body;
    const assignerId = user.id;

    // Определяем тип назначения роли по наличию параметров
    if (projectId) {
      // Назначение роли в проекте
      const check = await this.roleAssignmentService.canAssignProjectRole(
        assignerId,
        targetUserId,
        projectId,
        newRole as ProjectRole,
      );

      if (!check.allowed) {
        throw new ForbiddenException(check.reason);
      }
    } else if (accountId) {
      // Назначение роли в аккаунте
      const check = await this.roleAssignmentService.canAssignAccountRole(
        assignerId,
        targetUserId,
        accountId,
        newRole as AccountRole,
      );

      if (!check.allowed) {
        throw new ForbiddenException(check.reason);
      }
    } else {
      // Назначение глобальной роли
      const check = await this.roleAssignmentService.canAssignGlobalRole(
        assignerId,
        targetUserId,
        newRole as GlobalRole,
      );

      if (!check.allowed) {
        throw new ForbiddenException(check.reason);
      }
    }

    return true;
  }
}

/**
 * Декоратор для указания необходимости проверки прав на назначение ролей
 */
export const RequireRoleAssignmentPermission = () => {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    // Метаданные для guard'а
    Reflect.defineMetadata('requireRoleAssignmentPermission', true, descriptor.value);
    return descriptor;
  };
};
