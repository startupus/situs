import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';

/**
 * Guard для JWT авторизации
 * 
 * Используется для защиты приватных endpoint'ов
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) { super(); }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    const url: string = req.originalUrl || req.url || '';

    // Dev/test token bypass: Authorization or query ?token=
    const authHeader: string | undefined = req.headers?.authorization;
    const qToken: string | undefined = (req.query?.token as string) || undefined;
    const token = (authHeader && authHeader.startsWith('Bearer ')) ? authHeader.substring(7) : qToken;
    if (token === 'test-token-12345') {
      (req as any).user = { id: 'test-user-id', email: 'test@example.com', name: 'Test User', globalRole: 'SUPER_ADMIN', scopes: [] };
      return true;
    }

    // Allowlist для публичных эндпоинтов
    const allow = [
      /^\/health$/,
      /^\/$/,
      /^\/robots\.txt$/,
      /^\/sitemap\.xml$/,
      /^\/api\/projects\/events$/,
      /^\/api\/projects\/heartbeat$/,
      /^\/auth\//,
      /^\/api\/auth\//,
    ];
    if (allow.some((re) => re.test(url))) return true;

    return super.canActivate(context) as any;
  }
}
