import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SCOPES_KEY, ProjectScope, AccountScope } from '../decorators/roles.decorator';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredScopes = this.reflector.getAllAndOverride<Array<ProjectScope | AccountScope>>(SCOPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredScopes || requiredScopes.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = (request as any).user as { id: string; globalRole?: string } | undefined;
    if (!user?.id) return false;

    if (user.globalRole === 'SUPER_ADMIN') return true;

    const params = request.params || {};
    const query = request.query || {};

    // projectId: из params (projectId или id), либо из query
    let projectId: string | undefined = params.projectId || params.id || query.projectId;

    // accountId: из params, либо /api/accounts/:id → трактуем как accountId, либо из query
    let accountId: string | undefined = params.accountId || query.accountId;
    if (!accountId && request.originalUrl?.startsWith('/api/accounts/') && params.id) accountId = params.id;

    const projectScopes = requiredScopes.filter((s) => String(s).startsWith('PROJECT_')) as ProjectScope[];
    if (projectScopes.length > 0) {
      if (!projectId) return false;
      const access = await this.prisma.projectAccess.findFirst({ where: { projectId, userId: user.id } });
      if (!access) return false;
      const role = access.role as string;
      const canWrite = role === 'OWNER' || role === 'ADMIN' || role === 'EDITOR';
      const canRead = canWrite || role === 'VIEWER';
      for (const scope of projectScopes) {
        if (scope === 'PROJECT_ADMIN' && !(role === 'OWNER' || role === 'ADMIN')) return false;
        if (scope === 'PROJECT_WRITE' && !canWrite) return false;
        if (scope === 'PROJECT_READ' && !canRead) return false;
      }
    }

    const accountScopes = requiredScopes.filter((s) => String(s).startsWith('ACCOUNT_')) as AccountScope[];
    if (accountScopes.length > 0) {
      if (!accountId) return false;
      const membership = await this.prisma.accountMembership.findFirst({ where: { accountId, userId: user.id } });
      if (!membership) return false;
      const role = membership.role as string; // OWNER|ADMIN|MANAGER|MEMBER
      const canAdmin = role === 'OWNER' || role === 'ADMIN';
      const canWrite = canAdmin || role === 'MANAGER';
      const canRead = canWrite || role === 'MEMBER';
      for (const scope of accountScopes) {
        if (scope === 'ACCOUNT_ADMIN' && !canAdmin) return false;
        if (scope === 'ACCOUNT_WRITE' && !canWrite) return false;
        if (scope === 'ACCOUNT_READ' && !canRead) return false;
      }
    }

    return true;
  }
}