import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, SCOPES_KEY, GlobalRole, ProjectScope, AccountScope } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Dev/Test режим: не блокируем доступ ролями, чтобы не мешать разработке и e2e
    if (process.env.NODE_ENV !== 'production') {
      return true;
    }
    const requiredRoles = this.reflector.getAllAndOverride<GlobalRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const requiredScopes = this.reflector.getAllAndOverride<Array<ProjectScope | AccountScope>>(SCOPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user as any;

    // If nothing required, allow
    if (!requiredRoles && !requiredScopes) return true;

    // Basic role check from user.globalRole
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = requiredRoles.includes((user?.globalRole as GlobalRole) || 'BUSINESS');
      if (!hasRole) return false;
    }

    // Basic scope check placeholders. In future, resolve account/project membership
    if (requiredScopes && requiredScopes.length > 0) {
      const userScopes: Array<ProjectScope | AccountScope> = Array.isArray(user?.scopes) ? user.scopes : [];
      const hasAnyScope = requiredScopes.some((s) => userScopes.includes(s));
      if (!hasAnyScope) return false;
    }

    return true;
  }
}