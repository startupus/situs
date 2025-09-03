import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthSimpleService } from '../auth-simple.service';

/**
 * Упрощенный JWT Guard для тестирования
 */
@Injectable()
export class SimpleJwtGuard implements CanActivate {
  constructor(private readonly authService: AuthSimpleService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.substring(7);

    // Простая проверка тестового токена
    if (token === 'test-token-12345') {
      request.user = {
        id: 'test-user-id',
        sub: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
      };
      return true;
    }

    const user = await this.authService.validateToken(token);
    if (!user) {
      return false;
    }

    request.user = user;
    return true;
  }
}
